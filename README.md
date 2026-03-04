# n8n-nodes-enrichlayer

This is an [n8n](https://n8n.io/) community node for the [Enrich Layer](https://enrichlayer.com?utm_source=n8n&utm_medium=integration&utm_campaign=homepage) API. It lets you enrich company, person, school, and job data directly in your n8n workflows.

## Installation

### In n8n Desktop / Self-Hosted

1. Go to **Settings > Community Nodes**
2. Enter `n8n-nodes-enrichlayer`
3. Click **Install**

### Via npm (manual)

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-enrichlayer
```

Then restart n8n.

## Credentials

1. Sign up at [enrichlayer.com](https://enrichlayer.com?utm_source=n8n&utm_medium=integration&utm_campaign=homepage) and get your API key from the dashboard.
2. In n8n, go to **Credentials > New Credential > Enrich Layer API**.
3. Paste your API key and save.

The credential is tested automatically via the `/api/v2/credit-balance` endpoint (0 credits consumed).

## Operations

The node provides **25 operations** covering every active Enrich Layer API endpoint.

### Company API (7 operations)

| Operation | Endpoint | Credits |
|-----------|----------|---------|
| Get Company Profile | `GET /api/v2/company` | 1 |
| Lookup Company | `GET /api/v2/company/resolve` | 2 |
| Lookup Company by ID | `GET /api/v2/company/resolve-id` | 0 |
| Get Company Profile Picture | `GET /api/v2/company/profile-picture` | 0 |
| List Employees | `GET /api/v2/company/employees/` | 3/employee |
| Get Employee Count | `GET /api/v2/company/employees/count` | 1 |
| Search Employees | `GET /api/v2/company/employee/search/` | 10 |

### People API (4 operations)

| Operation | Endpoint | Credits |
|-----------|----------|---------|
| Get Person Profile | `GET /api/v2/profile` | 1 |
| Lookup Person | `GET /api/v2/profile/resolve` | 2 |
| Get Person Profile Picture | `GET /api/v2/person/profile-picture` | 0 |
| Lookup Role | `GET /api/v2/find/company/role/` | 3 |

### Contact API (6 operations)

| Operation | Endpoint | Credits |
|-----------|----------|---------|
| Reverse Email Lookup | `GET /api/v2/profile/resolve/email` | 3 |
| Reverse Phone Lookup | `GET /api/v2/resolve/phone` | 3 |
| Work Email Lookup | `GET /api/v2/profile/email` | 3 |
| Get Personal Contact | `GET /api/v2/contact-api/personal-contact` | 1/number |
| Get Personal Email | `GET /api/v2/contact-api/personal-email` | 1/email |
| Check Disposable Email | `GET /api/v2/disposable-email` | 0 |

### School API (2 operations)

| Operation | Endpoint | Credits |
|-----------|----------|---------|
| Get School Profile | `GET /api/v2/school` | 1 |
| List Students | `GET /api/v2/school/students/` | 3/student |

### Jobs API (3 operations)

| Operation | Endpoint | Credits |
|-----------|----------|---------|
| Get Job Profile | `GET /api/v2/job` | 2 |
| Search Jobs | `GET /api/v2/company/job` | 2 |
| Get Job Count | `GET /api/v2/company/job/count` | 2 |

### Search API (2 operations)

| Operation | Endpoint | Credits |
|-----------|----------|---------|
| Search Companies | `GET /api/v2/search/company` | 3 |
| Search People | `GET /api/v2/search/person` | 3 |

### Meta API (1 operation)

| Operation | Endpoint | Credits |
|-----------|----------|---------|
| Get Credit Balance | `GET /api/v2/credit-balance` | 0 |

## Example Workflows

### Enrich a company from a spreadsheet

```json
{
  "nodes": [
    {
      "name": "Read Spreadsheet",
      "type": "n8n-nodes-base.spreadsheetFile",
      "position": [250, 300]
    },
    {
      "name": "Enrich Layer",
      "type": "n8n-nodes-enrichlayer.enrichLayer",
      "position": [450, 300],
      "parameters": {
        "operation": "getCompanyProfile",
        "url": "={{$json.profile_url}}"
      },
      "credentials": {
        "enrichLayerApi": "Your Enrich Layer Credentials"
      }
    }
  ],
  "connections": {
    "Read Spreadsheet": {
      "main": [[{ "node": "Enrich Layer", "type": "main", "index": 0 }]]
    }
  }
}
```

### Look up a person by name and company

```json
{
  "nodes": [
    {
      "name": "Enrich Layer",
      "type": "n8n-nodes-enrichlayer.enrichLayer",
      "position": [250, 300],
      "parameters": {
        "operation": "lookupPerson",
        "first_name": "John",
        "company_domain": "example.com",
        "additionalFields": {
          "last_name": "Doe",
          "enrich_profile": "true"
        }
      },
      "credentials": {
        "enrichLayerApi": "Your Enrich Layer Credentials"
      }
    }
  ]
}
```

### Check credit balance

```json
{
  "nodes": [
    {
      "name": "Enrich Layer",
      "type": "n8n-nodes-enrichlayer.enrichLayer",
      "position": [250, 300],
      "parameters": {
        "operation": "getCreditBalance"
      },
      "credentials": {
        "enrichLayerApi": "Your Enrich Layer Credentials"
      }
    }
  ]
}
```

## Development

```bash
# Install dependencies
npm install

# Run TypeScript compilation check
npm run lint

# Run tests
npm test

# Build for publishing
npm run build
```

## License

[MIT](LICENSE)
