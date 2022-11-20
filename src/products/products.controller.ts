import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { CreateProductTypeDto } from './product_type/dto/productType.dto';

@Controller('/products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post('/createProduct')
  @UseInterceptors(FilesInterceptor('img', 2))
  createProduct(@Body() dto: CreateProductDto, @UploadedFiles() img) {
    return this.productService.createProduct(dto, img);
  }

  @Post('/createType')
  createType(@Body() dto: CreateProductTypeDto) {
    return this.productService.createProductType(dto);
  }

  @Get('/getProducts')
  getProducts(@Query() query) {
    return this.productService.getAll(query);
  }

  @Get('/productById')
  getProduct(@Query() query) {
    return this.productService.getById(query);
  }
}
