// Shared wire types — these mirror the JSON the otto service emits.
// Keep in sync with services/otto/internal/conversation/model.go and
// services/otto/internal/message/model.go.

export type ConversationStatus = "pending" | "active" | "closed";

export type SenderType = "customer" | "staff" | "system";

export interface Customer {
  session_token?: string;
  user_id?: string;
  name?: string;
  email?: string;
}

export interface Assignee {
  user_id: string;
  name?: string;
  email?: string;
  assigned_at: string;
}

export interface IntakeForm {
  reason: string;
  status: string;
  dob?: string;
  submitted_at: string;
}

export interface Feedback {
  call_rating: number;
  query_resolved: boolean;
  staff_rating: number;
  comments?: string;
  submitted_at: string;
}

export interface QueueSnapshot {
  status: ConversationStatus;
  position: number;
  total_pending: number;
  estimated_wait_seconds: number;
}

export interface Conversation {
  id: string;
  case_id?: string;
  tenant_id: string;
  store_id: string;
  status: ConversationStatus;
  subject?: string;
  customer: Customer;
  assignee?: Assignee;
  intake?: IntakeForm;
  feedback?: Feedback;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  last_customer_message_at?: string;
  inactivity_closed_at?: string;
  closed_at?: string;
  message_count: number;
  unread_count_customer: number;
  unread_count_staff: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  tenant_id: string;
  store_id: string;
  sender_type: SenderType;
  sender_id?: string;
  sender_name?: string;
  body: string;
  created_at: string;
}

// WebSocket envelope — matches hub.Envelope on the server side.
export interface WsEnvelope<T = unknown> {
  type:
    | "otto.conversation.created"
    | "otto.conversation.updated"
    | "otto.conversation.closed"
    | "otto.message.created";
  room?: string;
  payload: T;
}
