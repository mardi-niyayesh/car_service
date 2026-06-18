import {Injectable} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_id: string, car_id: string) {
    const favorite = await this.prisma.favorite.create({
      data: {
        user_id,
        car_id
      }
    });

    console.log(favorite);

    return "favorite create service.";
  }
}
