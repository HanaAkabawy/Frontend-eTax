import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import apiRequest from "../../Services/ApiRequest";
import Button from "../../Components/Ui/Button/Button";

export default function UserPosts() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await apiRequest("GET", `/posts/${id}`, {}, {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });

      const postData = res.data;
      const reactions = await getReactions("post", postData.id);
      const comments = await fetchComments(postData.id);

      setPost({ ...postData, reactions, comments });
    } catch (error) {
      console.error(error);
    }
  };

  const getReactions = async (type, id) => {
    try {
      const res = await apiRequest("GET", "/reaction", {}, {
        params: { reactionable_type: type, reactionable_id: id },
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });
      return res;
    } catch {
      return { likes: 0, dislikes: 0, total: 0 };
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await apiRequest("GET", `/posts/${postId}/comments`, {}, {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });

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
    // Optimistic UI
    setPost((prev) => {
      if (!prev) return prev;

      if (reactionable_type === "post") {
        return {
          ...prev,
          reactions: {
            ...prev.reactions,
            likes: type === "like" ? prev.reactions.likes + 1 : prev.reactions.likes,
            dislikes: type === "dislike" ? prev.reactions.dislikes + 1 : prev.reactions.dislikes,
          },
        };
      }

      const updatedComments = prev.comments.map((comment) =>
        comment.id === reactionable_id
          ? {
              ...comment,
              reactions: {
                ...comment.reactions,
                likes: type === "like" ? comment.reactions.likes + 1 : comment.reactions.likes,
                dislikes: type === "dislike" ? comment.reactions.dislikes + 1 : comment.reactions.dislikes,
              },
            }
          : comment
      );

      return { ...prev, comments: updatedComments };
    });

    // Send to API
    try {
      await apiRequest("POST", "/reaction", { type, reactionable_type, reactionable_id }, {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!post) return <p className="p-6">Loading post...</p>;

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-6 max-w-3xl">
        <h2 className="text-3xl font-bold mb-7 text-center">
          {post.user ? `${post.user.name}'s Post` : "User Post"}
        </h2>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transition hover:shadow-2xl">
          {/* Image Preview */}
          {post.attachments?.length > 0 && post.attachments[0].path && /\.(jpg|jpeg|png|gif)$/i.test(post.attachments[0].path) && (
            <img
              src={`${post.attachments[0].path}`}
              alt="Attachment"
              className="w-full h-56 object-cover"
            />
          )}

          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-3">{post.description}</p>

            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-500 mr-2">
                <strong>By:</strong> {post.author ? post.author.name : "Unknown"}
              </span>
              <span className="text-xs text-gray-400">
                • <strong>Created at:</strong> {post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
              </span>
            </div>

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

            {/* Reactions */}
            <div className="flex items-center gap-4 mt-4 border-t pt-3">
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
                onClick={() => setShowComments(!showComments)}
              />
              <span>{post.comments?.length || 0}</span>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 space-y-4">
                {post.comments?.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-3">
                      <p className="font-semibold">{comment.user.name}</p>
                      <p className="text-gray-700">{comment.content}</p>
                      <div className="flex items-center gap-2 mt-2">
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
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
