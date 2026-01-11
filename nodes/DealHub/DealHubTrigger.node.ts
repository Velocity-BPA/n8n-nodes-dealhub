/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
} from 'n8n-workflow';

import { dealHubApiRequest } from './transport';
import { verifyWebhookSignature } from './utils';

export class DealHubTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'DealHub Trigger',
    name: 'dealHubTrigger',
    icon: 'file:dealhub.svg',
    group: ['trigger'],
    version: 1,
    description: 'Starts the workflow when DealHub events occur',
    defaults: {
      name: 'DealHub Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'dealHubApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        options: [
          {
            name: 'Approval Completed',
            value: 'approval.completed',
            description: 'Triggers when an approval process completes',
          },
          {
            name: 'Approval Requested',
            value: 'approval.requested',
            description: 'Triggers when a new approval is requested',
          },
          {
            name: 'DealRoom Signed',
            value: 'dealroom.signed',
            description: 'Triggers when a document is signed in DealRoom',
          },
          {
            name: 'DealRoom Viewed',
            value: 'dealroom.viewed',
            description: 'Triggers when a DealRoom is viewed by a prospect',
          },
          {
            name: 'Document Generated',
            value: 'document.generated',
            description: 'Triggers when document generation completes',
          },
          {
            name: 'Opportunity Synced',
            value: 'opportunity.synced',
            description: 'Triggers when an opportunity is synced with CRM',
          },
          {
            name: 'Quote Approved',
            value: 'quote.approved',
            description: 'Triggers when a quote is approved',
          },
          {
            name: 'Quote Created',
            value: 'quote.created',
            description: 'Triggers when a new quote is created',
          },
          {
            name: 'Quote Lost',
            value: 'quote.lost',
            description: 'Triggers when a quote is marked as lost',
          },
          {
            name: 'Quote Published',
            value: 'quote.published',
            description: 'Triggers when a quote is published to DealRoom',
          },
          {
            name: 'Quote Rejected',
            value: 'quote.rejected',
            description: 'Triggers when a quote is rejected',
          },
          {
            name: 'Quote Submitted',
            value: 'quote.submitted',
            description: 'Triggers when a quote is submitted for approval',
          },
          {
            name: 'Quote Updated',
            value: 'quote.updated',
            description: 'Triggers when a quote is updated',
          },
          {
            name: 'Quote Won',
            value: 'quote.won',
            description: 'Triggers when a quote is marked as won',
          },
        ],
        description: 'The events to listen for',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Verify Signature',
            name: 'verifySignature',
            type: 'boolean',
            default: true,
            description: 'Whether to verify webhook signature using HMAC-SHA256',
          },
          {
            displayName: 'Webhook Secret',
            name: 'webhookSecret',
            type: 'string',
            typeOptions: {
              password: true,
            },
            default: '',
            description: 'Secret for verifying webhook signatures (if not using auto-generated)',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const webhookData = this.getWorkflowStaticData('node');

        if (webhookData.webhookId === undefined) {
          return false;
        }

        try {
          const response = await dealHubApiRequest.call(
            this,
            'GET',
            `/webhooks/${webhookData.webhookId}`,
          );

          if (response.url === webhookUrl) {
            return true;
          }
        } catch {
          return false;
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const events = this.getNodeParameter('events') as string[];
        const webhookData = this.getWorkflowStaticData('node');
        const options = this.getNodeParameter('options', {}) as IDataObject;

        const body: IDataObject = {
          url: webhookUrl,
          events,
          is_active: true,
        };

        // Use provided secret or generate one
        if (options.webhookSecret) {
          body.secret = options.webhookSecret;
          webhookData.secret = options.webhookSecret;
        }

        const response = await dealHubApiRequest.call(
          this,
          'POST',
          '/webhooks',
          body,
        );

        if (response.id === undefined) {
          return false;
        }

        webhookData.webhookId = response.id;

        // Store secret from response if auto-generated
        if (response.secret && !options.webhookSecret) {
          webhookData.secret = response.secret;
        }

        return true;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');

        if (webhookData.webhookId !== undefined) {
          try {
            await dealHubApiRequest.call(
              this,
              'DELETE',
              `/webhooks/${webhookData.webhookId}`,
            );
          } catch (error) {
            return false;
          }

          delete webhookData.webhookId;
          delete webhookData.secret;
        }

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const bodyData = this.getBodyData();
    const options = this.getNodeParameter('options', {}) as IDataObject;
    const webhookData = this.getWorkflowStaticData('node');

    // Verify webhook signature if enabled
    if (options.verifySignature !== false) {
      const signature = req.headers['x-dealhub-signature'] as string;
      const secret = (options.webhookSecret as string) || (webhookData.secret as string);

      if (secret && signature) {
        const rawBody = JSON.stringify(bodyData);
        const isValid = verifyWebhookSignature(rawBody, signature, secret);

        if (!isValid) {
          return {
            webhookResponse: {
              status: 401,
              body: { error: 'Invalid signature' },
            },
          };
        }
      }
    }

    // Extract event data
    const eventData = bodyData as IDataObject;

    return {
      workflowData: [
        this.helpers.returnJsonArray([
          {
            event: eventData.event || eventData.type,
            timestamp: eventData.timestamp || new Date().toISOString(),
            data: eventData.data || eventData,
            webhookId: webhookData.webhookId,
          },
        ]),
      ],
    };
  }
}
