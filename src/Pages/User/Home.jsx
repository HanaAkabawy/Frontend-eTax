import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../Components/Ui/Button/Button";
import { ThumbsUp, ThumbsDown, MessageCircle, Send } from "lucide-react";
import apiRequest from "../../Services/ApiRequest";
import Swal from "sweetalert2";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ q: "", sort: "newest" });
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
        `/posts?q=${filters.q}&sort=${filters.sort}`,
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

    // Fetch updated reactions for this item only
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Posts</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          className="border border-gray-300 rounded px-4 py-2 w-full"
          placeholder="Search..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <select
          className="border border-gray-300 rounded px-4 py-2"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="newest">Newest</option>
          <option value="liked">Most Liked</option>
        </select>
      </div>

      {/* Posts */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded p-5">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="mt-2 text-gray-700">{post.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              <strong>By:</strong> {post.user ? post.user.name : "Unknown"}
            </p>

            {/* Attachments */}
            {post.attachments?.map((att, i) => (
              <div key={i} className="mt-2">
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
                  className="text-blue-500 block"
                >
                  📎 View Attachment
                </a>
              </div>
            ))}

            {/* Reactions */}
            <div className="flex items-center space-x-3 mt-3">
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
        ))}
      </div>
    </div>
  );
}