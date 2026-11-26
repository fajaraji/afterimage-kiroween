# ADR-0001: Synthetic-only deletion-resurrection lab

Status: Accepted for MVP (Nov 7, 2026).

Context: Production deletion tooling has substantial compliance/security implications and would require real systems and identities.

Decision: Four isolated synthetic stores (primary, analytics, export, backup) with allowlisted commands only; no arbitrary SQL, customer imports, or remote deletion API.

Consequences: Demo can prove scoped technical behavior but cannot claim live deployment readiness or universal erasure.
