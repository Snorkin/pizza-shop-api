import { Product } from './products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductType } from './product_type/productType.entity';
import { FilesModule } from '@app/files/files.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, ProductType]), FilesModule],
})
export class ProductsModule {}
