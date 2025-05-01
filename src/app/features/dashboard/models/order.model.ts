// order.model.ts
export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'Returned';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal?: number;
  imageUrl?: string;
  sku?: string;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface OrderPayment {
  method: 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Cash';
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  transactionId?: string;
  amount: number;
  date: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  payment: OrderPayment;
  shipping?: {
    method: string;
    cost: number;
    trackingNumber?: string;
    estimatedDelivery?: string;
  };
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  notes?: string;
  history?: {
    date: string;
    status: OrderStatus;
    comment?: string;
    user?: string;
  }[];
}