## Context

The developer is seeking a robust DevOps learning experience using an existing Next.js Portfolio application. The deployment target is a local physical or virtual Ubuntu server. However, this server is locked behind a private VPN, preventing public internet clients from making inbound connections. This makes standard Git-push-to-deploy platforms (like Vercel) or webhook-triggered CI/CD pipelines (like Render/Railway) impossible to use out-of-the-box. We must design a highly secure, outbound-only deployment pipeline using Coolify (a self-hosted PaaS) and a GitHub self-hosted runner.

## Goals / Non-Goals

**Goals:**
- Install Docker and Coolify on the private Ubuntu server to orchestrate containers.
- Establish a zero-inbound CI/CD pipeline using a GitHub Self-Hosted Runner running inside the private network.
- Deploy the Next.js portfolio application to Coolify using git-push automation.
- Expose the deployed application securely on the private VPN network via Traefik.

**Non-Goals:**
- Exposing the application to the public internet (the site will remain private to the VPN).
- Creating public DNS records or purchasing commercial SSL certificates (we will use private DNS or direct IP access).

## Decisions

### Decision 1: CI/CD Runner Architecture
- **Choice**: **GitHub Actions Self-Hosted Runner** installed directly on the Ubuntu server.
- **Rationale**: Because the server is behind a VPN, public GitHub SaaS runners cannot SSH into it. A self-hosted runner runs inside the private network and establishes a secure, outbound-only HTTPS polling connection to GitHub. It pulls jobs and executes them locally, avoiding any inbound firewall modifications.
- **Alternatives Considered**: 
  - *Public Runner + VPN Tunnel*: Running a standard GitHub Actions runner and using a VPN client (like Wireguard or Tailscale) inside the GitHub container to connect into the private network. This was rejected due to complex setup and security risks of giving public runners direct network access.
  - *Manual SSH Pulling*: Setting up a cron job on the server to `git pull` every few minutes. This is too crude and doesn't offer a true CI/CD experience.

### Decision 2: Deployment Orchestrator
- **Choice**: **Coolify PaaS**.
- **Rationale**: Coolify handles the complexity of Traefik reverse proxying, environment variable management, and automatic container building using Nixpacks. It provides an intuitive Web GUI, making it highly effective for learning DevOps concepts without getting bogged down in manual Nginx and Docker configurations.
- **Alternatives Considered**: 
  - *Manual Docker Compose + Nginx*: Requires hand-crafting Nginx configs, manual Dockerfile writing, and setting up Systemd services. It is a good learning exercise but lacks the streamlined feedback loop of modern PaaS.

### Decision 3: Domain Routing
- **Choice**: **Direct VPN IP with Custom Host Header / Local `/etc/hosts` mapping**.
- **Rationale**: For testing, we can access the app using the VPN IP of the server. To simulate a real domain, we can map `portfolio.local` to the server's private IP inside our local `/etc/hosts` file.
- **Alternatives Considered**: 
  - *Private DNS Server (e.g. Pi-hole / CoreDNS)*: Excellent if already running, but overkill to set up just for one project.

## Risks / Trade-offs

- **[Risk] High CPU/RAM consumption during Next.js build** → Next.js compiles using Rust-based tooling (SWC) which can consume significant memory and CPU, potentially stalling a small VPS or local machine.
  - *Mitigation*: Ensure the Ubuntu server has at least 2GB of RAM (and a swap file enabled). If resources are extremely limited, we can build the Docker image locally on the development machine and push it to a private container registry, then instruct Coolify to pull the pre-built image.
- **[Risk] VPN Connection Dropping** → The self-hosted runner loses connection to GitHub, causing builds to fail or queue endlessly.
  - *Mitigation*: Install the GitHub Runner as a system service. It will automatically restart and reconnect to GitHub once the network/VPN is restored.
