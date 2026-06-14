# Cloudflare Tunnel Runner

This document records the runner-side Cloudflare Tunnel model.

Cloudflare Tunnel is used to route ingress to private Daedalus services. It is not the data authority and it is not the system of record.

## Boundary Statement

Cloudflare is ingress, not the system of record.

The runner VM is the private service boundary.

The tunnel connects Cloudflare-managed ingress to services hosted inside the Daedalus runner environment. It must not be used as a reason to move raw evidence authority, durable twin state, or private processing state into Cloudflare.

## Runner Service Stack

The local service runtime is Docker Compose.

The foundational runner stack contains:

* `cloudflared`: tunnel connector for controlled ingress.
* `postgres`: private database for runner-owned service state and future twin storage.
* temporary `nginx` health service: simple HTTP endpoint used to prove routing and operational health during setup.

The temporary health service is not Daedalus application logic. It exists to prove that the tunnel and local runtime can route to a private service.

## Secret Handling

The tunnel token is a secret.

Rules:

* Do not commit the tunnel token.
* Do not paste the token into docs, issue comments, screenshots, or examples.
* Prefer environment variables or host-managed secret files.
* Rotate the token if it has appeared in shell history, terminal output, chat, logs, or repository content.
* Treat copied setup commands that contain the token as sensitive.

The example Compose file uses `${CLOUDFLARED_TOKEN}` deliberately. The real value belongs in the host environment or a local, ignored environment file.

## Routing Model

Current proven routing shape:

```text
Internet user or Cloudflare edge
  -> Cloudflare Tunnel
  -> cloudflared container on VM 100
  -> private service on the Compose network
```

Production runner routing should replace the temporary health service with the runner/API service while keeping the same ownership boundary.

## Operational Expectations

The runner host should be able to answer:

* Is the Compose stack up?
* Is `cloudflared` connected?
* Is the health route reachable through the tunnel?
* Is Postgres available only within the intended private boundary?
* Are tunnel credentials absent from the repository?

## Related Files

* [Daedalus Hosting Model](daedalus-hosting-model.md)
* [Local LLM Boundary](local-llm-boundary.md)
* [Private Evidence Processing ADR](../adr/ADR-0002-private-evidence-processing.md)
* [Docker Compose Example](../../ops/docker-compose.example.yml)
