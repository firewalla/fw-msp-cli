# Firewalla MSP CLI (`fw`) Context

The `fw` CLI provides stateless, AI-native access to the Firewalla MSP API. It outputs structured JSON by default and uses explicit routing to manage network devices, flows, rules, and alarms.

## Rules of Engagement for Agents
Agent Initialization Rule: If the target box is unknown, ALWAYS run fw boxes list first. Check the length of the returned JSON array. If there is more than one box, you MUST extract the correct gid and append --box <gid> to all subsequent commands. If there is only one box, you may omit the flag.

- **Stateless Execution:** Do not attempt to use interactive prompts or stateful login commands. Always pass `--box <gid>` to route commands to a specific firewall, or ensure the `FIREWALLA_BOX_GID` environment variable is set.
- **Query Parameter Mapping:** Do not hallucinate CLI flags for API filters (e.g., do not use `--online` or `--active`). All API query strings must be passed as a valid JSON map via the `--params` flag.
- **Context Window Protection:** Network APIs (like `flows` and `alarms`) can return massive JSON arrays. ALWAYS use the `limit` parameter inside your `--params` map (e.g., `--params '{"limit": 25}'`) to avoid overwhelming your context window.
- **Pagination Safety:** When a user requests a massive data dump (e.g., "export all flows"), use the `--page-all` flag. This will auto-paginate the API and stream the output as Newline Delimited JSON (NDJSON), allowing you to process it line-by-line.
- **Mutating Data:** For PUT/POST/PATCH operations, pass the request body payload via the `--json` flag. 

## Flag Glossary

- `--box <GID>` : Routes the request to a specific Firewalla box.
- `--params '<JSON>'` : URL/query parameters for GET requests (e.g., `{"limit": 25, "status": "active"}`).
- `--json '<JSON>'` : Request body payload for mutating methods.
- `--page-all` : Auto-paginates results and outputs NDJSON (one JSON object per line).
- `--id <ID>` : Targets a specific resource ID for `get` or `update` commands.

## Usage Patterns

### 1. Reading Data (GET/LIST)
Always use `--params` for filtering and querying.

```bash
# List online devices on a specific network segment
fw devices list --box <gid> --params '{"online": true, "query": "network.name:IoT"}'

# Fetch recent active alarms safely
fw alarms list --box <gid> --params '{"status": "active", "limit": 10}'
