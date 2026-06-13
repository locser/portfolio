## ADDED Requirements

### Requirement: Private Server Setup
The target machine running Ubuntu SHALL be provisioned with Docker Engine and the Coolify PaaS management plane to act as the primary hosting and container orchestration platform.

#### Scenario: Successful Coolify installation
- **WHEN** the operator executes the standard Coolify installation script on the Ubuntu server
- **THEN** Docker is installed, and the Coolify Dashboard is successfully initialized and accessible on port 8000.

### Requirement: Private Network Domain Resolution
The Traefik reverse proxy inside Coolify SHALL route local traffic using a private domain or direct VPN IP address to the Next.js Portfolio container.

#### Scenario: Accessing Next.js over VPN
- **WHEN** a user connected to the VPN navigates to the configured private URL (e.g., `http://portfolio.local` or the VPN IP)
- **THEN** Traefik dynamically proxies the request to the Next.js container, and the Portfolio homepage is returned successfully.

### Requirement: GitHub Actions Self-Hosted Runner Integration
The deployment system SHALL deploy a self-hosted runner process directly on the VPN-restricted Ubuntu server. This runner SHALL connect outbound to GitHub to listen for workflow jobs, eliminating the need for inbound public firewall ports.

#### Scenario: Workflow execution via private runner
- **WHEN** a developer pushes a code commit to the GitHub repository
- **THEN** the self-hosted runner polls the job, pulls the repository code locally, and executes the build commands.

### Requirement: Automated Next.js Deployment
The deployment pipeline SHALL build and register the Next.js application, triggering Coolify to redeploy the container with zero downtime.

#### Scenario: Next.js build and deploy success
- **WHEN** the self-hosted runner completes the build and invokes the Coolify local deployment webhook
- **THEN** Coolify pulls the updated Docker image or directory, executes Nixpacks compilation, and spawns the new Next.js container, seamlessly replacing the old one.
