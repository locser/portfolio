> [!NOTE]
> Detailed command guides and explanations have been compiled into [devops-setup-guide.md](file:///c:/ai-projects/my-porfolio/portfolio/docs/devops-setup-guide.md) to assist with manual server configuration steps.

## 1. Ubuntu Server & Coolify Setup

- [ ] 1.1 SSH into the Ubuntu Server via VPN and update package list (`sudo apt update && sudo apt upgrade -y`)
- [ ] 1.2 Enable Swap space on the server to prevent RAM exhaustion during Next.js builds (at least 2-4GB Swap)
- [ ] 1.3 Install Coolify using the one-line installation script (`curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`)
- [ ] 1.4 Access the Coolify dashboard at `http://<YOUR_UBUNTU_VPN_IP>:8000` and create the initial Admin account
- [ ] 1.5 Create a new Project in Coolify named `portfolio-production` and configure a standard Destination (Local Docker)

## 2. GitHub Self-Hosted Runner Setup

- [ ] 2.1 Navigate to your GitHub Repository -> Settings -> Actions -> Runners -> New self-hosted runner
- [ ] 2.2 SSH into the Ubuntu Server and create a dedicated user directory for the runner
- [ ] 2.3 Download and configure the GitHub runner binary using the instructions provided by GitHub (using your repository registration token)
- [ ] 2.4 Install the runner as a systemd service (`sudo ./svc.sh install`) and start it (`sudo ./svc.sh start`)
- [ ] 2.5 Verify that the runner appears as "Idle/Active" and "Online" in your GitHub Repository settings page

## 3. CI/CD Pipeline Configuration

- [x] 3.1 Create a new file in your local workspace `.github/workflows/deploy.yml`
- [x] 3.2 Configure the workflow to trigger on `push` to the main branch and set `runs-on: self-hosted` to target your private Ubuntu runner
- [x] 3.3 Add steps in the workflow to check out code, setup Node.js, install dependencies, run linter/tests, and build the Next.js app
- [ ] 3.4 Generate a Coolify Deploy Webhook URL inside the Coolify dashboard for your Next.js application
- [ ] 3.5 Store the Coolify webhook URL as a Repository Secret in GitHub (`COOLIFY_DEPLOY_WEBHOOK`)
- [x] 3.6 Add a step in the GitHub workflow to trigger the Coolify redeployment webhook using `curl` after successful test execution

## 4. Deploy & Verify

- [ ] 4.1 Commit all repository changes and push them to GitHub to trigger the self-hosted pipeline
- [ ] 4.2 Monitor the GitHub Actions console to verify that the self-hosted runner executes the workflow correctly
- [ ] 4.3 Monitor the Coolify build console on the Ubuntu Server to ensure Nixpacks builds the Next.js portfolio successfully
- [ ] 4.4 Configure local domain mapping in `/etc/hosts` for testing (e.g. `portfolio.local` pointing to the Ubuntu VPN IP)
- [ ] 4.5 Access the portfolio website via VPN and verify all routes, dynamic pages, and styles load correctly
