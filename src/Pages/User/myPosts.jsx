import { useEffect, useState } from "react";
import Button from "../../Components/Ui/Button/Button";
import { ThumbsUp, ThumbsDown, MessageCircle, Send } from "lucide-react";
import apiRequest from "../../Services/ApiRequest";
import Swal from "sweetalert2";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({}); // Only for input fields
  const [editingComments, setEditingComments] = useState({}); 


  useEffect(() => {
    fetchPosts();
  }, []);

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      icon,
      title,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const fetchPosts = async () => {
    try {
      const res = await apiRequest("GET", "/posts/mine");

      const postsData = await Promise.all(
        res.data.map(async (post) => {
          const reactions = await getReactions("post", post.id);
          const comments = await fetchComments(post.id);
          return { ...post, reactions, comments };
        })
      );

      setPosts(postsData);
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to load posts");
    }
  };

  const getReactions = async (type, id) => {
    try {
      const res = await apiRequest("GET", "/reaction", {}, {
        params: {
          reactionable_type: type,
          reactionable_id: id
        }
      });
      return res; // { likes, dislikes, total }
    } catch (error) {
      return { likes: 0, dislikes: 0, total: 0 };
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await apiRequest("GET", `/posts/${postId}/comments`);
      const commentsData = await Promise.all(
        res.map(async (comment) => {
          const reactions = await getReactions("comment", comment.id);
          return { ...comment, reactions };
        })
      );
      return commentsData;
    } catch (error) {
      return [];
    }
  };

const handleReact = async (type, reactionable_type, reactionable_id) => {
  try {
    await apiRequest("POST", "/reaction", {
      type,
      reactionable_type,
      reactionable_id,
    });

    showToast("success", `${type === "like" ? "Liked" : "Disliked"} successfully`);

    if (reactionable_type === "post") {
      // ✅ Re-fetch reactions for the post
      const updatedReactions = await getReactions("post", reactionable_id);

      setPosts(prev =>
        prev.map(post =>
          post.id === reactionable_id ? { ...post, reactions: updatedReactions } : post
        )
      );
    } else {
      // ✅ Re-fetch reactions for the comment
      const updatedReactions = await getReactions("comment", reactionable_id);

      setPosts(prev =>
        prev.map(post => ({
          ...post,
          comments: post.comments.map(comment =>
            comment.id === reactionable_id
              ? { ...comment, reactions: updatedReactions }
              : comment
          ),
        }))
      );
    }
  } catch (error) {
    showToast("error", "Failed to react");
  }
};



  const handleAddComment = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      await apiRequest("POST", `/posts/${postId}/comments`, { content });

      showToast("success", "Comment added");

      // ✅ Fetch updated comments for this post
      const updatedComments = await fetchComments(postId);
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, comments: updatedComments }
            : post
        )
      );

      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (error) {
      showToast("error", "Failed to add comment");
    }
  };
  const handleDeleteComment = async (postId, commentId) => {
  try {
    await apiRequest("DELETE", `/posts/${postId}/comments/${commentId}`);

    showToast("success", "Comment deleted");

    // Remove comment from local state
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments.filter(c => c.id !== commentId) }
          : post
      )
    );
  } catch (error) {
    showToast("error", "Failed to delete comment");
  }
};
const handleUpdateComment = async (postId, commentId) => {
  const newContent = editingComments[commentId]?.trim();
  if (!newContent) return;

  try {
    await apiRequest("PUT", `/posts/${postId}/comments/${commentId}`, { content: newContent });

    showToast("success", "Comment updated");

    // ✅ Re-fetch updated comments
    const updatedComments = await fetchComments(postId);
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, comments: updatedComments } : post
      )
    );

    setEditingComments(prev => {
      const { [commentId]: _, ...rest } = prev;
      return rest;
    });
  } catch (error) {
    showToast("error", "Failed to update comment");
  }
};



  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 px-4">My Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-600 px-4">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md mb-6 p-5">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold text-lg">
                    {post.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.user?.name || "You"}</p>
                    <p className="text-sm text-gray-500">Posted just now</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-3">{post.description}</p>

              {/* Attachments */}
              {post.attachments?.length > 0 && (
                <div className="mb-3">
                  {post.attachments.map((att, i) => (
                    <div key={i}>
                      {att.path && /\.(jpg|jpeg|png|gif)$/i.test(att.path) && (
                        <img
                          src={att.path}
                          alt="Attachment"
                          className="max-w-xs rounded shadow mb-2"
                          style={{ maxHeight: 200 }}
                        />
                      )}
                      <a
                        href={att.path || att}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        📎 View Attachment
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Reactions */}
              <div className="flex items-center space-x-3 mt-4 border-t pt-3">
                <Button
                  size="icon"
                  variant="outline"
                  leftIcon={<ThumbsUp className="w-5 h-5" />}
                  onClick={() => handleReact("like", "post", post.id)}
                />
                <span>{post.reactions?.likes || 0}</span>

                <Button
                  size="icon"
                  variant="outline"
                  leftIcon={<ThumbsDown className="w-5 h-5" />}
                  onClick={() => handleReact("dislike", "post", post.id)}
                />
                <span>{post.reactions?.dislikes || 0}</span>

                <Button
                  size="icon"
                  variant="outline"
                  leftIcon={<MessageCircle className="w-5 h-5" />}
                />
                <span>{post.comments?.length || 0}</span>
              </div>

              {/* Comment Input */}
              <div className="flex items-center mt-3 space-x-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                  }
                />
                <Button
                  size="icon"
                  variant="primary"
                  leftIcon={<Send className="w-4 h-4" />}
                  onClick={() => handleAddComment(post.id)}
                />
              </div>

              {/* Comments */}
              {post.comments?.length > 0 && (
                <div className="mt-4 space-y-3">
              {post.comments.map((comment) => (
  <div key={comment.id} className="border-t pt-2">
    <p className="text-gray-800 font-medium">{comment.user.name}</p>

    {editingComments[comment.id] !== undefined ? (
      <div className="flex items-center space-x-2 mt-1">
        <input
          type="text"
          value={editingComments[comment.id]}
          onChange={(e) =>
            setEditingComments({ ...editingComments, [comment.id]: e.target.value })
          }
          className="border rounded px-2 py-1 text-sm flex-1"
        />
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleUpdateComment(post.id, comment.id)}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const { [comment.id]: _, ...rest } = editingComments;
            setEditingComments(rest);
          }}
        >
          Cancel
        </Button>
      </div>
    ) : (
      <>
        <p className="text-gray-700">{comment.content}</p>
        <div className="flex items-center space-x-2 mt-1">
          <Button
            size="icon"
            variant="outline"
            leftIcon={<ThumbsUp className="w-4 h-4" />}
            onClick={() => handleReact("like", "comment", comment.id)}
          />
          <span>{comment.reactions?.likes || 0}</span>

          <Button
            size="icon"
            variant="outline"
            leftIcon={<ThumbsDown className="w-4 h-4" />}
            onClick={() => handleReact("dislike", "comment", comment.id)}
          />
          <span>{comment.reactions?.dislikes || 0}</span>

          {/* Edit & Delete Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setEditingComments({ ...editingComments, [comment.id]: comment.content })
            }
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteComment(post.id, comment.id)}
          >
            Delete
          </Button>
        </div>
      </>
    )}
  </div>
))}

                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
