/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, dealHubApiUpload, cleanQuery, cleanBody } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeDealRoomOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/dealrooms/${dealRoomId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/dealrooms', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/dealrooms', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'create': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

      const body: IDataObject = { quote_id: quoteId };

      if (additionalFields.accessCode) {
        body.access_code = additionalFields.accessCode;
      }
      if (additionalFields.expirationDays !== undefined) {
        body.expiration_days = additionalFields.expirationDays;
      }
      if (additionalFields.allowDownload !== undefined) {
        body.allow_download = additionalFields.allowDownload;
      }
      if (additionalFields.requireSignature !== undefined) {
        body.require_signature = additionalFields.requireSignature;
      }
      if (additionalFields.signers) {
        const signerData = additionalFields.signers as IDataObject;
        const signerValues = signerData.signerValues as IDataObject[];
        if (signerValues && signerValues.length > 0) {
          body.signers = signerValues.map((s) => ({
            email: s.email,
            name: s.name,
          }));
        }
      }

      responseData = await dealHubApiRequest.call(this, 'POST', '/dealrooms', cleanBody(body));
      break;
    }

    case 'update': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.accessCode) {
        body.access_code = updateFields.accessCode;
      }
      if (updateFields.expirationDate) {
        body.expiration_date = updateFields.expirationDate;
      }
      if (updateFields.allowDownload !== undefined) {
        body.allow_download = updateFields.allowDownload;
      }
      if (updateFields.requireSignature !== undefined) {
        body.require_signature = updateFields.requireSignature;
      }

      responseData = await dealHubApiRequest.call(this, 'PATCH', `/dealrooms/${dealRoomId}`, cleanBody(body));
      break;
    }

    case 'delete': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      await dealHubApiRequest.call(this, 'DELETE', `/dealrooms/${dealRoomId}`);
      responseData = { success: true, dealRoomId };
      break;
    }

    case 'addFile': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
      const fileName = this.getNodeParameter('fileName', i, '') as string;

      const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
      const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

      const formData: IDataObject = {
        file: {
          value: buffer,
          options: {
            filename: fileName || binaryData.fileName || 'file',
            contentType: binaryData.mimeType,
          },
        },
      };

      responseData = await dealHubApiUpload.call(this, `/dealrooms/${dealRoomId}/files`, formData);
      break;
    }

    case 'removeFile': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      const fileId = this.getNodeParameter('fileId', i) as string;

      await dealHubApiRequest.call(this, 'DELETE', `/dealrooms/${dealRoomId}/files/${fileId}`);
      responseData = { success: true, dealRoomId, fileId };
      break;
    }

    case 'getActivity': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/dealrooms/${dealRoomId}/activity`);
      responseData = response.data || response;
      break;
    }

    case 'getSigners': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/dealrooms/${dealRoomId}/signers`);
      responseData = response.data || response;
      break;
    }

    case 'sendReminder': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      const signerEmail = this.getNodeParameter('signerEmail', i, '') as string;
      const customMessage = this.getNodeParameter('customMessage', i, '') as string;

      const body: IDataObject = {};
      if (signerEmail) {
        body.signer_email = signerEmail;
      }
      if (customMessage) {
        body.custom_message = customMessage;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', `/dealrooms/${dealRoomId}/remind`, cleanBody(body));
      break;
    }

    case 'expire': {
      const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'POST', `/dealrooms/${dealRoomId}/expire`);
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
