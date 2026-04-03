# n8n-nodes-conga-cpq-clm

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Conga CPQ (Configure, Price, Quote) and CLM (Contract Lifecycle Management) platforms. This node provides access to 7 core resources including quotes, products, contracts, and documents, enabling comprehensive quote-to-cash and contract management automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![CPQ](https://img.shields.io/badge/Conga-CPQ-orange)
![CLM](https://img.shields.io/badge/Conga-CLM-orange)
![Quote Management](https://img.shields.io/badge/Quote-Management-green)

## Features

- **Quote Management** - Create, update, and manage quotes with full lifecycle support
- **Product Configuration** - Access product catalogs and configure complex product bundles
- **Contract Lifecycle** - Complete contract creation, negotiation, and management workflows
- **Document Generation** - Generate quotes, proposals, and contracts from templates
- **Template Management** - Manage and customize document templates for various outputs
- **Approval Workflows** - Automate approval processes for quotes and contracts
- **Line Item Control** - Detailed quote line item management with pricing calculations
- **Revenue Operations** - Streamline quote-to-cash and contract renewal processes

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-conga-cpq-clm`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-conga-cpq-clm
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-conga-cpq-clm.git
cd n8n-nodes-conga-cpq-clm
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-conga-cpq-clm
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Conga API key for authentication | Yes |
| Server URL | Your Conga instance URL (e.g., https://yourcompany.congacloud.com) | Yes |
| Environment | Environment type (Production, Sandbox, Development) | Yes |

## Resources & Operations

### 1. Quote

| Operation | Description |
|-----------|-------------|
| Create | Create a new quote with customer and product information |
| Get | Retrieve a specific quote by ID |
| Update | Update existing quote details and configuration |
| Delete | Remove a quote from the system |
| List | Get a list of quotes with filtering options |
| Generate | Generate quote document from configured template |
| Submit | Submit quote for approval or customer review |

### 2. Quote Line

| Operation | Description |
|-----------|-------------|
| Create | Add a new line item to an existing quote |
| Get | Retrieve specific quote line details |
| Update | Modify quote line quantities, pricing, or configuration |
| Delete | Remove a line item from a quote |
| List | Get all line items for a specific quote |
| Calculate | Recalculate pricing for quote lines |

### 3. Product

| Operation | Description |
|-----------|-------------|
| Get | Retrieve product details and configuration options |
| List | Browse product catalog with search and filtering |
| Search | Search products by name, SKU, or attributes |
| GetConfiguration | Get product configuration rules and options |
| GetPricing | Retrieve pricing information for products |

### 4. Contract

| Operation | Description |
|-----------|-------------|
| Create | Create a new contract from quote or template |
| Get | Retrieve contract details and status |
| Update | Update contract terms and information |
| Delete | Remove a contract from the system |
| List | Get contracts with status and date filtering |
| Approve | Approve contract for execution |
| Execute | Execute an approved contract |
| Renew | Create renewal contract from existing contract |

### 5. Document

| Operation | Description |
|-----------|-------------|
| Generate | Generate document from quote, contract, or template |
| Get | Retrieve generated document details |
| Download | Download document file (PDF, Word, etc.) |
| List | Get list of generated documents |
| Preview | Generate document preview without saving |

### 6. Template

| Operation | Description |
|-----------|-------------|
| Get | Retrieve template configuration and settings |
| List | Get available templates by type and category |
| Update | Update template configuration |
| Clone | Create copy of existing template |

### 7. Approval

| Operation | Description |
|-----------|-------------|
| Submit | Submit quote or contract for approval |
| Get | Get approval request details and status |
| Approve | Approve a pending approval request |
| Reject | Reject an approval request with comments |
| List | Get approval requests by status or assignee |
| Recall | Recall submitted approval request |

## Usage Examples

```javascript
// Create a new quote with product lines
{
  "accountId": "001XX0000034MdJ",
  "opportunityId": "006XX00001jyGtZ",
  "name": "Q4 Enterprise License Quote",
  "description": "Annual enterprise software license renewal",
  "quoteLines": [
    {
      "productId": "01tXX0000028N8Q",
      "quantity": 100,
      "listPrice": 150.00
    }
  ]
}
```

```javascript
// Generate contract from approved quote
{
  "quoteId": "0Q0XX0000028R5W",
  "templateId": "01gXX0000045K2P",
  "contractName": "Enterprise License Agreement 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "autoRenewal": true
}
```

```javascript
// Submit quote for approval workflow
{
  "quoteId": "0Q0XX0000028R5W",
  "approverIds": ["005XX0000058N8Q", "005XX0000058N8R"],
  "approvalComments": "Please review pricing for enterprise discount",
  "dueDate": "2024-01-15"
}
```

```javascript
// Generate quote document with custom template
{
  "quoteId": "0Q0XX0000028R5W",
  "templateId": "01gXX0000045K2P",
  "documentName": "Enterprise Quote - Acme Corp",
  "format": "PDF",
  "deliveryMethod": "Email",
  "recipientEmail": "procurement@acmecorp.com"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Authentication Failed | Invalid API key or expired credentials | Verify API key and check credential configuration |
| Quote Not Found | Specified quote ID does not exist | Confirm quote ID exists and user has access permissions |
| Product Configuration Error | Invalid product configuration or missing required options | Review product configuration rules and required fields |
| Approval Workflow Error | Cannot submit for approval due to validation errors | Check quote completeness and approval workflow requirements |
| Template Generation Failed | Document template processing error | Verify template exists and all merge fields have valid data |
| Pricing Calculation Error | Error calculating quote line pricing | Check product pricing rules and quote line configuration |

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

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-conga-cpq-clm/issues)
- **Conga API Documentation**: [Conga Developer Portal](https://documentation.conga.com/)
- **CPQ Community**: [Conga Community](https://community.conga.com/)