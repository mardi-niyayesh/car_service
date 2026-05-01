import {Module} from "@nestjs/common";
import {CommentController} from "./comment.controller";

@Module({
  exports: [],
  providers: [],
  controllers: [CommentController],
})
export class CommentModule {}