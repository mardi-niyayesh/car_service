import { type allComment } from "./CommentOneProduct";

export type CommentWithReplies = allComment & { replies: CommentWithReplies[] };

export const buildCommentTree = (
  comments: allComment[],
): CommentWithReplies[] => {
  const map = new Map<string, CommentWithReplies>();
  const roots: CommentWithReplies[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const node = map.get(comment.id)!;
    if (comment.parent_id && map.has(comment.parent_id)) {
      map.get(comment.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};
