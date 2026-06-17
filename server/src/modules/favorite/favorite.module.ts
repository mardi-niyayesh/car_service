import {Module} from "@nestjs/common";
import {FavoriteController} from "./favorite.controller";

@Module({
  controllers: [FavoriteController],
})
export class FavoriteModule {}