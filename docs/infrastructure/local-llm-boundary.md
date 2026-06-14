# Local LLM Boundary

This document defines the local speech-to-text and LLM processing boundary for Daedalus evidence processing.

It is a privacy and authority boundary. It does not select a final model, define extraction schemas, or implement worker queues.

## Core Rule

Raw evidence stays inside Daedalus infrastructure.

External LLM APIs are not required for core processing.

The local LLM host is a worker, not an authority.

## Evidence Boundary

Raw customer evidence includes:

* audio recordings
* transcripts
* photos and image-derived observations
* customer notes
* survey observations
* measurements
* provenance metadata that links evidence to a customer, property, asset, or service point

Core processing of this evidence should stay inside Daedalus-controlled infrastructure unless a future decision explicitly defines a provider interface, consent model, data minimisation rules, retention rules, and audit controls.

## VM Roles

### VM 100: Runner Authority

VM 100 owns runner/API state and database-backed private service state.

It should decide what work exists, where evidence is stored, what outputs are accepted, and which outputs become part of the durable twin store.

### VM 102: LLM/STT Worker

VM 102 is planned for local speech-to-text and LLM execution.

It may run:

* Whisper or another local STT service
* local model serving
* extraction workers
* bounded batch processing jobs

VM 102 should return outputs with evidence references, confidence, uncertainty, and provenance. It should not become the system of record for compiled twins.

## External LLM APIs

External LLM APIs are not required for core Daedalus processing.

They may be considered later only behind explicit provider interfaces. Any future provider path must preserve:

* raw evidence minimisation
* customer consent and operational policy
* provenance tracking
* output review boundaries
* no hidden promotion of provider output into durable truth
* the runner as the authority for accepted state

Until that future decision exists, the core architecture assumes local/private processing.

## Worker Output Boundary

LLM and STT workers may produce:

* transcripts
* extracted observations
* candidate relationships
* uncertainty notes
* evidence references
* processing metadata

Workers must not produce unbounded authority such as:

* final product recommendations
* quote selections
* hidden suitability scores
* irreversible twin state without runner acceptance
* policy decisions outside the constitutional boundary

## Related Decisions

The private processing boundary is recorded in [ADR-0002](../adr/ADR-0002-private-evidence-processing.md).
