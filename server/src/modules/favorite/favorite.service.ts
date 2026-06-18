import {Injectable} from "@nestjs/common";

@Injectable()
export class FavoriteService {
  create(user_id: string, car_id: string): string {
    return "favorite create service.";
  }
}
