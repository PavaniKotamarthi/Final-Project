import React, { useState, useEffect } from 'react';
import { FaThumbtack, FaTrash, FaCommentDots, FaEdit } from 'react-icons/fa';
import ReactQuill from 'react-quill';

interface Reaction {
  type: ReactionType;
  email: string;
}

type ReactionType = 'like' | 'love' | 'laugh' | 'wow';

interface ReactionCounts {
  like: number;
  love: number;
  laugh: number;
  wow: number;
}

interface PostActionsProps {
  postId: string;
  reactions: Reaction[];
  reactionCounts: {
    like: number,
    love: number,
    laugh: number,
    wow: number
  };
  content: string;
  userEmail: string;
  commentsCount: number;
  pinned: boolean;
  isAdmin: boolean;
  onReact: (reaction: ReactionType) => void;
  onPin: () => void;
  onDelete: () => void;
  onToggleComments: () => void;
  onEdit: () => void;
}

const reactionOptions = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'laugh', emoji: '😂' },
  { type: 'wow', emoji: '😮' },
];

const PostActions: React.FC<PostActionsProps> = ({
  reactions,
  reactionCounts,
  userEmail,
  content,
  commentsCount,
  pinned,
  isAdmin,
  onReact,
  onPin,
  onDelete,
  onToggleComments,
  onEdit,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  // Set initial user reaction from reactions list
  useEffect(() => {
    const reaction = reactions.find((r) => r.email === userEmail);
    setUserReaction(reaction ? reaction.type : null);
  }, [reactions, userEmail]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete();
    }
  };

  const handleReactionClick = (reaction: ReactionType) => {
    setShowReactions(false);
    onReact(reaction);
    setUserReaction(reaction);
  };

  const selectedEmoji = reactionOptions.find((r) => r.type === userReaction)?.emoji;

  return (
    <div>
      <div className="flex gap-4 mt-3 text-sm items-center text-gray-600 relative">
        {/* Reactions Button */}
        <div>
          <button
            className="flex items-center gap-1 hover:text-blue-500"
            onClick={() => setShowReactions((prev) => !prev)}
          >
            {selectedEmoji || '👍'}{' '}
            {userReaction && reactionCounts ? reactionCounts[userReaction] || 0 : 0}
          </button>

          {showReactions && (
            <div className="absolute bottom-full mb-0 left-0 bg-white border rounded shadow-md p-2 flex gap-2 z-50">
              {reactionOptions.map((r) => (
                <span
                  key={r.type}
                  onClick={() => handleReactionClick(r.type as ReactionType)}
                  title={r.type}
                  className="cursor-pointer text-lg hover:scale-125 transition"
                >
                  {r.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        <button className="flex items-center gap-1 hover:text-blue-500" onClick={onToggleComments}>
          <FaCommentDots /> {commentsCount} Comments
        </button>


      </div>
      {/* Admin Icons */}
      {isAdmin && (
        <div className="absolute top-10 right-3 flex gap-3 text-gray-500">
          <FaEdit
            className="cursor-pointer hover:text-blue-600"
            title="Edit Post"
            onClick={() => onEdit?.()}
          />
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
