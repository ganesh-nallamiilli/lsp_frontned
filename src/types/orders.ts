export type OrderStatus =
  | 'created'
  | 'ready_to_ship'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  logisticsBuyerNpName: string;
  logisticsSellerNpName: string;
  createdAt: string;
  createdBy: string;
  networkOrderId: string;
  retailOrderId: string;
  networkTransactionId: string;
  logisticsSellerNpOrderId: string;
  status: string;
  fulfillmentStatus: string;
  rtoStatus: string;
  updatedAt: string;
  readyToShip: boolean;
  awbNo: string;
  readyToShipTimestamp: string;
  shipmentType: string;
  logisticsProvider: string;
  promisedTatDelivery: string;
  shippedDateTime: string;
  deliveredDateTime: string;
  pickupCity: string;
  deliveryCity: string;
  cancelledDateTime: string;
  cancelledBy: string;
  cancellationReason: string;
  platformChargeAmount: number;
  shippingCharges: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}