/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// =============================================================================
// COMMON TYPES
// =============================================================================

export interface IDealHubPagination {
  has_more: boolean;
  next_cursor?: string;
  total_count?: number;
}

export interface IDealHubResponse<T = IDataObject> {
  data: T;
  pagination?: IDealHubPagination;
}

export interface IDealHubListResponse<T = IDataObject> {
  data: T[];
  pagination: IDealHubPagination;
}

export interface IDealHubError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
    request_id: string;
  };
}

// =============================================================================
// QUOTE TYPES
// =============================================================================

export type QuoteStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'published'
  | 'won'
  | 'lost'
  | 'expired';

export interface IQuote {
  id: string;
  opportunity_id?: string;
  playbook_id?: string;
  name: string;
  status: QuoteStatus;
  currency: string;
  total_amount: number;
  discount_amount?: number;
  tax_amount?: number;
  expiration_date?: string;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  line_items?: IQuoteLineItem[];
  metadata?: IDataObject;
}

export interface IQuoteLineItem {
  id: string;
  product_id: string;
  product_name: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  total_price: number;
}

export interface IQuoteVersion {
  version_id: string;
  version_number: number;
  is_active: boolean;
  created_at: string;
  created_by: string;
  notes?: string;
}

export interface IQuoteCreateInput {
  name: string;
  opportunity_id?: string;
  playbook_id?: string;
  currency?: string;
  expiration_date?: string;
  line_items?: Array<{
    product_id: string;
    quantity: number;
    unit_price?: number;
    discount_percent?: number;
  }>;
  metadata?: IDataObject;
}

export interface IQuoteUpdateInput {
  name?: string;
  expiration_date?: string;
  currency?: string;
  metadata?: IDataObject;
}

// =============================================================================
// DEALROOM TYPES
// =============================================================================

export interface IDealRoom {
  id: string;
  quote_id: string;
  url: string;
  access_code?: string;
  status: 'active' | 'expired' | 'signed';
  expiration_date?: string;
  allow_download: boolean;
  require_signature: boolean;
  created_at: string;
  updated_at: string;
  files?: IDealRoomFile[];
  signers?: IDealRoomSigner[];
}

export interface IDealRoomFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploaded_at: string;
}

export interface IDealRoomSigner {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'viewed' | 'signed' | 'declined';
  signed_at?: string;
  ip_address?: string;
}

export interface IDealRoomActivity {
  id: string;
  event_type: string;
  visitor_email?: string;
  visitor_name?: string;
  ip_address?: string;
  timestamp: string;
  duration_seconds?: number;
  pages_viewed?: number;
}

export interface IDealRoomCreateInput {
  quote_id: string;
  access_code?: string;
  expiration_days?: number;
  allow_download?: boolean;
  require_signature?: boolean;
  signers?: Array<{
    email: string;
    name: string;
  }>;
}

export interface IDealRoomUpdateInput {
  access_code?: string;
  expiration_date?: string;
  allow_download?: boolean;
  require_signature?: boolean;
}

// =============================================================================
// PRODUCT TYPES
// =============================================================================

export type PricingModel = 'flat' | 'tiered' | 'volume' | 'usage' | 'subscription';

export interface IProduct {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit_price: number;
  pricing_model: PricingModel;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attributes?: IProductAttribute[];
  pricing_tiers?: IPricingTier[];
}

export interface IProductAttribute {
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'date';
}

export interface IPricingTier {
  min_quantity: number;
  max_quantity?: number;
  unit_price: number;
}

export interface IProductCreateInput {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit_price: number;
  pricing_model?: PricingModel;
  currency?: string;
  is_active?: boolean;
  attributes?: IProductAttribute[];
}

export interface IProductUpdateInput {
  sku?: string;
  name?: string;
  description?: string;
  category?: string;
  unit_price?: number;
  pricing_model?: PricingModel;
  is_active?: boolean;
}

// =============================================================================
// PLAYBOOK TYPES
// =============================================================================

export type PlaybookType = 'standard' | 'renewal' | 'amendment' | 'upsell';

export interface IPlaybook {
  id: string;
  name: string;
  description?: string;
  type: PlaybookType;
  version_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  questions?: IPlaybookQuestion[];
}

export interface IPlaybookQuestion {
  id: string;
  order: number;
  text: string;
  type: 'single_select' | 'multi_select' | 'text' | 'number' | 'date';
  required: boolean;
  options?: IPlaybookAnswerOption[];
}

export interface IPlaybookAnswerOption {
  id: string;
  text: string;
  value: string;
  impacts?: Array<{
    type: 'product' | 'discount' | 'term';
    action: 'add' | 'remove' | 'modify';
    target_id?: string;
    value?: string | number;
  }>;
}

export interface IPlaybookSimulateInput {
  playbook_id: string;
  answers: Array<{
    question_id: string;
    answer_value: string | string[];
  }>;
}

export interface IPlaybookSimulateResult {
  products: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
  }>;
  discounts: Array<{
    type: string;
    value: number;
  }>;
  total_estimate: number;
}

// =============================================================================
// USER TYPES
// =============================================================================

export type UserRole = 'admin' | 'manager' | 'sales_rep' | 'viewer';

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  team_id?: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface ITeam {
  id: string;
  name: string;
  manager_id?: string;
  member_count: number;
}

export interface IUserActivity {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  timestamp: string;
  details?: IDataObject;
}

// =============================================================================
// VERSION TYPES
// =============================================================================

export type VersionStatus = 'draft' | 'active' | 'archived';

export interface IVersion {
  id: string;
  name: string;
  status: VersionStatus;
  description?: string;
  published_at?: string;
  published_by?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// OPPORTUNITY TYPES
// =============================================================================

export interface IOpportunity {
  id: string;
  crm_opportunity_id?: string;
  account_name: string;
  contact_name?: string;
  contact_email?: string;
  amount: number;
  currency: string;
  stage: string;
  probability?: number;
  close_date?: string;
  created_at: string;
  updated_at: string;
  last_synced_at?: string;
}

export interface IOpportunityCreateInput {
  crm_opportunity_id?: string;
  account_name: string;
  contact_name?: string;
  contact_email?: string;
  amount?: number;
  currency?: string;
  stage?: string;
  probability?: number;
  close_date?: string;
}

export interface IOpportunityUpdateInput {
  account_name?: string;
  contact_name?: string;
  contact_email?: string;
  amount?: number;
  stage?: string;
  probability?: number;
  close_date?: string;
}

// =============================================================================
// APPROVAL TYPES
// =============================================================================

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated';

export interface IApproval {
  id: string;
  quote_id: string;
  quote_name: string;
  approver_id: string;
  approver_name: string;
  status: ApprovalStatus;
  level: number;
  comments?: string;
  requested_at: string;
  responded_at?: string;
  delegated_to?: string;
}

export interface IApprovalHistory {
  id: string;
  quote_id: string;
  approver_id: string;
  approver_name: string;
  action: 'approved' | 'rejected' | 'delegated';
  comments?: string;
  timestamp: string;
}

// =============================================================================
// DOCUMENT TYPES
// =============================================================================

export type DocumentFormat = 'pdf' | 'docx' | 'xlsx';
export type DocumentStatus = 'generating' | 'ready' | 'failed';

export interface IDocument {
  id: string;
  quote_id: string;
  template_id?: string;
  name: string;
  format: DocumentFormat;
  status: DocumentStatus;
  url?: string;
  size?: number;
  created_at: string;
  expires_at?: string;
}

export interface IDocumentTemplate {
  id: string;
  name: string;
  description?: string;
  format: DocumentFormat;
  is_default: boolean;
  created_at: string;
}

export interface IDocumentGenerateInput {
  quote_id: string;
  template_id?: string;
  format?: DocumentFormat;
}

// =============================================================================
// WEBHOOK TYPES
// =============================================================================

export type WebhookEvent =
  | 'quote.created'
  | 'quote.updated'
  | 'quote.submitted'
  | 'quote.approved'
  | 'quote.rejected'
  | 'quote.published'
  | 'quote.won'
  | 'quote.lost'
  | 'dealroom.viewed'
  | 'dealroom.signed'
  | 'approval.requested'
  | 'approval.completed'
  | 'document.generated'
  | 'opportunity.synced';

export interface IWebhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  is_active: boolean;
  secret?: string;
  created_at: string;
  updated_at: string;
  last_triggered_at?: string;
}

export interface IWebhookCreateInput {
  url: string;
  events: WebhookEvent[];
  is_active?: boolean;
  secret?: string;
}

export interface IWebhookUpdateInput {
  url?: string;
  events?: WebhookEvent[];
  is_active?: boolean;
  secret?: string;
}

export interface IWebhookPayload {
  id: string;
  event: WebhookEvent;
  timestamp: string;
  data: IDataObject;
}

// =============================================================================
// CREDENTIAL TYPES
// =============================================================================

export interface IDealHubCredentials {
  apiKey: string;
  environment: 'production' | 'sandbox';
  subdomain: string;
}
