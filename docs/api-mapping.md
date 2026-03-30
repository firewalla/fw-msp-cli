# Firewalla MSP API CLI Design

**MSP API Documentation:** https://docs.firewalla.net/

## Global CLI Behavior

- **JSON by Default:** All resource-fetching commands output raw, structured JSON to stdout by default. No `--json` flag is required.
- **Smart Box Routing:** If the authenticated MSP account only has one Firewalla box, the CLI automatically routes all requests to that box. If the account manages multiple boxes, the user/agent must pass the `--box <gid>` flag to specify the target.

> The examples below assume a single-box environment or that the `FIREWALLA_BOX_GID` environment variable is set.

---

## Alarms

**Docs:** https://docs.firewalla.net/data-models/alarm/  
**API Reference:** `GET /v2/alarms` https://docs.firewalla.net/api-reference/alarm/

### List Recent Alarms

**Input:** `fw alarms list --params '{"limit": 25}'`  
**API:** `GET /v2/alarms?limit=25`  
**Output:** Display a chronological list of the 25 most recent alarms triggered on the box.

```json
{
  "results": [
    {
      "gid": "00000000-0000-0000-0000-000000000000",
      "aid": 12345,
      "status": 1,
      "ts": 1730447700.000,
      "type": 12,
      "count": 1,
      "_type": "ALARM_VPN_RESTORE",
      "activeTs": 1730447700.000,
      "cloudaction": "",
      "vpn": {
        "deviceCount": 0,
        "id": "vpn_example",
        "name": "Example VPN",
        "strict": false,
        "subType": "",
        "type": "ipsec"
      },
      "message": "3rd-Party VPN (IPsec) to Example VPN is restored. Internet access on 0 device(s) is resumed."
    }
  ],
  "next_cursor": "example_cursor_value",
  "count": 1
}
```

### Limited Number of Alarms

**Input:** `fw alarms list --params '{"limit": 5}'`  
**API:** `GET /v2/alarms?limit=5`  
**Output:** Fetch a specific number of recent alarms (in this case, the 5 most recent).

**Note:** The API supports pagination via `limit` and `cursor` parameters. Device-based and status-based filtering are not supported by the Firewalla MSP API.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FIREWALLA_MSP_TOKEN` | Your MSP access token |
| `FIREWALLA_MSP_ID` | Your MSP domain (e.g., `your_subdomain.firewalla.net`) |
| `FIREWALLA_BOX_GID` | Your Firewalla box GID (optional if only one box) |