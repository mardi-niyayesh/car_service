import {Module} from "@nestjs/common";
import {RedisModule} from "@/modules";
import {CommentService} from "./comment.service";
import {CommentController} from "./comment.controller";

@Module({
  imports: [RedisModule],
  exports: [CommentService],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}