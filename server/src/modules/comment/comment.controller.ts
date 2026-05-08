import * as CommentDto from "./dto";
import {UUIDv4Validator, ZodPipe} from "@/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {CommentService} from "@/modules/comment/comment.service";
import * as CommentDecorator from "./decorators/comment.decorator";
import {Body, Controller, Param, Patch, Post, Req} from "@nestjs/common";
import type {AccessRequest, ApiResponse, CreateCommentResponse} from "@/types";

/**
 * Comment management endpoints for car reviews and feedback.
 *
 * This controller handles:
 * - Adding a new comment for a specific car (authenticated users only)
 * - Replying to existing comments (nested comments support)
 * - Fetching all comments for a car with proper pagination
 * - Fetching a single comment by ID with its replies
 * - Updating user's own comment (content only, within time limit)
 * - Deleting user's own comment (soft delete or full delete based on permissions)
 * - Admin operations: confirming (approving) comments with `comment.confirm` permission
 * - Admin operations: rejecting (hiding) comments with `comment.reject` permission
 * - Admin operations: viewing pending/unconfirmed comments list
 *
 * Security rules:
 * - All endpoints require authentication (Bearer token)
 * - Regular users can only create, edit, or delete their own comments
 * - Admin roles (`comment_manager` or `owner.all`) can confirm/reject any comment
 * - Nested replies inherit the same permissions as parent comments
 * - Rate limiting applies to prevent comment spam
 *
 * Permission-based access:
 * - `user.self`: Manage own comments (create, edit, delete)
 * - `comment.confirm`: Approve pending comments (admin)
 * - `comment.reject`: Reject or hide inappropriate comments (admin)
 * - `owner.all`: Full access to all comment operations
 *
 * Data validation:
 * - Content length: min 2, max 500 characters
 * - Rating (rate): integer between 1 and 5
 * - Car ID must be a valid UUID from existing car
 * - Parent comment ID (if replying) must exist and belong to same car
 *
 * Additional features:
 * - Comments are marked `is_confirmed = false` by default until admin approval (if configured)
 * - Soft delete: comments are marked as deleted but remain in database for audit
 *
 * @see CommentService for business logic implementation
 * @module CommentController
 * @version 1.0
 */
@ApiTags("Comments")
@Controller('comments')
@ApiBearerAuth("accessToken")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * Creates a new comment or reply on a car review.
   *
   * @param req - Authenticated user (requires `user.self` permission)
   * @param data - Validated comment data
   * @returns Confirmation message
   *
   * @requestBody
   * - `content`: string, 2-500 chars
   * - `rate`: number 1-5, optional, defaults to 5
   * - `car_id`: valid UUID of target car
   * - `parent_id`: UUID or null, optional, defaults to null (top-level comment)
   *
   * @permission `user.self`
   *
   * @example
   * POST /comments
   * { "content": "Great car!", "rate": 5, "car_id": "550e...", "parent_id": null }
   */
  @Post()
  @CommentDecorator.CreateCommentDecorator()
  create(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(CommentDto.CreateCommentValidator)) data: CommentDto.CreateCommentType
  ): Promise<ApiResponse<CreateCommentResponse>> {
    return this.commentService.create(req.user.userId, data);
  }

  /**
   * Confirms (approves) a pending comment by admin.
   *
   * @permission `comment.confirm`
   * @param id - Valid UUID of the comment to confirm
   * @returns Success message after confirmation
   *
   * @example
   * PATCH /comments/550e8400-e29b-41d4-a716-446655440000/confirm
   */
  @Patch(':id/confirm')
  @CommentDecorator.ConfirmCommentDecorator()
  confirm(
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string,
  ) {
    console.log(id);
    return 'confirmed';
  }
}