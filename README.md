# fw-msp-cli

A new CLI for all of Firewalla MSP to simplify your MSP API.

> [!NOTE]
> This is **not** an officially supported Firewalla product.

Designed for both human operators and AI agents, `fw` outputs structured JSON by default, and relies on RESTful 1:1 API mappings.

---

## Authentication

The `fw` CLI requires a valid Firewalla MSP API token to authenticate requests. You can provide your token using one of the following methods:

### Method 1: Environment Variable (Recommended for AI Agents & CI/CD)
Export your Personal Access Token (PAT) directly into your shell environment. AI agents should be configured to inject this variable into their execution environment.

```bash
export FIREWALLA_TOKEN="your_msp_api_token_here"
fw boxes list
