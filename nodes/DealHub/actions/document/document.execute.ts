/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, dealHubApiDownload, cleanQuery, cleanBody } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeDocumentOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const documentId = this.getNodeParameter('documentId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/documents/${documentId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/documents', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/documents', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'generate': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const templateId = this.getNodeParameter('templateId', i) as string;
      const generateOptions = this.getNodeParameter('generateOptions', i, {}) as IDataObject;

      const body: IDataObject = {
        quote_id: quoteId,
        template_id: templateId,
      };

      if (generateOptions.format) {
        body.format = generateOptions.format;
      }
      if (generateOptions.language) {
        body.language = generateOptions.language;
      }
      if (generateOptions.versionNumber !== undefined && generateOptions.versionNumber !== 0) {
        body.version_number = generateOptions.versionNumber;
      }
      if (generateOptions.includeLineItems !== undefined) {
        body.include_line_items = generateOptions.includeLineItems;
      }
      if (generateOptions.includeTerms !== undefined) {
        body.include_terms = generateOptions.includeTerms;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', '/documents/generate', cleanBody(body));
      break;
    }

    case 'download': {
      const documentId = this.getNodeParameter('documentId', i) as string;
      const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

      // First get document metadata
      const documentMeta = await dealHubApiRequest.call(this, 'GET', `/documents/${documentId}`);

      // Download the file
      const binaryData = await dealHubApiDownload.call(this, `/documents/${documentId}/download`);

      const fileName = documentMeta.file_name || `document_${documentId}.pdf`;
      const mimeType = documentMeta.mime_type || 'application/pdf';

      const data = await this.helpers.prepareBinaryData(
        binaryData,
        fileName,
        mimeType,
      );

      return [
        {
          json: documentMeta as IDataObject,
          binary: {
            [binaryPropertyName]: data,
          },
        },
      ];
    }

    case 'delete': {
      const documentId = this.getNodeParameter('documentId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'DELETE', `/documents/${documentId}`);
      break;
    }

    case 'getTemplates': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const templateFilters = this.getNodeParameter('templateFilters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(templateFilters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/documents/templates', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/documents/templates', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'preview': {
      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const templateId = this.getNodeParameter('templateId', i) as string;

      const body: IDataObject = {
        quote_id: quoteId,
        template_id: templateId,
      };

      responseData = await dealHubApiRequest.call(this, 'POST', '/documents/preview', body);
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
