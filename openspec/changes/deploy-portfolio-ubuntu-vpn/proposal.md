## Why

The goal is to learn modern DevOps practices by deploying this Next.js Portfolio project to a local Ubuntu Server that resides behind a private VPN. Deploying in a VPN-restricted environment introduces real-world infrastructure challenges (restricted external access, private networking, private CI/CD runners) that are perfect for learning advanced DevOps concepts like self-hosted runners, private container registries, internal DNS/routing, and self-hosted PaaS (Coolify) setup.

## What Changes

- **Infrastructure & PaaS Setup**: Install Docker and Coolify on the private Ubuntu Server to manage our deployments.
- **VPN Networking & Domain Routing**: Configure local/private domain resolution (e.g. `portfolio.local` or a VPN-resolved sub-domain) and secure SSL routing via Traefik in Coolify.
- **Private CI/CD Pipeline**: 
  - Since the server is behind a VPN and GitHub/GitLab SaaS cannot reach it via webhooks directly, we will set up a **GitHub Actions Self-hosted Runner** inside the Ubuntu Server (which has outbound internet access to GitHub even behind the VPN) to pull and execute deployment tasks.
  - Create a `.github/workflows/deploy.yml` workflow that triggers on git push, runs tests, builds the project, and deploys it to Coolify.
- **Application Configuration**:
  - Add a Dockerfile and docker-compose configurations or utilize Coolify's built-in Nixpacks deployment specifically customized for our Next.js project.

## Capabilities

### New Capabilities
- `devops-ubuntu-vpn-deployment`: Covers Ubuntu server preparation, Docker/Coolify installation behind VPN, configuring a GitHub Actions self-hosted runner, and automated Next.js building/deployment.

### Modified Capabilities
<!-- None -->

## Impact

- **Infrastructure**: New local Ubuntu server running Docker, Traefik, Coolify, and a GitHub self-hosted runner service.
- **Repository Changes**: Adds a `.github/workflows/deploy.yml` deployment pipeline configuration.
- **Next.js Portfolio Application**: No direct source code changes required for the web app, ensuring the code remains clean and standard.
