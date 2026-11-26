import { describe, expect, it } from 'vitest';
import {
  DynamoStoreAdapter,
  S3BackupStoreAdapter,
  S3ExportStoreAdapter,
  createAwsStoreAdapters,
  dynamoKey,
  s3ObjectKey,
  type DynamoClientLike,
  type S3ClientLike,
} from './index.js';

/** Fake SDK-shaped clients backed by Maps. Unit-test doubles only, not AWS evidence. */
function fakeDynamo(opts: { failRead?: Error } = {}) {
  const tables = new Map<string, Map<string, Record<string, unknown>>>();
  const t = (n: string) => tables.get(n) ?? tables.set(n, new Map()).get(n)!;
  const id = (k: { PK: string; SK: string }) => `${k.PK}|${k.SK}`;
  const calls: string[] = [];
  const client: DynamoClientLike = {
    async getItem(i) {
      calls.push(`get:${i.TableName}`);
      if (opts.failRead) throw opts.failRead;
      return { Item: t(i.TableName).get(id(i.Key)) };
    },
    async putItem(i) {
      t(i.TableName).set(id(i.Item as { PK: string; SK: string }), i.Item);
    },
    async deleteItem(i) {
      calls.push(`del:${i.TableName}:${i.Key.PK}`);
      t(i.TableName).delete(id(i.Key));
    },
    async query(i) {
      const pk = i.ExpressionAttributeValues[':pk'];
      // Like real DynamoDB: items sorted by SK, and paging resumes strictly after the last returned key,
      // so deleting earlier pages while paging does not skip items.
      const after = i.ExclusiveStartKey ? String(i.ExclusiveStartKey.SK) : undefined;
      const items = [...t(i.TableName).values()]
        .filter((x) => x.PK === pk && (after === undefined || String(x.SK) > after))
        .sort((a, b) => (String(a.SK) < String(b.SK) ? -1 : 1));
      // two items per page to exercise pagination
      const page = items.slice(0, 2).map(({ PK, SK }) => ({ PK, SK }));
      const last = page[page.length - 1];
      return { Items: page, LastEvaluatedKey: items.length > 2 && last ? { PK: last.PK, SK: last.SK } : undefined };
    },
  };
  return { client, calls };
}

function fakeS3(opts: { headError?: unknown } = {}) {
  const objs = new Set<string>();
  const client: S3ClientLike = {
    async putObject(i) {
      objs.add(`${i.Bucket}/${i.Key}`);
    },
    async deleteObject(i) {
      objs.delete(`${i.Bucket}/${i.Key}`);
    },
    async headObject(i) {
      if (opts.headError) throw opts.headError;
      if (!objs.has(`${i.Bucket}/${i.Key}`)) throw Object.assign(new Error('nf'), { name: 'NotFound' });
    },
    async listObjectsV2(i) {
      // Like real S3: keys in lexicographic order, and the continuation token resumes after the last returned key.
      const keys = [...objs]
        .filter((k) => k.startsWith(`${i.Bucket}/${i.Prefix}`))
        .map((k) => k.slice(i.Bucket.length + 1))
        .filter((k) => !i.ContinuationToken || k > i.ContinuationToken)
        .sort();
      const page = keys.slice(0, 2);
      const more = keys.length > 2;
      return {
        Contents: page.map((Key) => ({ Key })),
        IsTruncated: more,
        NextContinuationToken: more ? page[page.length - 1] : undefined,
      };
    },
  };
  return { client, objs };
}

describe('DynamoStoreAdapter', () => {
  it('seed/observe/delete round trip with run-scoped keys', async () => {
    const { client } = fakeDynamo();
    const a = new DynamoStoreAdapter('primary', client, 'primary-table');
    expect((await a.observe('run1', 's1', 1)).state).toBe('ABSENT');
    await a.seed('run1', 's1', 1);
    expect((await a.observe('run1', 's1', 1)).state).toBe('PRESENT');
    expect((await a.observe('run2', 's1', 1)).state).toBe('ABSENT');
    expect((await a.observe('run1', 's1', 2)).state).toBe('ABSENT');
    await a.delete('run1', 's1', 1);
    expect((await a.observe('run1', 's1', 1)).state).toBe('ABSENT');
    expect(dynamoKey('r', 's', 3)).toEqual({ PK: 'RUN#r', SK: 'SUBJECT#s#GEN#3' });
  });

  it('observe returns UNKNOWN with a bounded code when the read fails', async () => {
    const { client } = fakeDynamo({ failRead: Object.assign(new Error('arn:aws:secret details'), { name: 'AccessDeniedException' }) });
    const r = await new DynamoStoreAdapter('analytics', client, 'analytics-table').observe('run1', 's1', 1);
    expect(r.state).toBe('UNKNOWN');
    expect(r.errorCode).toBe('AccessDeniedException');
    expect(JSON.stringify(r)).not.toContain('arn:');
  });

  it('reset removes only the target run across pages', async () => {
    const { client, calls } = fakeDynamo();
    const a = new DynamoStoreAdapter('primary', client, 'primary-table');
    for (let g = 0; g < 5; g++) await a.seed('run1', 's1', g);
    await a.seed('run2', 's1', 0);
    await a.reset('run1');
    for (let g = 0; g < 5; g++) expect((await a.observe('run1', 's1', g)).state).toBe('ABSENT');
    expect((await a.observe('run2', 's1', 0)).state).toBe('PRESENT');
    expect(calls.filter((c) => c.startsWith('del:')).every((c) => c.endsWith('RUN#run1'))).toBe(true);
  });

  it('rejects invalid IDs and non-allowlisted stores before any call', async () => {
    const { client, calls } = fakeDynamo();
    const a = new DynamoStoreAdapter('primary', client, 'primary-table');
    await expect(a.observe('../x', 's', 1)).rejects.toThrow('Invalid runId');
    await expect(a.delete('r', 's;DROP', 1)).rejects.toThrow('Invalid subjectId');
    await expect(a.seed('r', 's', -1)).rejects.toThrow('Invalid generation');
    await expect(a.reset('a/b')).rejects.toThrow('Invalid runId');
    expect(() => new DynamoStoreAdapter('export' as never, client, 'tbl-x')).toThrow();
    expect(() => new DynamoStoreAdapter('primary', client, 'bad name!')).toThrow('Invalid tableName');
    expect(calls).toEqual([]);
  });

  it('reset surfaces failure instead of succeeding silently', async () => {
    const { client } = fakeDynamo();
    client.query = async () => {
      throw new Error('boom');
    };
    await expect(new DynamoStoreAdapter('primary', client, 'primary-table').reset('run1')).rejects.toThrow('boom');
  });
});

describe('S3ExportStoreAdapter', () => {
  it('seed/observe/delete with run-scoped keys', async () => {
    const { client, objs } = fakeS3();
    const a = new S3ExportStoreAdapter(client, 'export-bucket');
    await a.seed('run1', 's1', 1);
    expect([...objs]).toEqual([`export-bucket/${s3ObjectKey('run1', 's1', 1)}`]);
    expect((await a.observe('run1', 's1', 1)).state).toBe('PRESENT');
    expect((await a.observe('run2', 's1', 1)).state).toBe('ABSENT');
    await a.delete('run1', 's1', 1);
    expect((await a.observe('run1', 's1', 1)).state).toBe('ABSENT');
  });

  it('403 and other errors are UNKNOWN, not ABSENT', async () => {
    for (const headError of [
      Object.assign(new Error('x'), { name: 'Forbidden', $metadata: { httpStatusCode: 403 } }),
      new Error('network down'),
    ]) {
      const r = await new S3ExportStoreAdapter(fakeS3({ headError }).client, 'export-bucket').observe('run1', 's1', 1);
      expect(r.state).toBe('UNKNOWN');
      expect(r.errorCode).toBeTruthy();
    }
  });

  it('404 status without a name is ABSENT', async () => {
    const headError = { $metadata: { httpStatusCode: 404 } };
    expect((await new S3ExportStoreAdapter(fakeS3({ headError }).client, 'export-bucket').observe('r', 's', 0)).state).toBe('ABSENT');
  });

  it('reset deletes only the run prefix across pages', async () => {
    const { client, objs } = fakeS3();
    const a = new S3ExportStoreAdapter(client, 'export-bucket');
    for (let g = 0; g < 5; g++) await a.seed('run1', 's1', g);
    await a.seed('run10', 's1', 0); // prefix-sibling must survive
    await a.seed('run2', 's1', 0);
    await a.reset('run1');
    expect([...objs].sort()).toEqual([
      `export-bucket/${s3ObjectKey('run10', 's1', 0)}`,
      `export-bucket/${s3ObjectKey('run2', 's1', 0)}`,
    ]);
  });

  it('rejects invalid IDs', async () => {
    const a = new S3ExportStoreAdapter(fakeS3().client, 'export-bucket');
    await expect(a.observe('r/../x', 's', 1)).rejects.toThrow('Invalid runId');
    await expect(a.seed('r', 's/..', 1)).rejects.toThrow('Invalid subjectId');
  });
});

describe('S3BackupStoreAdapter', () => {
  it('uses its own bucket and a backup key prefix, separate from export', async () => {
    const { client, objs } = fakeS3();
    const b = new S3BackupStoreAdapter(client, 'backup-bucket');
    const e = new S3ExportStoreAdapter(client, 'export-bucket');
    expect(b.storeId).toBe('backup');
    expect(e.storeId).toBe('export');
    await b.seed('run1', 's1', 1);
    expect([...objs]).toEqual([`backup-bucket/runs/run1/backup/s1/gen-1.json`]);
    expect((await b.observe('run1', 's1', 1)).state).toBe('PRESENT');
    expect((await e.observe('run1', 's1', 1)).state).toBe('ABSENT');
  });
  it('a failed read is UNKNOWN, never ABSENT', async () => {
    const r = await new S3BackupStoreAdapter(fakeS3({ headError: new Error('down') }).client, 'backup-bucket').observe('run1', 's1', 1);
    expect(r.state).toBe('UNKNOWN');
  });
  it('reset deletes only the run backup prefix', async () => {
    const { client, objs } = fakeS3();
    const b = new S3BackupStoreAdapter(client, 'backup-bucket');
    await b.seed('run1', 's1', 1);
    await b.seed('run10', 's1', 1);
    await b.reset('run1');
    expect([...objs]).toEqual([`backup-bucket/runs/run10/backup/s1/gen-1.json`]);
  });
});
describe('createAwsStoreAdapters', () => {
  it('builds four independent adapters and rejects shared tables or buckets', () => {
    const clients = { dynamo: fakeDynamo().client, s3: fakeS3().client };
    const adapters = createAwsStoreAdapters(clients, { primaryTable: 'p-table', analyticsTable: 'a-table', exportBucket: 'e-bucket', backupBucket: 'b-bucket' });
    expect(adapters.map((a) => a.storeId)).toEqual(['primary', 'analytics', 'export', 'backup']);
    expect(() => createAwsStoreAdapters(clients, { primaryTable: 'same', analyticsTable: 'same', exportBucket: 'e-bucket', backupBucket: 'b-bucket' })).toThrow();
    expect(() => createAwsStoreAdapters(clients, { primaryTable: 'p-table', analyticsTable: 'a-table', exportBucket: 'same-b', backupBucket: 'same-b' })).toThrow();
  });

  it('stores are independent: deleting from primary leaves analytics copy observable', async () => {
    const clients = { dynamo: fakeDynamo().client, s3: fakeS3().client };
    const [p, a] = createAwsStoreAdapters(clients, { primaryTable: 'p-table', analyticsTable: 'a-table', exportBucket: 'e-bucket', backupBucket: 'b-bucket' });
    await p.seed('run1', 's1', 1);
    await a.seed('run1', 's1', 1);
    await p.delete('run1', 's1', 1);
    expect((await p.observe('run1', 's1', 1)).state).toBe('ABSENT');
    expect((await a.observe('run1', 's1', 1)).state).toBe('PRESENT');
  });
});
