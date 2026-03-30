# Firewalla MSP API CLI Design

**MSP API Documentation:** https://docs.firewalla.net/

## Global CLI Behavior

- **JSON by Default:** All resource-fetching commands output raw, structured JSON to stdout by default. No `--json` flag is required.
- **Smart Box Routing:** If the authenticated MSP account only has one Firewalla box, the CLI automatically routes all requests to that box. If the account manages multiple boxes, the user/agent must pass the `--box <gid>` flag to specify the target.

> The examples below assume a single-box environment or that the `FIREWALLA_BOX_GID` environment variable is set.

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
```

### Get Box Details

**Input:** `fw boxes get --id <gid>`  
**API:** `GET /v2/boxes?gid=<gid>`  
**Output:** Show hardware and OS details for the current box.

```json
{
  "gid": "00000000-0000-0000-0000-000000000000",
  "name": "Home",
  "model": "gold",
  "online": true,
  "version": "1.977",
  "publicIP": "198.51.100.2",
  "deviceCount": 10,
  "alarmCount": 20
}
```

---

## Devices

**Docs:** https://docs.firewalla.net/data-models/device/  
**API Reference:** `GET /v2/devices` https://docs.firewalla.net/api-reference/device/#get-devices

### List All Devices

**Input:** `fw devices list`  
**API:** `GET /v2/devices`  
**Output:** Show all devices with complete information.

```json
[
  {
    "id": "AA:BB:CC:DD:EE:FF",
    "name": "My Iphone",
    "ip": "192.168.120.1",
    "macVendor": "Apple Inc.",
    "online": true,
    "network": { "name": "Office", "id": "..." },
    "group": { "name": "Kid", "id": "15" },
    "totalDownload": 23456,
    "totalUpload": 12345
  },
  {
    "id": "AA:BB:CC:DD:EE:F1",
    "name": "Laptop",
    "ip": "192.168.120.2",
    "macVendor": "HP",
    "online": false,
    "network": { "name": "Home", "id": "..." },
    "group": { "name": "Parent", "id": "16" },
    "totalDownload": 6789,
    "totalUpload": 4567
  }
]
```

### List Devices with Specific Fields

**Input:** `fw devices list --params '{"fields": "id,name,mac,ip,online"}'`  
**API:** `GET /v2/devices`, then filter results  
**Output:** Show all devices with only main information.

```json
[
  {
    "id": "AA:BB:CC:DD:EE:FF",
    "name": "My Iphone",
    "ip": "192.168.120.1",
    "online": true
  },
  {
    "id": "AA:BB:CC:DD:EE:F1",
    "name": "Laptop",
    "ip": "192.168.120.2",
    "online": false
  }
]
```

### Search Devices by Name

**Input:** `fw devices list --params '{"name": "laptop"}'`  
**API:** `GET /v2/devices?name=laptop`  
**Output:** Show all info for devices with "laptop" in the name.

```json
[
  {
    "id": "AA:BB:CC:DD:EE:F1",
    "name": "Laptop",
    "ip": "192.168.120.2",
    "macVendor": "HP",
    "online": false,
    "network": { "name": "Home" },
    "group": { "name": "Parent" },
    "totalDownload": 6789,
    "totalUpload": 4567
  }
]
```

### List Online Devices

**Input:** `fw devices list --params '{"online": true}'`  
**API:** `GET /v2/devices?online=true`  
**Output:** Show all info for devices currently online.

```json
[
  {
    "id": "AA:BB:CC:DD:EE:FF",
    "name": "My Iphone",
    "ip": "192.168.120.1",
    "online": true,
    "totalDownload": 23456,
    "totalUpload": 12345
  }
]
```

### List Offline Devices

**Input:** `fw devices list --params '{"online": false}'`  
**API:** `GET /v2/devices?online=false`  
**Output:** Show all info for devices currently offline.

```json
[
  {
    "id": "AA:BB:CC:DD:EE:F1",
    "name": "Laptop",
    "ip": "192.168.120.2",
    "online": false,
    "totalDownload": 6789,
    "totalUpload": 4567
  }
]
```

### Top Devices by Download

**Input:** `fw devices +top --by totalDownload --desc --limit 10`  
**API:** `GET /v2/devices?sortBy=totalDownload:desc&limit=10`  
**Output:** Show the top 10 devices by historical download bytes.

```json
[
  {
    "id": "AA:BB:CC:DD:EE:FF",
    "name": "My Iphone",
    "ip": "192.168.120.1",
    "online": true,
    "totalDownload": 23456,
    "totalUpload": 12345
  },
  {
    "id": "AA:BB:CC:DD:EE:F1",
    "name": "Laptop",
    "ip": "192.168.120.2",
    "online": false,
    "totalDownload": 6789,
    "totalUpload": 4567
  }
]
```

### Bottom Devices by Download

**Input:** `fw devices +top --by totalDownload --asc --limit 10`  
**API:** `GET /v2/devices?sortBy=totalDownload:asc&limit=10`  
**Output:** Show the bottom 10 devices by historical download bytes.

```json
[
  {
    "id": "AA:BB:CC:DD:EE:F1",
    "name": "Laptop",
    "ip": "192.168.120.2",
    "online": false,
    "totalDownload": 6789,
    "totalUpload": 4567
  },
  {
    "id": "AA:BB:CC:DD:EE:FF",
    "name": "My Iphone",
    "ip": "192.168.120.1",
    "online": true,
    "totalDownload": 23456,
    "totalUpload": 12345
  }
]
```

### Filter Devices by Network

**Input:** `fw devices list --params '{"query": "network.name:[NETWORK NAME]"}'`  
**API:** `GET /v2/devices?query=network.name:[NETWORK NAME]`

**Example:** `fw devices list --params '{"query": "network.name:IoT"}'`  
**API:** `GET /v2/devices?query=network.name:IoT`  
**Output:** Show only devices connected to a specific local network segment (e.g., IoT VLAN).

```json
[
  {
    "id": "AA:BB:CC:DD:EE:EE",
    "name": "Smart TV",
    "ip": "192.168.120.5",
    "online": true,
    "network": { "name": "IoT" },
    "group": { "name": "Home" }
  }
]
```

### Filter Devices by Group

**Input:** `fw devices list --params '{"query": "group.name:[GROUP NAME]"}'`  
**API:** `GET /v2/devices?query=group.name:[GROUP NAME]`

**Example:** `fw devices list --params '{"query": "group.name:Kids"}'`  
**API:** `GET /v2/devices?query=group.name:Kids`  
**Output:** Show only devices assigned to a specific Firewalla logical group.

```json
[
  {
    "id": "AA:BB:CC:11:22:33",
    "name": "Kid iPad",
    "ip": "192.168.120.6",
    "online": true,
    "network": { "name": "IoT" },
    "group": { "name": "Kids" }
  }
]
```

### List Devices with Reserved IPs

**Input:** `fw devices list --params '{"ipReserved": true}'`  
**API:** `GET /v2/devices?ipReserved=true`  
**Output:** Show only devices that have a statically reserved IP address on the network.

```json
[
  {
    "id": "AA:BB:CC:44:55:66",
    "name": "NAS Server",
    "ip": "192.168.120.50",
    "online": true,
    "totalDownload": 10000000,
    "totalUpload": 50000000
  }
]
```

---

## Rules

**Docs:** https://docs.firewalla.net/data-models/rule/  
**API Reference:** `GET /v2/rules` https://docs.firewalla.net/api-reference/rule/#get-rules

### List All Rules

**Input:** `fw rules list`  
**API:** `GET /v2/rules`  
**Output:** Show all rules, flattening the target and scope objects.

```json
{
  "count": 3,
  "results": [
    {
      "id": "0000...0001",
      "action": "allow",
      "direction": "bidirectional",
      "status": "active",
      "target": { "type": "domain", "value": "firewalla.com" },
      "scope": { "type": "device", "value": "AA:BB:CC:DD:EE:FF" }
    },
    {
      "id": "0000...0002",
      "action": "block",
      "direction": "outbound",
      "status": "paused",
      "target": { "type": "category", "value": "Gaming" },
      "scope": { "type": "global", "value": "Global" }
    },
    {
      "id": "0000...0003",
      "action": "route",
      "direction": "outbound",
      "status": "active",
      "target": { "type": "ip", "value": "198.51.100.4" },
      "scope": { "type": "group", "value": "Kids" }
    }
  ]
}
```

### List Active Rules

**Input:** `fw rules list --params '{"status": "active"}'`  
**API:** `GET /v2/rules?status=active`  
**Output:** Show all active rules.

```json
{
  "count": 1,
  "results": [
    {
      "id": "0000...0001",
      "action": "allow",
      "direction": "bidirectional",
      "status": "active",
      "target": { "type": "domain", "value": "firewalla.com" },
      "scope": { "type": "device", "value": "AA:BB:CC:DD:EE:FF" }
    }
  ]
}
```

### List Paused Rules

**Input:** `fw rules list --params '{"status": "paused"}'`  
**API:** `GET /v2/rules?status=paused`  
**Output:** Show all paused rules.

```json
{
  "count": 1,
  "results": [
    {
      "id": "0000...0002",
      "action": "block",
      "direction": "outbound",
      "status": "paused",
      "target": { "type": "category", "value": "Gaming" },
      "scope": { "type": "global", "value": "Global" }
    }
  ]
}
```

### Filter Rules by Action

**Input:** `fw rules list --params '{"action": "<allow/block>"}'`  
**API:** `GET /v2/rules?action=<allow|block>`

**Example:** `fw rules list --params '{"action": "block"}'`  
**API:** `GET /v2/rules?action=block`  
**Output:** Show rules filtered by their action.

```json
{
  "count": 1,
  "results": [
    {
      "id": "0000...0002",
      "action": "block",
      "direction": "outbound",
      "status": "active",
      "target": { "type": "category", "value": "Gaming" },
      "scope": { "type": "global", "value": "Global" }
    }
  ]
}
```

### Filter Rules by Device

**Input:** `fw rules list --params '{"query": "scope.value:[MAC]"}'`  
**API:** `GET /v2/rules?query=scope.value:[MAC]`

**Example:** `fw rules list --params '{"query": "scope.value:AA:BB:CC:DD:EE:FF"}'`  
**API:** `GET /v2/rules?query=scope.value:AA:BB:CC:DD:EE:FF`  
**Output:** Show all rules that apply directly to a specific device.

```json
{
  "count": 1,
  "results": [
    {
      "id": "0000...0001",
      "action": "allow",
      "direction": "bidirectional",
      "status": "active",
      "target": { "type": "domain", "value": "firewalla.com" },
      "scope": { "type": "device", "value": "AA:BB:CC:DD:EE:FF" }
    }
  ]
}
```

---

## Flows

**Docs:** https://docs.firewalla.net/data-models/flow/  
**API Reference:** `GET /v2/flows` https://docs.firewalla.net/api-reference/flow/#get-flows

### List Recent Flows

**Input:** `fw flows list --params '{"limit": 25}'`  
**API:** `GET /v2/flows?limit=25`  
**Output:** Display a chronological list of recent network connections.

```json
{
  "results": [
    {
      "ts": 1730447709.791,
      "device": { "id": "AA:BB:CC:DD:EE:FF", "name": "My Iphone" },
      "direction": "outbound",
      "target": "firewalla.com",
      "port": 443,
      "protocol": "TCP",
      "action": "allow"
    },
    {
      "ts": 1730447712.100,
      "device": { "id": "AA:BB:CC:DD:EE:F1", "name": "Laptop" },
      "direction": "inbound",
      "target": "198.51.100.1",
      "port": 80,
      "protocol": "TCP",
      "action": "block"
    }
  ]
}
```

### Top Devices by Bandwidth

**Input:** `fw flows +top-devices --limit 10`  
**API:** `GET /v2/flows?groupBy=device&sortBy=total:desc&limit=10`  
**Output:** Display a ranked list of the top 10 devices consuming the most bandwidth.

```json
[
  {
    "device": { "id": "AA:BB:CC:DD:EE:F1", "name": "Laptop" },
    "uploadBytes": 524288000,
    "downloadBytes": 4509715660,
    "totalBytes": 5034003660
  },
  {
    "device": { "id": "AA:BB:CC:DD:EE:EE", "name": "Smart TV" },
    "uploadBytes": 52428800,
    "downloadBytes": 3328599650,
    "totalBytes": 3381028450
  }
]
```

### Top Destinations for Device

**Input:** `fw flows +top-destinations --params '{"query": "device.id:[MAC]"}' --limit 10`  
**API:** `GET /v2/flows?query=device.id:[MAC]&groupBy=destination&sortBy=total:desc&limit=10`  
**Output:** Show the top 10 destinations/domains a specific device is communicating with by bandwidth.

```json
[
  {
    "target": "netflix.com",
    "uploadBytes": 10485760,
    "downloadBytes": 2254857830,
    "totalBytes": 2265343590
  },
  {
    "target": "apple.com",
    "uploadBytes": 157286400,
    "downloadBytes": 419430400,
    "totalBytes": 576716800
  }
]
```

### Device Flow History

**Input:** `fw flows list --params '{"query": "device.id:[MAC]", "limit": 1000}'`  
**API:** `GET /v2/flows?query=device.id:[MAC]&limit=1000`  
**Output:** Show the 1000 most recent network flows for a specific device.

```json
{
  "results": [
    {
      "ts": 1730447712.000,
      "device": { "id": "AA:BB:CC:DD:EE:FF", "name": "My Iphone" },
      "direction": "outbound",
      "target": "firewalla.com",
      "port": 443,
      "protocol": "TCP",
      "action": "allow"
    },
    {
      "ts": 1730447715.000,
      "device": { "id": "AA:BB:CC:DD:EE:FF", "name": "My Iphone" },
      "direction": "inbound",
      "target": "198.51.100.1",
      "port": 80,
      "protocol": "TCP",
      "action": "block"
    }
  ]
}
```

### Allowed Flows

**Input:** `fw flows list --params '{"action": "allow"}'`  
**API:** `GET /v2/flows?action=allow`  
**Output:** Show only flows that were allowed by the firewall.

```json
{
  "results": [
    {
      "ts": 1730447709.791,
      "device": { "name": "My Iphone" },
      "direction": "outbound",
      "target": "firewalla.com",
      "port": 443,
      "protocol": "TCP",
      "action": "allow"
    }
  ]
}
```

### Blocked Flows

**Input:** `fw flows list --params '{"action": "block"}'`  
**API:** `GET /v2/flows?action=block`  
**Output:** Show only flows that were blocked by the firewall.

```json
{
  "results": [
    {
      "ts": 1730447712.100,
      "device": { "name": "Laptop" },
      "direction": "outbound",
      "target": "198.51.100.1",
      "port": 80,
      "protocol": "TCP",
      "action": "block"
    }
  ]
}
```

### Flows by Network

**Input:** `fw flows list --params '{"query": "network.name:[GROUP]"}'`  
**API:** `GET /v2/flows?query=network.name:[GROUP NAME]`  
**Output:** Show recent network flows exclusively for devices connected to a specific network.

```json
{
  "results": [
    {
      "ts": 1730447712.000,
      "device": { "name": "My Iphone" },
      "network": { "name": "Home Office" },
      "target": "firewalla.com",
      "action": "allow"
    }
  ]
}
```

### Flows for Online Devices

**Input:** `fw flows list --params '{"query": "device.online:true"}'`  
**API:** `GET /v2/flows?query=device.online:true`  
**Output:** Show recent network flows exclusively for devices that are currently online.

```json
{
  "results": [
    {
      "ts": 1730447712.000,
      "device": { "name": "My Iphone", "online": true },
      "target": "google.com",
      "action": "allow"
    }
  ]
}
```

### Flows by Destination

**Input:** `fw flows list --params '{"query": "destination.name:[IP/Domain]"}'`  
**API:** `GET /v2/flows?query=destination.name:[IP or Domain]`

**Example:** `fw flows list --params '{"query": "destination.name:example.com"}'`  
**API:** `GET /v2/flows?query=destination.name:example.com`  
**Output:** Show all recent connections from any device to a specific external domain or IP.

```json
{
  "results": [
    {
      "ts": 1730447715.000,
      "device": { "name": "Laptop" },
      "direction": "outbound",
      "target": "example.com",
      "port": 443,
      "protocol": "TCP",
      "action": "block"
    },
    {
      "ts": 1730447770.000,
      "device": { "name": "Smart TV" },
      "direction": "outbound",
      "target": "example.com",
      "port": 443,
      "protocol": "TCP",
      "action": "block"
    }
  ]
}
```

### Flows by Category

**Input:** `fw flows list --params '{"query": "category:[CATEGORY]"}'`  
**API:** `GET /v2/flows?query=category:[CATEGORY]`

**Example:** `fw flows list --params '{"query": "category:gaming"}'`  
**API:** `GET /v2/flows?query=category:Gaming`  
**Output:** Show recent flows that match a specific Firewalla category.

```json
{
  "results": [
    {
      "ts": 1730447712.000,
      "target": "roblox.com",
      "device": { "name": "Kid iPad" },
      "direction": "outbound",
      "category": "Gaming",
      "action": "block"
    }
  ]
}
```

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
      "ts": 1730447700.000,
      "id": "alm_1a2b",
      "device": { "name": "Laptop" },
      "category": "Security",
      "status": "active",
      "message": "Malware site blocked"
    },
    {
      "ts": 1730440000.000,
      "id": "alm_3c4d",
      "device": { "name": "Smart TV" },
      "category": "Activity",
      "status": "archived",
      "message": "Abnormal Upload: 77.7 GB uploaded to 203.0.113.1"
    }
  ]
}
```

### List Active Alarms

**Input:** `fw alarms list --params '{"status": "active"}'`  
**API:** `GET /v2/alarms?status=active`  
**Output:** Show only alarms that are currently active and require attention.

```json
{
  "results": [
    {
      "ts": 1730447700.000,
      "id": "alm_1a2b",
      "device": { "name": "Laptop" },
      "category": "Security",
      "status": "active",
      "message": "Malware site blocked"
    }
  ]
}
```

### Alarms by Device

**Input:** `fw alarms list --params '{"query": "device.id:[MAC]"}'`  
**API:** `GET /v2/alarms?query=device.id:[MAC]`

**Example:** `fw alarms list --params '{"query": "device.id:AA:BB:CC:DD:EE:FF"}'`  
**API:** `GET /v2/alarms?query=device.id:AA:BB:CC:DD:EE:FF`  
**Output:** Show the recent alarm history exclusively for a specific device.

```json
{
  "results": [
    {
      "ts": 1730430000.000,
      "id": "alm_9z8y",
      "device": { "name": "My Iphone", "id": "AA:BB:CC:DD:EE:FF" },
      "category": "Security",
      "status": "active",
      "message": "Malware site blocked"
    },
    {
      "ts": 1730420000.000,
      "id": "alm_7x6w",
      "device": { "name": "My Iphone", "id": "AA:BB:CC:DD:EE:FF" },
      "category": "Activity",
      "status": "archived",
      "message": "Abnormal Upload: 11.1GB uploaded to 203.0.113.2"
    }
  ]
}
```

### Limited Number of Alarms

**Input:** `fw alarms list --params '{"limit": 5}'`  
**API:** `GET /v2/alarms?limit=5`  
**Output:** Fetch a specific number of recent alarms (in this case, the 5 most recent).

```json
{
  "results": [
    {
      "ts": 1730447700.000,
      "id": "alm_1a2b",
      "device": { "name": "Laptop" },
      "category": "Security",
      "status": "active",
      "message": "Malware site blocked"
    },
    {
      "ts": 1730440000.000,
      "id": "alm_3c4d",
      "device": { "name": "Smart TV" },
      "category": "Activity",
      "status": "archived",
      "message": "Abnormal Upload: 77.7 GB uploaded to 203.0.113.1"
    },
    {
      "ts": 1730430000.000,
      "id": "alm_9z8y",
      "device": { "name": "My Iphone" },
      "category": "Security",
      "status": "active",
      "message": "Malware site blocked"
    },
    {
      "ts": 1730420000.000,
      "id": "alm_7x6w",
      "device": { "name": "My Iphone" },
      "category": "Activity",
      "status": "archived",
      "message": "Abnormal Upload: 11.1GB uploaded to 203.0.113.2"
    },
    {
      "ts": 1730410000.000,
      "id": "alm_5v4u",
      "device": { "name": "NAS Server" },
      "category": "Activity",
      "status": "archived",
      "message": "New device found"
    }
  ]
}
```
---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FIREWALLA_MSP_TOKEN` | Your MSP access token |
| `FIREWALLA_MSP_ID` | Your MSP domain (e.g., `yourdomain.firewalla.net`) |
| `FIREWALLA_BOX_GID` | Your Firewalla box GID (optional if only one box) |
