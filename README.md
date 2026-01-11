# n8n-nodes-dealhub

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for DealHub, the quote-to-cash ecosystem that unifies CPQ (Configure, Price, Quote), CLM (Contract Lifecycle Management), subscription management, and revenue recognition. This node enables workflow automation for quote management, document generation, DealRoom operations, and CRM synchronization.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **Quote Management** - Create, update, approve, reject, publish, and manage quotes with full lifecycle support
- **DealRoom Operations** - Create interactive proposal rooms, manage files, track visitor engagement, and handle e-signatures
- **Product Catalog** - Manage products, pricing rules, bundles, and attributes
- **Playbook Automation** - Access guided selling playbooks, questions, and simulate configurations
- **Approval Workflows** - Handle approval requests, delegation, and approval history
- **Document Generation** - Generate proposals, contracts, and export to PDF/Excel
- **Opportunity Sync** - Bidirectional CRM synchronization for opportunities
- **User Management** - Access user details, teams, and activity logs
- **Version Control** - Manage product/playbook versions and rollbacks
- **Webhook Events** - Real-time event notifications for quote and DealRoom activities

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-dealhub`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-dealhub
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-dealhub.git
cd n8n-nodes-dealhub

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-dealhub

# Restart n8n
n8n start
```

## Credentials Setup

### DealHub API Credentials

| Field | Description |
|-------|-------------|
| **API Key** | API key generated from DealHub Admin Settings > API Configuration |
| **Environment** | Select Production or Sandbox environment |
| **Subdomain** | Your DealHub subdomain identifier (e.g., `mycompany` from `mycompany.dealhub.io`) |

### Obtaining API Credentials

1. Log in to your DealHub admin account
2. Navigate to **Admin Settings** > **API Configuration**
3. Generate a new API key with appropriate permissions
4. Copy the API key and configure in n8n

## Resources & Operations

### Quote (14 operations)

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific quote by ID |
| Get All | List all quotes with filtering |
| Create | Create a new quote via headless API |
| Update | Update quote details and metadata |
| Delete | Delete a draft quote |
| Submit | Submit quote for approval |
| Approve | Approve a pending quote |
| Reject | Reject a quote with reason |
| Publish | Publish quote to DealRoom |
| Clone | Clone an existing quote |
| Get Versions | Get all versions of a quote |
| Set Active Version | Set a specific version as active |
| Export PDF | Export quote as PDF document |
| Export Excel | Export quote as Excel spreadsheet |

### DealRoom (11 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get DealRoom details by ID |
| Get All | List all DealRooms |
| Create | Create a new DealRoom for a quote |
| Update | Update DealRoom settings |
| Delete | Delete a DealRoom |
| Add File | Add a file to DealRoom |
| Remove File | Remove a file from DealRoom |
| Get Activity | Get visitor activity metrics |
| Get Signers | Get signers and status |
| Send Reminder | Send signing reminder |
| Expire | Manually expire a DealRoom |

### Product (10 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get product details by ID |
| Get All | List all products in catalog |
| Create | Create a new product |
| Update | Update product information |
| Delete | Remove a product from catalog |
| Get Pricing | Get pricing rules for a product |
| Update Pricing | Update product pricing |
| Get Attributes | Get product attributes |
| Add to Bundle | Add product to a bundle |
| Remove from Bundle | Remove product from bundle |

### Playbook (5 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get playbook details |
| Get All | List all playbooks |
| Get Questions | Get playbook questions |
| Get Answer Options | Get answer options for a question |
| Simulate | Simulate playbook answers |

### User (6 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get user details by ID |
| Get All | List all users |
| Get Current | Get authenticated user |
| Get Teams | Get user's teams |
| Get Quotes | Get quotes assigned to user |
| Get Activity | Get user activity log |

### Version (7 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get version details |
| Get All | List all versions |
| Get Current | Get active version |
| Get Products | Get products in version |
| Get Playbooks | Get playbooks in version |
| Publish | Publish a version |
| Rollback | Rollback to previous version |

### Opportunity (6 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get opportunity details |
| Get All | List all opportunities |
| Create | Create new opportunity |
| Update | Update opportunity details |
| Get Quotes | Get quotes for opportunity |
| Sync | Sync with CRM |

### Approval (6 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get approval request details |
| Get All | List pending approvals |
| Approve | Approve a request |
| Reject | Reject with reason |
| Delegate | Delegate to another approver |
| Get History | Get approval history |

### Document (7 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get document by ID |
| Get All | List all documents |
| Generate | Generate document from quote |
| Download | Download document file |
| Delete | Delete a document |
| Get Templates | List document templates |
| Preview | Preview before generation |

### Webhook (7 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get webhook configuration |
| Get All | List all webhooks |
| Create | Create new webhook |
| Update | Update webhook settings |
| Delete | Remove webhook |
| Get Events | List available events |
| Test | Send test event |

## Trigger Node

The **DealHub Trigger** node listens for real-time webhook events:

| Event | Description |
|-------|-------------|
| quote.created | New quote created |
| quote.updated | Quote details updated |
| quote.submitted | Quote submitted for approval |
| quote.approved | Quote approved |
| quote.rejected | Quote rejected |
| quote.published | Quote published to DealRoom |
| quote.won | Quote marked as won |
| quote.lost | Quote marked as lost |
| dealroom.viewed | DealRoom accessed by prospect |
| dealroom.signed | Document signed in DealRoom |
| approval.requested | New approval request |
| approval.completed | Approval process completed |
| document.generated | Document generation completed |
| opportunity.synced | Opportunity synced with CRM |

## Usage Examples

### Create and Publish a Quote

```javascript
// 1. Create a quote
{
  "resource": "quote",
  "operation": "create",
  "name": "Enterprise Proposal - Q1 2024",
  "opportunityId": "opp_12345",
  "playbookId": "pb_standard",
  "currency": "USD",
  "expirationDate": "2024-03-31"
}

// 2. Submit for approval
{
  "resource": "quote",
  "operation": "submit",
  "quoteId": "{{$json.id}}"
}

// 3. Publish to DealRoom
{
  "resource": "quote",
  "operation": "publish",
  "quoteId": "{{$json.id}}",
  "createDealRoom": true,
  "notifyRecipients": true
}
```

### Generate Document from Quote

```javascript
{
  "resource": "document",
  "operation": "generate",
  "quoteId": "qt_12345",
  "templateId": "tmpl_proposal",
  "format": "pdf",
  "includeLineItems": true,
  "includeTerms": true
}
```

### Monitor DealRoom Activity

Use the DealHub Trigger node with `dealroom.viewed` event to track when prospects view your proposals and trigger follow-up workflows.

## Error Handling

The node handles DealHub API errors with detailed messages:

| Error Code | Description |
|------------|-------------|
| INVALID_REQUEST (400) | Malformed request or invalid parameters |
| UNAUTHORIZED (401) | Invalid or expired API key |
| FORBIDDEN (403) | Insufficient permissions |
| NOT_FOUND (404) | Resource not found |
| RATE_LIMITED (429) | Too many requests |
| INTERNAL_ERROR (500) | Server-side error |

## Security Best Practices

1. **Store API keys securely** - Use n8n credentials, never hardcode
2. **Use environment selection** - Test in sandbox before production
3. **Verify webhook signatures** - Enable signature verification for triggers
4. **Limit permissions** - Create API keys with minimum required access
5. **Monitor rate limits** - The node handles rate limiting automatically

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [DealHub API Docs](https://developers.dealhub.io)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-dealhub/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [DealHub](https://dealhub.io) for their comprehensive CPQ platform and API
- [n8n](https://n8n.io) for the powerful workflow automation platform
- The n8n community for inspiration and best practices
