import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/products.entity';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.entity';
import { ProductType } from './products/product_type/productType.entity';
import { AuthModule } from './auth/auth.module';
import { OrderContent } from './order/orderContent/orderContent.entity';
import { Order } from './order/order.entity';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: [User, Product, ProductType, OrderContent, Order],
      synchronize: true,
    }),
    UsersModule,
    OrderModule,
    ProductsModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
