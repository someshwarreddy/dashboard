export interface OrderProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail: string;
}

export interface Order {
  id: number;
  userId: number;
  products: OrderProduct[];
  total: number;
  totalProducts: number;
  totalQuantity: number;

}

export interface OrderApiResponse {
  carts: Order[];
  total: number;
  skip: number;
  limit: number;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Delivered';