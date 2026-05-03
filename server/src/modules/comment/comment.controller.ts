import {Controller} from "@nestjs/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

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
export class CommentController {}