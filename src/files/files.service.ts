import { imgPizza, imgProduct } from './../products/products.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(img) {
    try {
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdir(filePath, { recursive: true }, (err) => {
          console.error(err);
        });
      }
      const namesArr: string[] = [];

      img.map((item) => {
        const fileName = uuid.v4() + '.jpg';
        fs.writeFileSync(path.join(filePath, fileName), item.buffer);
        namesArr.push(fileName);
      });

      return namesArr;
    } catch (error) {
      throw new HttpException(
        'Ошибка записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
