# Daedalus Hosting Model

This document records the current hosting boundary proven by the foundational infrastructure work.

It is an operational architecture note. It does not add runtime behaviour, production secrets, database schemas, or processing logic.

## Core Boundary

```text
Cloudflare is ingress, not the system of record.
The runner VM is the private service boundary.
The LLM VM is a worker, not an authority.
```

Cloudflare provides public ingress and demo UI hosting. It does not own raw evidence, durable twins, extraction authority, or private service state.

## Deployment Roles

### Cloudflare Pages

Cloudflare Pages hosts the public and demo-facing UI only.

Pages may serve:

* demo/import shell UI
* public portal surfaces
* static frontend assets
* low-state public documentation or status pages

Pages must not be treated as the system of record for raw evidence, compiled twins, private extraction outputs, or customer operational state.

### Cloudflare Tunnel

Cloudflare Tunnel routes controlled ingress to private services.

The tunnel is an ingress path into the private Daedalus runtime. It does not change ownership of data or processing. Anything behind the tunnel remains part of Daedalus private infrastructure.

Tunnel credentials are secrets. Any tunnel token used during setup must be rotated if it has been exposed in logs, shell history, chat, screenshots, or repository content.

### VM 100: Runner/API/Database Host

VM 100 is the private service boundary for the runner deployment.

It owns:

* Docker Compose local service runtime
* Daedalus runner/API service when enabled
* Postgres or equivalent private twin store
* temporary health service used to prove tunnel routing
* private service configuration

VM 100 is the authority for runner API state and durable database-backed service state.

### VM 102: Future LLM/STT Worker Host

VM 102 is reserved for local speech-to-text and LLM processing.

It may later run:

* Whisper or equivalent STT
* a local model runtime
* extraction workers
* model-side batch jobs

VM 102 is a worker. It should not become the authority for durable twin state or product decisions. It consumes work from the runner boundary and returns bounded extraction outputs with provenance.

### Daedalus Codex Environment

The Codex environment is development only.

It may be used to edit code, write documentation, run tests, inspect local fixtures, and prepare pull requests. It is not a production evidence-processing host and must not become an implicit store for raw customer evidence.

## Future Repository Split

The intended operational split is:

* `daedalus-runner`: API, Postgres, private twin store, orchestration boundary.
* `daedalus-llm`: Whisper, local model runtime, extraction workers.
* `daedalus-codex`: development-only workspace and automation support.

This split preserves the authority boundary:

```text
Cloudflare ingress
  -> daedalus-runner private authority
  -> daedalus-llm worker processing
```

## Non-Goals

This document does not:

* define service ports for production
* define the database schema
* add a tunnel credential
* choose a final LLM runtime
* permit external LLM APIs for core evidence processing
* make Cloudflare a system of record
