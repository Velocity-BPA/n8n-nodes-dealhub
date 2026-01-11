/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, cleanQuery, cleanBody } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeQuoteOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/quotes/${quoteId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/quotes', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/quotes', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'create': {
      const name = this.getNodeParameter('name', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

      const body: IDataObject = { name };

      if (additionalFields.opportunityId) {
        body.opportunity_id = additionalFields.opportunityId;
      }
      if (additionalFields.playbookId) {
        body.playbook_id = additionalFields.playbookId;
      }
      if (additionalFields.currency) {
        body.currency = additionalFields.currency;
      }
      if (additionalFields.expirationDate) {
        body.expiration_date = additionalFields.expirationDate;
      }
      if (additionalFields.metadata) {
        body.metadata = typeof additionalFields.metadata === 'string'
          ? JSON.parse(additionalFields.metadata)
          : additionalFields.metadata;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', '/quotes', cleanBody(body));
      break;
    }

    case 'update': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.name) {
        body.name = updateFields.name;
      }
      if (updateFields.currency) {
        body.currency = updateFields.currency;
      }
      if (updateFields.expirationDate) {
        body.expiration_date = updateFields.expirationDate;
      }
      if (updateFields.metadata) {
        body.metadata = typeof updateFields.metadata === 'string'
          ? JSON.parse(updateFields.metadata)
          : updateFields.metadata;
      }

      responseData = await dealHubApiRequest.call(this, 'PATCH', `/quotes/${quoteId}`, cleanBody(body));
      break;
    }

    case 'delete': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      await dealHubApiRequest.call(this, 'DELETE', `/quotes/${quoteId}`);
      responseData = { success: true, quoteId };
      break;
    }

    case 'submit': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'POST', `/quotes/${quoteId}/submit`);
      break;
    }

    case 'approve': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const comments = this.getNodeParameter('approvalComments', i, '') as string;

      const body: IDataObject = {};
      if (comments) {
        body.comments = comments;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', `/quotes/${quoteId}/approve`, cleanBody(body));
      break;
    }

    case 'reject': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const reason = this.getNodeParameter('rejectionReason', i) as string;

      responseData = await dealHubApiRequest.call(this, 'POST', `/quotes/${quoteId}/reject`, { reason });
      break;
    }

    case 'publish': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const publishOptions = this.getNodeParameter('publishOptions', i, {}) as IDataObject;

      const body: IDataObject = {};

      if (publishOptions.createDealRoom !== undefined) {
        body.create_deal_room = publishOptions.createDealRoom;
      }
      if (publishOptions.notifyRecipients !== undefined) {
        body.notify_recipients = publishOptions.notifyRecipients;
      }
      if (publishOptions.recipientEmails) {
        body.recipient_emails = (publishOptions.recipientEmails as string).split(',').map((e) => e.trim());
      }

      responseData = await dealHubApiRequest.call(this, 'POST', `/quotes/${quoteId}/publish`, cleanBody(body));
      break;
    }

    case 'clone': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const cloneOptions = this.getNodeParameter('cloneOptions', i, {}) as IDataObject;

      const body: IDataObject = {};

      if (cloneOptions.newName) {
        body.name = cloneOptions.newName;
      }
      if (cloneOptions.includeLineItems !== undefined) {
        body.include_line_items = cloneOptions.includeLineItems;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', `/quotes/${quoteId}/clone`, cleanBody(body));
      break;
    }

    case 'getVersions': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/quotes/${quoteId}/versions`);
      responseData = response.data || response;
      break;
    }

    case 'setActiveVersion': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const versionNumber = this.getNodeParameter('versionNumber', i) as number;

      responseData = await dealHubApiRequest.call(
        this,
        'POST',
        `/quotes/${quoteId}/versions/${versionNumber}/activate`,
      );
      break;
    }

    case 'exportPdf': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'POST', `/quotes/${quoteId}/export`, { format: 'pdf' });
      break;
    }

    case 'exportExcel': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'POST', `/quotes/${quoteId}/export`, { format: 'xlsx' });
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
