# MSP API - CLI Design (JSON VERSION)

**MSP API:** https://docs.firewalla.net/
**CLI Design Details:** MSP API - CLI Design Details

## Global CLI Behavior

* **JSON by Default:** All resource-fetching commands output raw, structured JSON to `stdout` by default. No `--json` flag is required.
* **Smart Box Routing:** If the authenticated MSP account only has one Firewalla box, the CLI automatically routes all requests to that box. If the account manages multiple boxes, the user/agent must pass the `--box <gid>` flag to specify the target. *(The examples below assume a single-box environment or that the `FIREWALLA_BOX_GID` environment variable is set).*

---

## Boxes

**Docs:** https://docs.firewalla.net/data-models/box/
**API Reference:** `GET /v2/boxes` https://docs.firewalla.net/api-reference/box/

### List Boxes
**Input:** `fw boxes list`
**API:** `GET /v2/boxes`
**Output:** Displays all Firewalla boxes managed under the MSP account.
```json
[
  {
    "gid": "00000000-0000-0000-0000-000000000000",
    "name": "Home",
    "model": "gold",
    "online": true,
    "version": "1.977",
    "publicIP": "198.51.100.2"
  },
  {
    "gid": "00000000-0000-0000-0000-111111111111",
    "name": "Home Lab",
    "model": "purple",
    "online": false,
    "version": "1.976",
    "publicIP": "198.51.100.3"
  }
]
