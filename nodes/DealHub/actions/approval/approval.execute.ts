/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, cleanQuery, cleanBody } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeApprovalOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const approvalId = this.getNodeParameter('approvalId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/approvals/${approvalId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/approvals', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/approvals', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'approve': {
      const approvalId = this.getNodeParameter('approvalId', i) as string;
      const options = this.getNodeParameter('options', i, {}) as IDataObject;

      const body: IDataObject = {};

      if (options.comments) {
        body.comments = options.comments;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', `/approvals/${approvalId}/approve`, cleanBody(body));
      break;
    }

    case 'reject': {
      const approvalId = this.getNodeParameter('approvalId', i) as string;
      const rejectionReason = this.getNodeParameter('rejectionReason', i) as string;

      const body: IDataObject = {
        rejection_reason: rejectionReason,
      };

      responseData = await dealHubApiRequest.call(this, 'POST', `/approvals/${approvalId}/reject`, body);
      break;
    }

    case 'delegate': {
      const approvalId = this.getNodeParameter('approvalId', i) as string;
      const delegateToUserId = this.getNodeParameter('delegateToUserId', i) as string;
      const delegateOptions = this.getNodeParameter('delegateOptions', i, {}) as IDataObject;

      const body: IDataObject = {
        delegate_to_user_id: delegateToUserId,
      };

      if (delegateOptions.reason) {
        body.reason = delegateOptions.reason;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', `/approvals/${approvalId}/delegate`, cleanBody(body));
      break;
    }

    case 'getHistory': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/quotes/${quoteId}/approvals/history`);
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
