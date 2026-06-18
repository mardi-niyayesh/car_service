import {Module} from "@nestjs/common";
import {FavoriteService} from "./favorite.service";
import {FavoriteController} from "./favorite.controller";

@Module({
  providers: [FavoriteService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}