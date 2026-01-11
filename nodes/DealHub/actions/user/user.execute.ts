/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, cleanQuery } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeUserOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const userId = this.getNodeParameter('userId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/users/${userId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/users', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/users', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'getCurrent': {
      responseData = await dealHubApiRequest.call(this, 'GET', '/users/me');
      break;
    }

    case 'getTeams': {
      const userId = this.getNodeParameter('userId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/users/${userId}/teams`);
      responseData = response.data || response;
      break;
    }

    case 'getQuotes': {
      const userId = this.getNodeParameter('userId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/users/${userId}/quotes`);
      responseData = response.data || response;
      break;
    }

    case 'getActivity': {
      const userId = this.getNodeParameter('userId', i) as string;
      const activityFilters = this.getNodeParameter('activityFilters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(activityFilters));

      const response = await dealHubApiRequest.call(this, 'GET', `/users/${userId}/activity`, undefined, query);
      responseData = response.data || response;
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
