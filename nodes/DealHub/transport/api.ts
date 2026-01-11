/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  IDataObject,
  IHttpRequestMethods,
  IRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { IDealHubCredentials } from '../types/DealHubTypes';

const API_VERSION = '2024-01';

/**
 * Gets the base URL for DealHub API based on environment
 */
export function getBaseUrl(credentials: IDealHubCredentials): string {
  return credentials.environment === 'sandbox'
    ? 'https://sandbox-api.dealhub.io'
    : 'https://api.dealhub.io';
}

/**
 * Makes an authenticated request to the DealHub API
 */
export async function dealHubApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<any> {
  const credentials = (await this.getCredentials('dealHubApi')) as IDealHubCredentials;
  const baseUrl = getBaseUrl(credentials);

  const options: IRequestOptions = {
    method,
    uri: `${baseUrl}/v1${endpoint}`,
    headers: {
      Authorization: `Bearer ${credentials.apiKey}`,
      'Content-Type': 'application/json',
      'X-DealHub-Version': API_VERSION,
      'X-DealHub-Subdomain': credentials.subdomain,
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  if (query && Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    const response = await this.helpers.request(options);
    return response;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: getErrorMessage(error),
    });
  }
}

/**
 * Makes a paginated request to get all items from the DealHub API
 */
export async function dealHubApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<any[]> {
  const returnData: any[] = [];
  let hasMore = true;
  let cursor: string | undefined;

  query = query || {};
  query.limit = 100;

  while (hasMore) {
    if (cursor) {
      query.cursor = cursor;
    }

    const response = await dealHubApiRequest.call(this, method, endpoint, body, query);

    if (response.data && Array.isArray(response.data)) {
      returnData.push(...response.data);
    }

    hasMore = response.pagination?.has_more === true;
    cursor = response.pagination?.next_cursor;

    // Safety check to prevent infinite loops
    if (!cursor && hasMore) {
      hasMore = false;
    }
  }

  return returnData;
}

/**
 * Handles file download from DealHub API
 */
export async function dealHubApiDownload(
  this: IExecuteFunctions,
  endpoint: string,
): Promise<Buffer> {
  const credentials = (await this.getCredentials('dealHubApi')) as IDealHubCredentials;
  const baseUrl = getBaseUrl(credentials);

  const options: IRequestOptions = {
    method: 'GET',
    uri: `${baseUrl}/v1${endpoint}`,
    headers: {
      Authorization: `Bearer ${credentials.apiKey}`,
      'X-DealHub-Version': API_VERSION,
      'X-DealHub-Subdomain': credentials.subdomain,
    },
    encoding: null,
    resolveWithFullResponse: true,
  };

  try {
    const response = await this.helpers.request(options);
    return response.body as Buffer;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: getErrorMessage(error),
    });
  }
}

/**
 * Handles file upload to DealHub API
 */
export async function dealHubApiUpload(
  this: IExecuteFunctions,
  endpoint: string,
  formData: IDataObject,
): Promise<any> {
  const credentials = (await this.getCredentials('dealHubApi')) as IDealHubCredentials;
  const baseUrl = getBaseUrl(credentials);

  const options: IRequestOptions = {
    method: 'POST',
    uri: `${baseUrl}/v1${endpoint}`,
    headers: {
      Authorization: `Bearer ${credentials.apiKey}`,
      'X-DealHub-Version': API_VERSION,
      'X-DealHub-Subdomain': credentials.subdomain,
    },
    formData,
    json: true,
  };

  try {
    return await this.helpers.request(options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: getErrorMessage(error),
    });
  }
}

/**
 * Extracts a meaningful error message from API errors
 */
function getErrorMessage(error: any): string {
  if (error?.response?.body?.error?.message) {
    const apiError = error.response.body.error;
    let message = apiError.message;

    if (apiError.details && Array.isArray(apiError.details)) {
      const details = apiError.details
        .map((d: { field: string; message: string }) => `${d.field}: ${d.message}`)
        .join(', ');
      message += ` (${details})`;
    }

    return message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Validates and cleans query parameters
 */
export function cleanQuery(query: IDataObject): IDataObject {
  const cleanedQuery: IDataObject = {};

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanedQuery[key] = value;
    }
  }

  return cleanedQuery;
}

/**
 * Validates and cleans body parameters
 */
export function cleanBody(body: IDataObject): IDataObject {
  const cleanedBody: IDataObject = {};

  for (const [key, value] of Object.entries(body)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanedBody[key] = value;
    }
  }

  return cleanedBody;
}
