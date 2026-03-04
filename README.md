# n8n-nodes-dealhub

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with DealHub's sales engagement platform. This node provides access to 6 core resources including Quotes, DealRooms, Products, Contacts, Integrations, and Analytics, enabling automation of sales processes, deal management, and revenue operations workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DealHub API](https://img.shields.io/badge/DealHub-API-orange)
![Sales Automation](https://img.shields.io/badge/Sales-Automation-green)
![Revenue Operations](https://img.shields.io/badge/RevOps-Ready-purple)

## Features

- **Quote Management** - Create, update, and track sales quotes with advanced pricing and approval workflows
- **DealRoom Operations** - Manage collaborative deal spaces with document sharing and stakeholder engagement
- **Product Catalog** - Access and manage product information, pricing, and configuration options
- **Contact Management** - Synchronize contact data and manage buyer personas and stakeholder information  
- **Integration Hub** - Connect DealHub with CRM systems, payment processors, and other sales tools
- **Analytics & Reporting** - Extract deal performance metrics, conversion rates, and sales pipeline analytics
- **Real-time Updates** - Webhook support for instant notifications on deal status changes
- **Bulk Operations** - Process multiple records efficiently with batch operations support

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-dealhub`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-dealhub
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-dealhub.git
cd n8n-nodes-dealhub
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-dealhub
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your DealHub API key from Settings > API Keys | Yes |
| Environment | DealHub environment (production/sandbox) | Yes |
| Base URL | Custom DealHub instance URL (if applicable) | No |

## Resources & Operations

### 1. Quotes

| Operation | Description |
|-----------|-------------|
| Create | Create a new quote with products, pricing, and terms |
| Get | Retrieve quote details by ID |
| Update | Update quote information, products, or pricing |
| Delete | Remove a quote from the system |
| List | Get all quotes with filtering and pagination |
| Send | Send quote to buyers via email |
| Approve | Submit quote for approval workflow |
| Clone | Create a copy of an existing quote |

### 2. DealRooms

| Operation | Description |
|-----------|-------------|
| Create | Create a new collaborative deal room |
| Get | Retrieve deal room details and content |
| Update | Update deal room settings and permissions |
| Delete | Remove a deal room |
| List | Get all deal rooms with filtering |
| Add Content | Upload documents and materials to deal room |
| Invite | Invite stakeholders to join deal room |
| Track Activity | Get engagement and activity metrics |

### 3. Products

| Operation | Description |
|-----------|-------------|
| Create | Add new product to catalog |
| Get | Retrieve product details and specifications |
| Update | Update product information and pricing |
| Delete | Remove product from catalog |
| List | Get all products with filtering and search |
| Get Pricing | Retrieve current pricing and discount rules |
| Update Pricing | Modify product pricing and rules |
| Bulk Import | Import multiple products from external source |

### 4. Contacts

| Operation | Description |
|-----------|-------------|
| Create | Add new contact to DealHub |
| Get | Retrieve contact details and history |
| Update | Update contact information |
| Delete | Remove contact from system |
| List | Get all contacts with filtering |
| Merge | Combine duplicate contact records |
| Add to Deal | Associate contact with specific deal |
| Get Activity | Retrieve contact engagement history |

### 5. Integrations

| Operation | Description |
|-----------|-------------|
| List | Get all available integrations |
| Get | Retrieve integration configuration details |
| Create | Set up new integration connection |
| Update | Modify integration settings |
| Delete | Remove integration connection |
| Test | Validate integration connection |
| Sync | Trigger data synchronization |
| Get Logs | Retrieve integration activity logs |

### 6. Analytics

| Operation | Description |
|-----------|-------------|
| Get Metrics | Retrieve key performance indicators |
| Deal Analytics | Get deal pipeline and conversion metrics |
| Quote Analytics | Analyze quote performance and win rates |
| User Activity | Get user engagement and activity reports |
| Revenue Reports | Generate revenue and forecasting data |
| Time Reports | Analyze deal cycle and response times |
| Custom Query | Execute custom analytics queries |
| Export Data | Export analytics data in various formats |

## Usage Examples

```javascript
// Create a new quote with products
{
  "resource": "quotes",
  "operation": "create",
  "data": {
    "name": "Q4 Enterprise Solution",
    "buyerCompany": "Acme Corporation",
    "buyerEmail": "procurement@acme.com",
    "products": [
      {
        "productId": "prod_123",
        "quantity": 100,
        "unitPrice": 99.99
      }
    ],
    "validUntil": "2024-12-31"
  }
}
```

```javascript
// Create deal room and invite stakeholders
{
  "resource": "dealrooms",
  "operation": "create",
  "data": {
    "name": "Acme Corp - Enterprise Deal",
    "dealValue": 150000,
    "stakeholders": [
      {
        "email": "john.doe@acme.com",
        "role": "Decision Maker"
      },
      {
        "email": "jane.smith@acme.com", 
        "role": "Technical Lead"
      }
    ],
    "content": [
      "proposal.pdf",
      "technical-specs.docx"
    ]
  }
}
```

```javascript
// Get deal analytics for current quarter
{
  "resource": "analytics",
  "operation": "dealAnalytics",
  "parameters": {
    "dateRange": "current_quarter",
    "metrics": ["conversion_rate", "avg_deal_size", "cycle_time"],
    "groupBy": "month",
    "filters": {
      "dealValue": {"min": 10000},
      "stage": ["negotiation", "proposal", "closed_won"]
    }
  }
}
```

```javascript
// Bulk update product pricing
{
  "resource": "products",
  "operation": "bulkImport",
  "data": {
    "products": [
      {
        "sku": "ENT-001",
        "name": "Enterprise License",
        "price": 1999.99,
        "discountRules": {
          "volume": [
            {"min": 10, "discount": 0.1},
            {"min": 50, "discount": 0.15}
          ]
        }
      }
    ],
    "updateExisting": true
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in credentials and check expiration |
| 403 Forbidden | Insufficient permissions for operation | Contact admin to verify user permissions and API scope |
| 404 Not Found | Requested resource (quote, deal, etc.) doesn't exist | Check resource ID and verify it exists in DealHub |
| 422 Validation Error | Invalid data format or missing required fields | Review API documentation and validate request payload |
| 429 Rate Limit | Too many API requests in time period | Implement retry logic with exponential backoff |
| 500 Server Error | DealHub internal server error | Check DealHub status page and retry after delay |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-dealhub/issues)
- **DealHub API Documentation**: [DealHub Developer Portal](https://developers.dealhub.io)
- **DealHub Community**: [DealHub User Community](https://community.dealhub.io)