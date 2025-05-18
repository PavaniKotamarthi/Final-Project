import React from 'react';
import { FaThumbsUp, FaThumbtack, FaTrash, FaCommentDots } from 'react-icons/fa';

interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  pinned: boolean;
  isAdmin: boolean;
  onLike: () => void;
  onPin: () => void;
  onDelete: () => void;
  onToggleComments: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  likesCount,
  commentsCount,
  pinned,
  isAdmin,
  onLike,
  onPin,
  onDelete,
  onToggleComments
}) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete();
    }
  };

  return (
    <div className="flex gap-4 mt-3 text-sm items-center text-gray-600 relative">
      <button className="flex items-center gap-1 hover:text-blue-500" onClick={onLike}>
        <FaThumbsUp /> {likesCount} Likes
      </button>
      <button className="flex items-center gap-1 hover:text-blue-500" onClick={onToggleComments}>
        <FaCommentDots /> {commentsCount} Comments
      </button>
      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-3 text-gray-500">
          <FaThumbtack
            className={`cursor-pointer ${pinned ? 'text-red-500' : 'hover:text-gray-700'}`}
            title="Pin Post"
            onClick={onPin}
          />
          <FaTrash
            className="cursor-pointer hover:text-red-600"
            title="Delete Post"
            onClick={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default PostActions;
