/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

// Import descriptions
import { quoteOperations, quoteFields } from './actions/quote';
import { dealRoomOperations, dealRoomFields } from './actions/dealRoom';
import { productOperations, productFields } from './actions/product';
import { playbookOperations, playbookFields } from './actions/playbook';
import { userOperations, userFields } from './actions/user';
import { versionOperations, versionFields } from './actions/version';
import { opportunityOperations, opportunityFields } from './actions/opportunity';
import { approvalOperations, approvalFields } from './actions/approval';
import { documentOperations, documentFields } from './actions/document';
import { webhookOperations, webhookFields } from './actions/webhook';

// Import execute functions
import { executeQuoteOperation } from './actions/quote';
import { executeDealRoomOperation } from './actions/dealRoom';
import { executeProductOperation } from './actions/product';
import { executePlaybookOperation } from './actions/playbook';
import { executeUserOperation } from './actions/user';
import { executeVersionOperation } from './actions/version';
import { executeOpportunityOperation } from './actions/opportunity';
import { executeApprovalOperation } from './actions/approval';
import { executeDocumentOperation } from './actions/document';
import { executeWebhookOperation } from './actions/webhook';

// Runtime licensing notice (logged once per load)
const LICENSING_LOGGED = Symbol.for('dealhub.licensing.logged');
if (!(globalThis as Record<symbol, boolean>)[LICENSING_LOGGED]) {
  console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
  (globalThis as Record<symbol, boolean>)[LICENSING_LOGGED] = true;
}

export class DealHub implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'DealHub',
    name: 'dealHub',
    icon: 'file:dealhub.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with DealHub CPQ, DealRoom, and quote management API',
    defaults: {
      name: 'DealHub',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'dealHubApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Approval',
            value: 'approval',
          },
          {
            name: 'DealRoom',
            value: 'dealRoom',
          },
          {
            name: 'Document',
            value: 'document',
          },
          {
            name: 'Opportunity',
            value: 'opportunity',
          },
          {
            name: 'Playbook',
            value: 'playbook',
          },
          {
            name: 'Product',
            value: 'product',
          },
          {
            name: 'Quote',
            value: 'quote',
          },
          {
            name: 'User',
            value: 'user',
          },
          {
            name: 'Version',
            value: 'version',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          },
        ],
        default: 'quote',
      },
      // Quote
      ...quoteOperations,
      ...quoteFields,
      // DealRoom
      ...dealRoomOperations,
      ...dealRoomFields,
      // Product
      ...productOperations,
      ...productFields,
      // Playbook
      ...playbookOperations,
      ...playbookFields,
      // User
      ...userOperations,
      ...userFields,
      // Version
      ...versionOperations,
      ...versionFields,
      // Opportunity
      ...opportunityOperations,
      ...opportunityFields,
      // Approval
      ...approvalOperations,
      ...approvalFields,
      // Document
      ...documentOperations,
      ...documentFields,
      // Webhook
      ...webhookOperations,
      ...webhookFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let executionData: INodeExecutionData[] = [];

        switch (resource) {
          case 'quote':
            executionData = await executeQuoteOperation.call(this, operation, i);
            break;
          case 'dealRoom':
            executionData = await executeDealRoomOperation.call(this, operation, i);
            break;
          case 'product':
            executionData = await executeProductOperation.call(this, operation, i);
            break;
          case 'playbook':
            executionData = await executePlaybookOperation.call(this, operation, i);
            break;
          case 'user':
            executionData = await executeUserOperation.call(this, operation, i);
            break;
          case 'version':
            executionData = await executeVersionOperation.call(this, operation, i);
            break;
          case 'opportunity':
            executionData = await executeOpportunityOperation.call(this, operation, i);
            break;
          case 'approval':
            executionData = await executeApprovalOperation.call(this, operation, i);
            break;
          case 'document':
            executionData = await executeDocumentOperation.call(this, operation, i);
            break;
          case 'webhook':
            executionData = await executeWebhookOperation.call(this, operation, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: {
              item: i,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
