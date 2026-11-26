/**
 * AWS store adapters (spec 06 task 3, foundation task 6).
 *
 * STATUS: implemented and unit-tested against injected fake clients only. Nothing here
 * has been run against real AWS. Evidence of real behavior requires a deployed sandbox,
 * which needs explicit owner approval (spec 06 AWS-9).
 *
 * Design notes:
 * - No AWS SDK import. Adapters depend on the minimal structural client interfaces below
 *   (`DynamoClientLike`, `S3ClientLike`). A thin binding to @aws-sdk/lib-dynamodb and
 *   @aws-sdk/client-s3 is a separate step because adding those dependencies needs owner approval.
 * - Table and bucket names are server-owned constructor config, never request input.
 *   Callers pass only runId, subjectId and generation, validated against an opaque-ID pattern.
 * - Every key is derived from runId, so reset/delete/observe are run-scoped.
 * - `observe` is a direct, strongly consistent read. Any read failure yields UNKNOWN, never ABSENT.
 * - Store types mirror @afterimage/engine's StoreAdapter (structurally compatible).
 */

export const ALLOWLISTED_STORE_IDS = ['primary', 'analytics', 'exports'] as const;
export type AllowlistedStoreId = (typeof ALLOWLISTED_STORE_IDS)[number];
export type StoreObservationState = 'PRESENT' | 'ABSENT' | 'UNKNOWN';

export interface StoreObserveResult {
  storeId: AllowlistedStoreId;
  runId: string;
  subjectId: string;
  generation: number;
  state: StoreObservationState;
  errorCode?: string;
}

export interface AwsStoreAdapter {
  readonly storeId: AllowlistedStoreId;
  reset(runId: string): Promise<void>;
  delete(runId: string, subjectId: string, generation: number): Promise<void>;
  observe(runId: string, subjectId: string, generation: number): Promise<StoreObserveResult>;
  /** Writes one synthetic record (fixture seeding). */
  seed(runId: string, subjectId: string, generation: number): Promise<void>;
}

// ---- minimal client interfaces (DocumentClient-style plain objects) ----

export type DynamoKey = { PK: string; SK: string };

export interface DynamoClientLike {
  getItem(input: { TableName: string; Key: DynamoKey; ConsistentRead: true }): Promise<{ Item?: Record<string, unknown> }>;
  putItem(input: { TableName: string; Item: Record<string, unknown> }): Promise<unknown>;
  deleteItem(input: { TableName: string; Key: DynamoKey }): Promise<unknown>;
  query(input: {
    TableName: string;
    KeyConditionExpression: string;
    ExpressionAttributeValues: Record<string, string>;
    ProjectionExpression: string;
    ExpressionAttributeNames: Record<string, string>;
    ConsistentRead: true;
    ExclusiveStartKey?: Record<string, unknown>;
  }): Promise<{ Items?: Record<string, unknown>[]; LastEvaluatedKey?: Record<string, unknown> }>;
}

export interface S3ClientLike {
  putObject(input: { Bucket: string; Key: string; Body: string; ContentType: string }): Promise<unknown>;
  deleteObject(input: { Bucket: string; Key: string }): Promise<unknown>;
  headObject(input: { Bucket: string; Key: string }): Promise<unknown>;
  listObjectsV2(input: {
    Bucket: string;
    Prefix: string;
    ContinuationToken?: string;
  }): Promise<{ Contents?: { Key?: string }[]; IsTruncated?: boolean; NextContinuationToken?: string }>;
}

// ---- validation ----

const ID_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;
/** Hard cap on pages scanned during reset so a bad table cannot cause an unbounded loop. */
export const MAX_RESET_PAGES = 20;

function assertId(label: string, value: unknown): string {
  if (typeof value !== 'string' || !ID_PATTERN.test(value) || value === '.' || value === '..') {
    throw new Error(`Invalid ${label}`);
  }
  return value;
}

function assertGen(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error('Invalid generation');
  return value;
}

function assertConfigName(label: string, value: unknown): string {
  if (typeof value !== 'string' || value.length < 3 || value.length > 255 || !/^[A-Za-z0-9._-]+$/.test(value)) {
    throw new Error(`Invalid ${label}`);
  }
  return value;
}

function assertStoreId(value: unknown): AllowlistedStoreId {
  if (typeof value !== 'string' || !(ALLOWLISTED_STORE_IDS as readonly string[]).includes(value)) {
    throw new Error('Store not allowlisted');
  }
  return value as AllowlistedStoreId;
}

/** Reduces an SDK error to a bounded, secret-free code (error name only, never message). */
export function safeErrorCode(err: unknown): string {
  const name = (err as { name?: unknown } | null)?.name;
  return typeof name === 'string' && /^[A-Za-z0-9_]{1,64}$/.test(name) ? name : 'READ_FAILED';
}

// ---- DynamoDB adapter (primary and analytics) ----

export const dynamoKey = (runId: string, subjectId: string, generation: number): DynamoKey => ({
  PK: `RUN#${runId}`,
  SK: `SUBJECT#${subjectId}#GEN#${generation}`,
});

export class DynamoStoreAdapter implements AwsStoreAdapter {
  readonly storeId: AllowlistedStoreId;
  private readonly tableName: string;

  constructor(
    storeId: 'primary' | 'analytics',
    private readonly client: DynamoClientLike,
    tableName: string,
  ) {
    this.storeId = assertStoreId(storeId);
    if (storeId !== 'primary' && storeId !== 'analytics') throw new Error('DynamoStoreAdapter serves primary/analytics only');
    this.tableName = assertConfigName('tableName', tableName);
  }

  async seed(runId: string, subjectId: string, generation: number): Promise<void> {
    const key = this.key(runId, subjectId, generation);
    await this.client.putItem({
      TableName: this.tableName,
      Item: { ...key, runId, subjectId, generation, synthetic: true },
    });
  }

  async delete(runId: string, subjectId: string, generation: number): Promise<void> {
    await this.client.deleteItem({ TableName: this.tableName, Key: this.key(runId, subjectId, generation) });
  }

  async reset(runId: string): Promise<void> {
    assertId('runId', runId);
    let startKey: Record<string, unknown> | undefined;
    for (let page = 0; page < MAX_RESET_PAGES; page++) {
      const res = await this.client.query({
        TableName: this.tableName,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: { '#pk': 'PK', '#sk': 'SK' },
        ExpressionAttributeValues: { ':pk': `RUN#${runId}` },
        ProjectionExpression: '#pk, #sk',
        ConsistentRead: true,
        ...(startKey ? { ExclusiveStartKey: startKey } : {}),
      });
      for (const item of res.Items ?? []) {
        const { PK, SK } = item as DynamoKey;
        // Defense in depth: never delete outside this run's partition.
        if (PK !== `RUN#${runId}` || typeof SK !== 'string') throw new Error('Reset aborted: unexpected key');
        await this.client.deleteItem({ TableName: this.tableName, Key: { PK, SK } });
      }
      startKey = res.LastEvaluatedKey;
      if (!startKey) return;
    }
    throw new Error('Reset incomplete: page limit reached');
  }

  async observe(runId: string, subjectId: string, generation: number): Promise<StoreObserveResult> {
    const key = this.key(runId, subjectId, generation);
    const base = { storeId: this.storeId, runId, subjectId, generation };
    try {
      const res = await this.client.getItem({ TableName: this.tableName, Key: key, ConsistentRead: true });
      return { ...base, state: res.Item ? 'PRESENT' : 'ABSENT' };
    } catch (err) {
      return { ...base, state: 'UNKNOWN', errorCode: safeErrorCode(err) };
    }
  }

  private key(runId: string, subjectId: string, generation: number): DynamoKey {
    return dynamoKey(assertId('runId', runId), assertId('subjectId', subjectId), assertGen(generation));
  }
}

// ---- S3 export adapter ----

export const s3RunPrefix = (runId: string): string => `runs/${runId}/exports/`;
export const s3ObjectKey = (runId: string, subjectId: string, generation: number): string =>
  `${s3RunPrefix(runId)}${subjectId}/gen-${generation}.json`;

function isNotFound(err: unknown): boolean {
  const e = err as { name?: unknown; $metadata?: { httpStatusCode?: unknown } } | null;
  // 404 only. A 403 (e.g. no ListBucket permission on a missing key) is NOT proof of absence.
  return e?.name === 'NotFound' || e?.name === 'NoSuchKey' || e?.$metadata?.httpStatusCode === 404;
}

export class S3ExportStoreAdapter implements AwsStoreAdapter {
  readonly storeId = 'exports' as const;
  private readonly bucket: string;

  /** Non-versioned buckets only: a versioned bucket would need ListObjectVersions (P1). */
  constructor(
    private readonly client: S3ClientLike,
    bucketName: string,
  ) {
    this.bucket = assertConfigName('bucketName', bucketName);
  }

  async seed(runId: string, subjectId: string, generation: number): Promise<void> {
    await this.client.putObject({
      Bucket: this.bucket,
      Key: this.key(runId, subjectId, generation),
      Body: JSON.stringify({ runId, subjectId, generation, synthetic: true }),
      ContentType: 'application/json',
    });
  }

  async delete(runId: string, subjectId: string, generation: number): Promise<void> {
    await this.client.deleteObject({ Bucket: this.bucket, Key: this.key(runId, subjectId, generation) });
  }

  async reset(runId: string): Promise<void> {
    const prefix = s3RunPrefix(assertId('runId', runId));
    let token: string | undefined;
    for (let page = 0; page < MAX_RESET_PAGES; page++) {
      const res = await this.client.listObjectsV2({
        Bucket: this.bucket,
        Prefix: prefix,
        ...(token ? { ContinuationToken: token } : {}),
      });
      for (const obj of res.Contents ?? []) {
        if (typeof obj.Key !== 'string' || !obj.Key.startsWith(prefix)) throw new Error('Reset aborted: unexpected key');
        await this.client.deleteObject({ Bucket: this.bucket, Key: obj.Key });
      }
      if (!res.IsTruncated) return;
      token = res.NextContinuationToken;
      if (!token) throw new Error('Reset aborted: missing continuation token');
    }
    throw new Error('Reset incomplete: page limit reached');
  }

  async observe(runId: string, subjectId: string, generation: number): Promise<StoreObserveResult> {
    const key = this.key(runId, subjectId, generation);
    const base = { storeId: this.storeId, runId, subjectId, generation };
    try {
      await this.client.headObject({ Bucket: this.bucket, Key: key });
      return { ...base, state: 'PRESENT' };
    } catch (err) {
      if (isNotFound(err)) return { ...base, state: 'ABSENT' };
      return { ...base, state: 'UNKNOWN', errorCode: safeErrorCode(err) };
    }
  }

  private key(runId: string, subjectId: string, generation: number): string {
    return s3ObjectKey(assertId('runId', runId), assertId('subjectId', subjectId), assertGen(generation));
  }
}

// ---- registry ----

export interface AwsStoreConfig {
  primaryTable: string;
  analyticsTable: string;
  exportBucket: string;
}

export function createAwsStoreAdapters(
  clients: { dynamo: DynamoClientLike; s3: S3ClientLike },
  config: AwsStoreConfig,
): readonly AwsStoreAdapter[] {
  if (config.primaryTable === config.analyticsTable) throw new Error('Primary and analytics tables must be independent');
  return [
    new DynamoStoreAdapter('primary', clients.dynamo, config.primaryTable),
    new DynamoStoreAdapter('analytics', clients.dynamo, config.analyticsTable),
    new S3ExportStoreAdapter(clients.s3, config.exportBucket),
  ];
}
