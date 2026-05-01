import {Module} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {CommentController} from "./comment.controller";

@Module({
  exports: [CommentService],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}