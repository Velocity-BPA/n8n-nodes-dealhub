# n8n-nodes-dealhub

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for DealHub, providing seamless integration with DealHub's sales enablement platform. This node offers 6 resources with complete CRUD operations, enabling automated deal management, customer relationship workflows, and sales process optimization.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Sales Automation](https://img.shields.io/badge/Sales-Automation-green)
![Deal Management](https://img.shields.io/badge/Deal-Management-orange)
![CRM Integration](https://img.shields.io/badge/CRM-Integration-purple)

## Features

- **Complete Deal Management** - Create, update, and track deals throughout the sales pipeline
- **DealRoom Operations** - Manage collaborative sales rooms for complex deals and stakeholder engagement
- **Product Catalog Integration** - Sync product information, pricing, and configurations
- **Account Management** - Handle customer accounts, territories, and hierarchical relationships
- **Contact Operations** - Manage contacts, roles, and communication preferences
- **Template Management** - Create and manage proposal templates, quote templates, and sales collateral
- **Advanced Filtering** - Query resources with complex filters and sorting options
- **Bulk Operations** - Process multiple records efficiently with batch operations

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
| API Key | Your DealHub API key from account settings | Yes |
| Environment | DealHub environment (production/sandbox) | Yes |
| Base URL | Custom DealHub instance URL (if applicable) | No |

## Resources & Operations

### 1. Deal

| Operation | Description |
|-----------|-------------|
| Create | Create a new deal with specified parameters |
| Get | Retrieve a specific deal by ID |
| Get All | List all deals with optional filtering |
| Update | Update an existing deal's properties |
| Delete | Remove a deal from the system |
| Get Activities | Retrieve activity history for a deal |
| Add Note | Add notes or comments to a deal |

### 2. DealRoom

| Operation | Description |
|-----------|-------------|
| Create | Create a new collaborative deal room |
| Get | Retrieve deal room details and participants |
| Get All | List all deal rooms with filtering options |
| Update | Update deal room settings and content |
| Delete | Remove a deal room |
| Invite Participants | Add new participants to a deal room |
| Get Analytics | Retrieve engagement analytics for deal rooms |

### 3. Product

| Operation | Description |
|-----------|-------------|
| Create | Add a new product to the catalog |
| Get | Retrieve specific product information |
| Get All | List all products with search and filtering |
| Update | Update product details and pricing |
| Delete | Remove a product from the catalog |
| Get Pricing | Retrieve pricing rules and configurations |
| Update Inventory | Manage product inventory levels |

### 4. Account

| Operation | Description |
|-----------|-------------|
| Create | Create a new customer account |
| Get | Retrieve account details and hierarchy |
| Get All | List all accounts with territory filtering |
| Update | Update account information and settings |
| Delete | Remove an account from the system |
| Get Contacts | Retrieve all contacts associated with an account |
| Get Deals | List all deals for a specific account |

### 5. Contact

| Operation | Description |
|-----------|-------------|
| Create | Add a new contact to the system |
| Get | Retrieve contact details and preferences |
| Get All | List contacts with search and filtering |
| Update | Update contact information and roles |
| Delete | Remove a contact from the system |
| Get Activities | Retrieve interaction history for a contact |
| Update Preferences | Manage communication preferences |

### 6. Template

| Operation | Description |
|-----------|-------------|
| Create | Create a new proposal or quote template |
| Get | Retrieve template content and structure |
| Get All | List all available templates |
| Update | Modify template content and settings |
| Delete | Remove a template from the library |
| Clone | Create a copy of an existing template |
| Generate Document | Create a document from a template |

## Usage Examples

```javascript
// Create a new deal
{
  "name": "Enterprise Software License",
  "accountId": "acc_123456",
  "amount": 150000,
  "currency": "USD",
  "closeDate": "2024-03-15",
  "stage": "proposal",
  "probability": 75,
  "description": "Annual enterprise software license renewal"
}
```

```javascript
// Set up a deal room for stakeholder collaboration
{
  "dealId": "deal_789012",
  "name": "Q1 Enterprise Renewal",
  "participants": [
    { "email": "buyer@client.com", "role": "decision_maker" },
    { "email": "technical@client.com", "role": "technical_contact" }
  ],
  "documents": ["proposal.pdf", "technical_specs.pdf"],
  "expirationDate": "2024-02-28"
}
```

```javascript
// Create a product with pricing tiers
{
  "name": "Professional Plan",
  "sku": "PRO-PLAN-2024",
  "category": "Software License",
  "basePrice": 99.00,
  "currency": "USD",
  "pricingTiers": [
    { "quantity": 1, "price": 99.00 },
    { "quantity": 10, "price": 89.00 },
    { "quantity": 50, "price": 79.00 }
  ],
  "description": "Professional tier with advanced features"
}
```

```javascript
// Update contact with new role and preferences
{
  "contactId": "contact_345678",
  "role": "procurement_manager",
  "department": "Finance",
  "communicationPreferences": {
    "email": true,
    "phone": false,
    "preferredTime": "morning"
  },
  "decisionMakingAuthority": "budget_approver"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in credentials and check expiration |
| 403 Forbidden | Insufficient permissions for operation | Contact admin to verify user permissions |
| 404 Not Found | Resource ID doesn't exist | Verify resource ID and check if resource was deleted |
| 422 Validation Error | Invalid data format or missing required fields | Review request payload and API documentation |
| 429 Rate Limited | Too many requests in time window | Implement delays between requests or reduce frequency |
| 500 Server Error | DealHub service temporarily unavailable | Retry request after delay or check service status |

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
- **DealHub API Documentation**: [https://developers.dealhub.io](https://developers.dealhub.io)
- **Community Forum**: [DealHub Community](https://community.dealhub.io)