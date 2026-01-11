/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, cleanQuery, cleanBody } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executeProductOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const productId = this.getNodeParameter('productId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/products/${productId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/products', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/products', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'create': {
      const sku = this.getNodeParameter('sku', i) as string;
      const name = this.getNodeParameter('name', i) as string;
      const unitPrice = this.getNodeParameter('unitPrice', i) as number;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

      const body: IDataObject = {
        sku,
        name,
        unit_price: unitPrice,
      };

      if (additionalFields.description) {
        body.description = additionalFields.description;
      }
      if (additionalFields.category) {
        body.category = additionalFields.category;
      }
      if (additionalFields.currency) {
        body.currency = additionalFields.currency;
      }
      if (additionalFields.pricingModel) {
        body.pricing_model = additionalFields.pricingModel;
      }
      if (additionalFields.isActive !== undefined) {
        body.is_active = additionalFields.isActive;
      }

      responseData = await dealHubApiRequest.call(this, 'POST', '/products', cleanBody(body));
      break;
    }

    case 'update': {
      const productId = this.getNodeParameter('productId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.sku) {
        body.sku = updateFields.sku;
      }
      if (updateFields.name) {
        body.name = updateFields.name;
      }
      if (updateFields.description) {
        body.description = updateFields.description;
      }
      if (updateFields.category) {
        body.category = updateFields.category;
      }
      if (updateFields.unitPrice !== undefined) {
        body.unit_price = updateFields.unitPrice;
      }
      if (updateFields.pricingModel) {
        body.pricing_model = updateFields.pricingModel;
      }
      if (updateFields.isActive !== undefined) {
        body.is_active = updateFields.isActive;
      }

      responseData = await dealHubApiRequest.call(this, 'PATCH', `/products/${productId}`, cleanBody(body));
      break;
    }

    case 'delete': {
      const productId = this.getNodeParameter('productId', i) as string;
      await dealHubApiRequest.call(this, 'DELETE', `/products/${productId}`);
      responseData = { success: true, productId };
      break;
    }

    case 'getPricing': {
      const productId = this.getNodeParameter('productId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/products/${productId}/pricing`);
      break;
    }

    case 'updatePricing': {
      const productId = this.getNodeParameter('productId', i) as string;
      const pricingData = this.getNodeParameter('pricingData', i) as string;

      const body = typeof pricingData === 'string' ? JSON.parse(pricingData) : pricingData;

      responseData = await dealHubApiRequest.call(this, 'PUT', `/products/${productId}/pricing`, body);
      break;
    }

    case 'getAttributes': {
      const productId = this.getNodeParameter('productId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/products/${productId}/attributes`);
      responseData = response.data || response;
      break;
    }

    case 'addToBundle': {
      const productId = this.getNodeParameter('productId', i) as string;
      const bundleId = this.getNodeParameter('bundleId', i) as string;
      const quantity = this.getNodeParameter('quantity', i, 1) as number;

      const body: IDataObject = {
        product_id: productId,
        quantity,
      };

      responseData = await dealHubApiRequest.call(this, 'POST', `/products/${bundleId}/bundle-items`, body);
      break;
    }

    case 'removeFromBundle': {
      const productId = this.getNodeParameter('productId', i) as string;
      const bundleId = this.getNodeParameter('bundleId', i) as string;

      await dealHubApiRequest.call(this, 'DELETE', `/products/${bundleId}/bundle-items/${productId}`);
      responseData = { success: true, productId, bundleId };
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
