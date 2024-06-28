export interface OrderItem {
  id: number;
  quantity: number;
  colorName: string;
  sizeName: string;
  productId: number;
  productTitle: string;
  imageUrl: string;
  itemPrice: number;
  totalItemPrice: number;
}

export interface Order {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  shippingAddress: string;
  itemsCount: number;
  shippingPrice: number;
  totalOrderPrice: number;
  orderStatus: string;
  paymentMethod: string;
  createdDate: string;
  deliverDate: string;
  orderItems: OrderItem[];
}

export interface OrdersResponse {
  userOrdersCount: number;
  orders: Order[];
}
