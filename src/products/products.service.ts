import { FilesService } from './../files/files.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductType } from './product_type/productType.entity';
import { CreateProductTypeDto } from './product_type/dto/productType.dto';

interface Order {
  order: string;
  direction: 'ASC' | 'DESC';
}
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
    private fileService: FilesService
  ) {}

  async createProduct(dto: CreateProductDto, img) {
    const type = await this.productTypeRepository.findOne({
      where: { title: dto.type },
    });
    if (!type) {
      throw new HttpException('Тип продукта не найден', HttpStatus.NOT_FOUND);
    }
    const imgName = await this.fileService.createFile(img);
    if (type.title === 'pizza') {
      const pizzaImg = { imgThin: imgName[0], imgThick: imgName[1] };
      const pizza = await this.productRepository.create({
        title: dto.title,
        img: pizzaImg,
        description: dto.description,
        price: dto.price,
        weight: dto.weight,
        sells_month: 0,
        sells_overall: 0,
        productType: type,
      });
      console.log(pizza);
      this.productRepository.save(pizza);
      return pizza;
    } else {
      const productImg = { img: imgName[0] };
      const product = await this.productRepository.create({
        title: dto.title,
        img: productImg,
        description: dto.description,
        price: dto.price,
        weight: dto.weight,
        sells_month: 0,
        sells_overall: 0,
        productType: type,
      });
      console.log(product);
      this.productRepository.save(product);
      return product;
    }
  }

  getOrder(orderBy) {
    if (!orderBy) {
      throw new HttpException('Неверная сортировка', HttpStatus.BAD_REQUEST);
    }
    switch (orderBy) {
      case 'ratingDesc':
        return { order: 'sells_month', direction: 'DESC' };
      case 'ratingAsc':
        return { order: 'sells_month', direction: 'ASC' };
      case 'priceDesc':
        return { order: `price`, direction: 'DESC' };
      case 'priceAsc':
        return { order: `price`, direction: 'ASC' };
      case 'titleDesc':
        return { order: 'title', direction: 'DESC' };
      case 'titleAsc':
        return { order: 'title', direction: 'ASC' };
      default:
        return { order: 'sells_month', direction: 'DESC' };
    }
  }

  async getAll(query) {
    let { orderBy, category, search } = query;
    let { page, limit } = query;
    category = category || 'drinks';
    orderBy = orderBy || 'ratingDesc';
    search = search || '';
    page = page || 1;
    limit = limit || 3;
    const offset = page * limit - limit;
    const order = this.getOrder(orderBy) as Order;

    const product = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productType', 'productType')
      .where({ title: ILike(`%${search}%`) })
      .andWhere('productType.title = :pType', { pType: `${category}` })
      .limit(limit)
      .offset(offset)
      .orderBy(`product.${order.order}`, order.direction)
      .getManyAndCount();
    return product;
  }

  async getById(query) {
    const { id } = query;
    const product = await this.productRepository.findOneBy(id);
    return product;
  }

  async createProductType(dto: CreateProductTypeDto) {
    const type = new ProductType();
    Object.assign(type, dto);
    await this.productTypeRepository.save(type);
  }
}
