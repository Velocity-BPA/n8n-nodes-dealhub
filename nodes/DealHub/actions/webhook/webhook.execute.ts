/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, cleanQuery, cleanBody } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeWebhookOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/webhooks/${webhookId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/webhooks', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/webhooks', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'create': {
      const url = this.getNodeParameter('url', i) as string;
      const events = this.getNodeParameter('events', i) as string[];
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

      const body: IDataObject = {
        url,
        events,
      };

      if (additionalFields.description) {
        body.description = additionalFields.description;
      }
      if (additionalFields.secret) {
        body.secret = additionalFields.secret;
      }
      if (additionalFields.isActive !== undefined) {
        body.is_active = additionalFields.isActive;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', '/webhooks', cleanBody(body));
      break;
    }

    case 'update': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.url) {
        body.url = updateFields.url;
      }
      if (updateFields.events) {
        body.events = updateFields.events;
      }
      if (updateFields.description) {
        body.description = updateFields.description;
      }
      if (updateFields.secret) {
        body.secret = updateFields.secret;
      }
      if (updateFields.isActive !== undefined) {
        body.is_active = updateFields.isActive;
      }

      responseData = await dealHubApiRequest.call(this, 'PATCH', `/webhooks/${webhookId}`, cleanBody(body));
      break;
    }

    case 'delete': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`);
      break;
    }

    case 'getEvents': {
      const response = await dealHubApiRequest.call(this, 'GET', '/webhooks/events');
      responseData = response.data || response;
      break;
    }

    case 'test': {
      const webhookId = this.getNodeParameter('webhookId', i) as string;
      const eventType = this.getNodeParameter('eventType', i) as string;

      const body: IDataObject = {
        event_type: eventType,
      };

      responseData = await dealHubApiRequest.call(this, 'POST', `/webhooks/${webhookId}/test`, body);
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
