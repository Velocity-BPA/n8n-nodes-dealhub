/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, cleanQuery, cleanBody } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeOpportunityOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const opportunityId = this.getNodeParameter('opportunityId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/opportunities/${opportunityId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/opportunities', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/opportunities', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'create': {
      const accountName = this.getNodeParameter('accountName', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

      const body: IDataObject = { account_name: accountName };

      if (additionalFields.crmOpportunityId) {
        body.crm_opportunity_id = additionalFields.crmOpportunityId;
      }
      if (additionalFields.contactName) {
        body.contact_name = additionalFields.contactName;
      }
      if (additionalFields.contactEmail) {
        body.contact_email = additionalFields.contactEmail;
      }
      if (additionalFields.amount !== undefined) {
        body.amount = additionalFields.amount;
      }
      if (additionalFields.currency) {
        body.currency = additionalFields.currency;
      }
      if (additionalFields.stage) {
        body.stage = additionalFields.stage;
      }
      if (additionalFields.probability !== undefined) {
        body.probability = additionalFields.probability;
      }
      if (additionalFields.closeDate) {
        body.close_date = additionalFields.closeDate;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', '/opportunities', cleanBody(body));
      break;
    }

    case 'update': {
      const opportunityId = this.getNodeParameter('opportunityId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.accountName) {
        body.account_name = updateFields.accountName;
      }
      if (updateFields.contactName) {
        body.contact_name = updateFields.contactName;
      }
      if (updateFields.contactEmail) {
        body.contact_email = updateFields.contactEmail;
      }
      if (updateFields.amount !== undefined) {
        body.amount = updateFields.amount;
      }
      if (updateFields.stage) {
        body.stage = updateFields.stage;
      }
      if (updateFields.probability !== undefined) {
        body.probability = updateFields.probability;
      }
      if (updateFields.closeDate) {
        body.close_date = updateFields.closeDate;
      }

      responseData = await dealHubApiRequest.call(this, 'PATCH', `/opportunities/${opportunityId}`, cleanBody(body));
      break;
    }

    case 'getQuotes': {
      const opportunityId = this.getNodeParameter('opportunityId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/opportunities/${opportunityId}/quotes`);
      responseData = response.data || response;
      break;
    }

    case 'sync': {
      const opportunityId = this.getNodeParameter('opportunityId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'POST', `/opportunities/${opportunityId}/sync`);
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
