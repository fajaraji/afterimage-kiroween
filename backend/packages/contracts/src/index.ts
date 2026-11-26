/** Shared types. Runtime parsers live in ./validate.ts and are re-exported below. */
export * from './validate.js';
export type ObservationState = 'PRESENT' | 'ABSENT' | 'UNKNOWN';
export type AssertionVerdict = 'PASS' | 'FAIL' | 'UNKNOWN';
export type ConsumerMode = 'unsafe' | 'protected';
export type RunStatus = 'queued' | 'running' | 'completed' | 'failed';
export type StoreId = 'primary' | 'analytics' | 'export' | 'backup';

export interface StoreObservation {
  evidenceId: string;
  storeId: StoreId;
  subjectId: string;
  generation: number;
  state: ObservationState;
  observedAt: string;
  errorCode?: string;
}
export interface ReplayEvent {
  eventId: string;
  subjectId: string;
  generation: number;
  sequence: number;
  kind: 'CREATE' | 'UPSERT' | 'DELETE' | 'HOLD' | 'RELEASE';
}
export interface RunEvidence {
  schemaVersion: '1';
  runId: string;
  scenarioId: string;
  fixtureHash: string;
  mode: ConsumerMode;
  status: RunStatus;
  verdict: AssertionVerdict;
  requiredStores: StoreId[];
  observations: StoreObservation[];
  events: ReplayEvent[];
  limitations: string[];
}


/** V4 proposal only: server-owned audit artifacts. Not an implemented guard/gateway. */
export type ActionActorKind = 'scenario-runner' | 'human' | 'simulated-agent';
export type SyntheticOperation = 'READ_SYNTHETIC_RECORD' | 'DELETE_SYNTHETIC_RECORD' | 'DROP_SYNTHETIC_TABLE_PROPOSAL';
export type ActionPolicyOutcome = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
export type ActionExecutionStatus = 'NOT_EXECUTED' | 'SUCCEEDED' | 'FAILED';

export interface ActionIntent {
  intentId: string;
  runId: string;
  actorKind: ActionActorKind;
  operation: SyntheticOperation;
  syntheticTargetId: string;
  canonicalPayloadDigest: string;
  createdAt: string;
}
export interface ActionPolicyDecision {
  decisionId: string;
  intentId: string;
  policyVersion: string;
  outcome: ActionPolicyOutcome;
  reasonCode: string;
  decidedAt: string;
}
export interface ActionExecutionReceipt {
  intentId: string;
  status: ActionExecutionStatus;
  executionId?: string;
  providerRequestId?: string;
  completedAt: string;
}
export interface IndependentPostActionObservation {
  observationId: string;
  intentId: string;
  storeId: StoreId;
  state: ObservationState;
  observedAt: string;
  errorCode?: string;
}
export interface ActionEvidenceTrace {
  schemaVersion: '1';
  intent: ActionIntent;
  policy: ActionPolicyDecision;
  receipt: ActionExecutionReceipt;
  postActionObservations: IndependentPostActionObservation[];
}
