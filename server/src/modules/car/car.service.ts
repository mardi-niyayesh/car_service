import {Injectable} from '@nestjs/common';

@Injectable()
export class CarService {
  create() {
    return 'create test';
  }
}