import {Injectable} from "@nestjs/common";

@Injectable()
export class PermissionsService {
  findAll(): string {
    return 'test all permissions';
  }
}