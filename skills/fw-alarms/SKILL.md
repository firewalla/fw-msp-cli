# Firewalla MSP CLI - Alarms Skill

## Description
This skill enables the agent to interact with Firewalla security alarms. You can fetch recent alarms, filter by device or status, and archive alarms that have been resolved or acknowledged.

## Core Rules
1. **Always use `--params` for GET requests:** Filter parameters are passed via a valid JSON string map (e.g., `--params '{"status": "active"}'`). Do not hallucinate flags like `--active`.
2. **Box Routing:** If the user has multiple boxes, you MUST append `--box <gid>` to every command. If they have only one box, it will automatically route.
3. **JSON Parsing:** All `list` commands return structured JSON arrays containing alarm objects.

## Commands

### List Alarms
Fetches a list of alarms. Use `--params` to filter the results based on the API schema.

**Syntax:** `fw alarms list [flags]`

**Examples:**
* List the 25 most recent alarms:
  `fw alarms list --params '{"limit": 25}'`
* List only active (unresolved) alarms:
  `fw alarms list --params '{"status": "active"}'`
* List alarms specific to a device MAC address:
  `fw alarms list --params '{"query": "device.id:AA:BB:CC:DD:EE:FF"}'`
* Combine filters (Active alarms for a specific device, limit 5):
  `fw alarms list --params '{"status": "active", "query": "device.id:AA:BB:CC:DD:EE:FF", "limit": 5}'`

## Typical Agent Workflow
If a user asks you to "check for security issues on the network":
1. Run `fw alarms list --params '{"status": "active"}'`.
2. Analyze the returned JSON array to identify the devices causing the alarms.
3. If the user asks you to dismiss them, run `fw alarms update --id <id> --json '{"status": "archived"}'` for each relevant alarm ID.
