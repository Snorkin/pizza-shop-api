import {
  pricePizza,
  priceProduct,
  weightPizza,
  weightProduct,
} from '../products.entity';

export class CreateProductDto {
  readonly title: string;
  readonly img: any;
  readonly description: string;
  readonly price: pricePizza | priceProduct;
  readonly weight: weightPizza | weightProduct;
  readonly type: string;
}
