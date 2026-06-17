import {Controller, Get} from "@nestjs/common";

@Controller("favorites")
export class FavoriteController {
  @Get()
  get(): string {
    return "get favorites successfully.";
  }
}
