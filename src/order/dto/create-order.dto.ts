export interface orderStatus {
  status: 'pending' | 'delivering' | 'done' | 'declined';
}

export class OrderContent {
  id: number;
  count: number;
  price: number;
}

export class CreateOrderDto {
  readonly userId: number;
  readonly price: any;
  readonly status: orderStatus['status'];
  readonly address: string;
  readonly comment: string;
  readonly items: any;
}
