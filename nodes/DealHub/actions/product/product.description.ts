/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['product'],
      },
    },
    options: [
      {
        name: 'Add to Bundle',
        value: 'addToBundle',
        description: 'Add product to a bundle',
        action: 'Add product to bundle',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new product',
        action: 'Create a product',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Remove a product from catalog',
        action: 'Delete a product',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get product details by ID',
        action: 'Get a product',
      },
      {
        name: 'Get Attributes',
        value: 'getAttributes',
        description: 'Get product attributes',
        action: 'Get product attributes',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all products in catalog',
        action: 'Get many products',
      },
      {
        name: 'Get Pricing',
        value: 'getPricing',
        description: 'Get pricing rules for a product',
        action: 'Get product pricing',
      },
      {
        name: 'Remove From Bundle',
        value: 'removeFromBundle',
        description: 'Remove product from bundle',
        action: 'Remove product from bundle',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update product information',
        action: 'Update a product',
      },
      {
        name: 'Update Pricing',
        value: 'updatePricing',
        description: 'Update product pricing',
        action: 'Update product pricing',
      },
    ],
    default: 'get',
  },
];

export const productFields: INodeProperties[] = [
  // ----------------------------------
  //         product: get, update, delete, getPricing, getAttributes, updatePricing
  // ----------------------------------
  {
    displayName: 'Product ID',
    name: 'productId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['get', 'update', 'delete', 'getPricing', 'getAttributes', 'updatePricing', 'addToBundle', 'removeFromBundle'],
      },
    },
    description: 'Unique product identifier',
  },

  // ----------------------------------
  //         product: create
  // ----------------------------------
  {
    displayName: 'SKU',
    name: 'sku',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['create'],
      },
    },
    description: 'Product SKU (stock keeping unit)',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['create'],
      },
    },
    description: 'Product name',
  },
  {
    displayName: 'Unit Price',
    name: 'unitPrice',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['create'],
      },
    },
    description: 'Base unit price for the product',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Category',
        name: 'category',
        type: 'string',
        default: '',
        description: 'Product category',
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: 'USD',
        description: 'Product currency code (ISO 4217)',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Product description',
      },
      {
        displayName: 'Is Active',
        name: 'isActive',
        type: 'boolean',
        default: true,
        description: 'Whether product is active',
      },
      {
        displayName: 'Pricing Model',
        name: 'pricingModel',
        type: 'options',
        options: [
          { name: 'Flat', value: 'flat' },
          { name: 'Subscription', value: 'subscription' },
          { name: 'Tiered', value: 'tiered' },
          { name: 'Usage', value: 'usage' },
          { name: 'Volume', value: 'volume' },
        ],
        default: 'flat',
        description: 'Pricing model for the product',
      },
    ],
  },

  // ----------------------------------
  //         product: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Category',
        name: 'category',
        type: 'string',
        default: '',
        description: 'Product category',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Product description',
      },
      {
        displayName: 'Is Active',
        name: 'isActive',
        type: 'boolean',
        default: true,
        description: 'Whether product is active',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Product name',
      },
      {
        displayName: 'Pricing Model',
        name: 'pricingModel',
        type: 'options',
        options: [
          { name: 'Flat', value: 'flat' },
          { name: 'Subscription', value: 'subscription' },
          { name: 'Tiered', value: 'tiered' },
          { name: 'Usage', value: 'usage' },
          { name: 'Volume', value: 'volume' },
        ],
        default: 'flat',
        description: 'Pricing model for the product',
      },
      {
        displayName: 'SKU',
        name: 'sku',
        type: 'string',
        default: '',
        description: 'Product SKU',
      },
      {
        displayName: 'Unit Price',
        name: 'unitPrice',
        type: 'number',
        default: 0,
        description: 'Base unit price for the product',
      },
    ],
  },

  // ----------------------------------
  //         product: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Category',
        name: 'category',
        type: 'string',
        default: '',
        description: 'Filter by product category',
      },
      {
        displayName: 'Is Active',
        name: 'isActive',
        type: 'boolean',
        default: true,
        description: 'Filter by active status',
      },
      {
        displayName: 'Pricing Model',
        name: 'pricingModel',
        type: 'options',
        options: [
          { name: 'Flat', value: 'flat' },
          { name: 'Subscription', value: 'subscription' },
          { name: 'Tiered', value: 'tiered' },
          { name: 'Usage', value: 'usage' },
          { name: 'Volume', value: 'volume' },
        ],
        default: '',
        description: 'Filter by pricing model',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search products by name or SKU',
      },
    ],
  },

  // ----------------------------------
  //         product: updatePricing
  // ----------------------------------
  {
    displayName: 'Pricing Data',
    name: 'pricingData',
    type: 'json',
    required: true,
    default: '{}',
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['updatePricing'],
      },
    },
    description: 'JSON object with pricing configuration. For tiered pricing, include "tiers" array with min_quantity, max_quantity, and unit_price.',
  },

  // ----------------------------------
  //         product: addToBundle/removeFromBundle
  // ----------------------------------
  {
    displayName: 'Bundle ID',
    name: 'bundleId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['addToBundle', 'removeFromBundle'],
      },
    },
    description: 'Bundle product ID to add to or remove from',
  },
  {
    displayName: 'Quantity',
    name: 'quantity',
    type: 'number',
    default: 1,
    displayOptions: {
      show: {
        resource: ['product'],
        operation: ['addToBundle'],
      },
    },
    description: 'Default quantity in bundle',
  },
];
