import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageCircle, Send } from "lucide-react";
import Swal from "sweetalert2";
import apiRequest from "../../Services/ApiRequest";
import Button from "../../Components/Ui/Button/Button";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ q: "" });
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComments, setEditingComments] = useState({});

  useEffect(() => {
    loadPosts();
  }, [filters]);

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

  const loadPosts = async () => {
    try {
      const res = await apiRequest(
        "GET",
        `/posts?q=${filters.q}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

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
      const res = await apiRequest(
        "GET",
        "/reaction",
        {},
        {
          params: { reactionable_type: type, reactionable_id: id },
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      );
      return res;
    } catch {
      return { likes: 0, dislikes: 0, total: 0 };
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await apiRequest(
        "GET",
        `/posts/${postId}/comments`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

      const commentsData = await Promise.all(
        res.map(async (comment) => {
          const reactions = await getReactions("comment", comment.id);
          return { ...comment, reactions };
        })
      );
      return commentsData;
    } catch {
      return [];
    }
  };

  const handleReact = async (type, reactionable_type, reactionable_id) => {
    try {
      await apiRequest(
        "POST",
        "/reaction",
        { type, reactionable_type, reactionable_id },
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

      const updatedReactions = await getReactions(reactionable_type, reactionable_id);

      setPosts((prev) =>
        prev.map((post) => {
          if (reactionable_type === "post" && post.id === reactionable_id) {
            return { ...post, reactions: updatedReactions };
          }

          if (reactionable_type === "comment") {
            return {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === reactionable_id
                  ? { ...comment, reactions: updatedReactions }
                  : comment
              ),
            };
          }

          return post;
        })
      );

      showToast("success", `${type === "like" ? "Liked" : "Disliked"} successfully`);
    } catch {
      showToast("error", "Failed to react");
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      await apiRequest(
        "POST",
        `/posts/${postId}/comments`,
        { content },
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

      showToast("success", "Comment added");
      const updatedComments = await fetchComments(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments: updatedComments } : p))
      );
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch {
      showToast("error", "Failed to add comment");
    }
  };

  const handleUpdateComment = async (postId, commentId) => {
    const newContent = editingComments[commentId]?.trim();
    if (!newContent) return;

    try {
      await apiRequest(
        "PUT",
        `/posts/${postId}/comments/${commentId}`,
        { content: newContent },
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

      showToast("success", "Comment updated");
      const updatedComments = await fetchComments(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments: updatedComments } : p))
      );
      setEditingComments((prev) => {
        const { [commentId]: _, ...rest } = prev;
        return rest;
      });
    } catch {
      showToast("error", "Failed to update comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await apiRequest(
        "DELETE",
        `/posts/${postId}/comments/${commentId}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

      showToast("success", "Comment deleted");
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p
        )
      );
    } catch {
      showToast("error", "Failed to delete comment");
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-7 text-center">All Posts</h2>

        {/* Search Bar Only */}
        <div className="mx-auto w-full max-w-3xl mb-6">
          <input
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none"
            placeholder="Search for a post..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transition hover:shadow-2xl mx-auto w-full max-w-3xl"
            >
              {/* Image Preview */}
              {post.attachments?.length > 0 &&
                post.attachments[0].path &&
                /\.(jpg|jpeg|png|gif)$/i.test(post.attachments[0].path) && (
                  <img
                    src={`${post.attachments[0].path}`}
                    alt="Attachment"
                    className="w-full h-56 object-cover"
                  />
                )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-3">{post.description}</p>
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <span className="mr-2">
                    <strong>By:</strong> {post.user ? post.user.name : "Unknown"}
                  </span>
                  <span>
                    • <strong>Created at:</strong>{" "}
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
                  </span>
                </div>

                {/* Attachments */}
                {post.attachments?.map((att, i) => (
                  <a
                    key={i}
                    href={`${att.path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center mb-2"
                  >
                    <span className="mr-1">📎</span> View Attachment
                  </a>
                ))}

                {/* View Details Button */}
                <Link
                  to={`/user/post/${post.id}`}
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  View Details
                </Link>

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

                  <Button size="icon" variant="outline" leftIcon={<MessageCircle className="w-5 h-5" />} />
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
