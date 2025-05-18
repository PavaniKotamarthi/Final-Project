import React from 'react';

interface Comment {
  _id: string;
  text: string;
  author: string;
  username: string;
  likes: string[];
  replies: Reply[];
}

interface Reply {
  _id: string;
  text: string;
  author: string;
  username: string;
  likes: string[];
}

interface PostCommentsProps {
  postId: string;
  comments: Comment[];
  commentInputs: Record<string, string>;
  replyInputs: Record<string, string>;
  setCommentInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setReplyInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleAddComment: (postId: string) => void;
  handleReplyComment: (postId: string, commentId: string) => void;
  handleLikeComment: (postId: string, commentId: string) => void;
  handleLikeReply: (postId: string, commentId: string, replyId: string) => void;
}

const PostComments: React.FC<PostCommentsProps> = ({
  postId, comments, commentInputs, replyInputs,
  setCommentInputs, setReplyInputs,
  handleAddComment, handleReplyComment,
  handleLikeComment, handleLikeReply
}) => (
  <div className="mt-3">
    <input
      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Write your comment here... Press ENTER to submit"
      value={commentInputs[postId] || ''}
      onChange={(e) => setCommentInputs({ ...commentInputs, [postId]: e.target.value })}
      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(postId)}
    />

    {comments.map((cmt) => (
      <div key={cmt._id} className="mt-3 flex items-start gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="bg-gray-100 px-3 py-2 rounded-lg w-full">
          <div className="text-sm font-semibold text-gray-800">{cmt.username}</div>
          <div className="text-sm text-gray-700 mt-1">{cmt.text}</div>
          <div className="flex gap-4 text-xs text-gray-500 mt-1">
            <button onClick={() => handleLikeComment(postId, cmt._id)}>Like ({cmt.likes.length})</button>
            <button onClick={() => setReplyInputs({ ...replyInputs, [cmt._id]: replyInputs[cmt._id] || '' })}>Reply</button>
          </div>

          {replyInputs[cmt._id] !== undefined && (
            <input
              className="border rounded px-2 py-1 mt-2 w-full text-sm"
              placeholder="Write a reply..."
              value={replyInputs[cmt._id] || ''}
              onChange={(e) => setReplyInputs({ ...replyInputs, [cmt._id]: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleReplyComment(postId, cmt._id)}
            />
          )}

          {cmt.replies.map((reply) => (
            <div key={reply._id} className="mt-3 ml-6 flex items-start gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full" />
              <div className="bg-gray-50 px-3 py-2 rounded-lg w-full">
                <div className="text-xs font-semibold text-gray-800">{reply.username}</div>
                <div className="text-xs text-gray-700 mt-1">{reply.text}</div>
                <button
                  className="text-xs text-gray-500 mt-1"
                  onClick={() => handleLikeReply(postId, cmt._id, reply._id)}
                >
                  Like ({reply.likes.length})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default PostComments;
