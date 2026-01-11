/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, cleanQuery, cleanBody } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeVersionOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const versionId = this.getNodeParameter('versionId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/versions/${versionId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/versions', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/versions', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'getCurrent': {
      responseData = await dealHubApiRequest.call(this, 'GET', '/versions/current');
      break;
    }

    case 'getProducts': {
      const versionId = this.getNodeParameter('versionId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/versions/${versionId}/products`);
      responseData = response.data || response;
      break;
    }

    case 'getPlaybooks': {
      const versionId = this.getNodeParameter('versionId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/versions/${versionId}/playbooks`);
      responseData = response.data || response;
      break;
    }

    case 'publish': {
      const versionId = this.getNodeParameter('versionId', i) as string;
      const publishOptions = this.getNodeParameter('publishOptions', i, {}) as IDataObject;

      const body: IDataObject = {};
      if (publishOptions.name) {
        body.name = publishOptions.name;
      }
      if (publishOptions.description) {
        body.description = publishOptions.description;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', `/versions/${versionId}/publish`, cleanBody(body));
      break;
    }

    case 'rollback': {
      const versionId = this.getNodeParameter('versionId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'POST', `/versions/${versionId}/rollback`);
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
