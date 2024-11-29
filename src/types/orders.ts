export type OrderStatus =
  | 'created'
  | 'ready_to_ship'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  context: {
    bap_id: string;
    bpp_id: string;
    timestamp: string;
  };
  billing_address: {
    name: string;
    address: Address;
  };
  network_order_id: string;
  "@ondc/org/linked_order": {
    order: {
      id: string;
    };
  };  
  transaction_id: string;
  state: string;
  fulfilment_state: string;
  rto_fulfillment_state: string;
  ready_to_ship: string;
  fulfillments: any[];
  category_type: string;
  provider_descriptor: {
    name: string;
  };
  end_location: {
    location: {
      address: Address;
    },
    time: {
      range: {
        end: string;
      };
    },
  };
  shipped_at:string;
  ready_to_ship_timeline: string;
  cancelled_at: string;
  cancelled_by: string;
  cancellationReason: string;
  platform_charges: string;
  quote: {
    price: {
      value: string;
    };
  };

  createdAt: string;
  createdBy: string;
  updatedAt: string;
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