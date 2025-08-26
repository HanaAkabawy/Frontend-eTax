import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../Components/Ui/Button/Button";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import apiRequest from "../../Services/ApiRequest";

export default function UserPosts() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await apiRequest(
        "GET",
        `/posts/${id}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

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
      const res = await apiRequest(
        "GET",
        "/reaction",
        {},
        {
          params: { reactionable_type: type, reactionable_id: id },
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      );
      return res; // { likes, dislikes, total }
    } catch (error) {
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
    } catch (error) {
      return [];
    }
  };

  const handleReact = async (type, reactionable_type, reactionable_id) => {
    // ✅ Optimistic UI update for post or comment
    setPost((prev) => {
      if (!prev) return prev;

      if (reactionable_type === "post") {
        const updatedReactions = {
          ...prev.reactions,
          likes:
            type === "like" ? prev.reactions.likes + 1 : prev.reactions.likes,
          dislikes:
            type === "dislike"
              ? prev.reactions.dislikes + 1
              : prev.reactions.dislikes,
        };

        return { ...prev, reactions: updatedReactions };
      }

      // ✅ For comments
      const updatedComments = prev.comments.map((comment) => {
        if (comment.id === reactionable_id) {
          const updatedReactions = {
            ...comment.reactions,
            likes:
              type === "like"
                ? comment.reactions.likes + 1
                : comment.reactions.likes,
            dislikes:
              type === "dislike"
                ? comment.reactions.dislikes + 1
                : comment.reactions.dislikes,
          };
          return { ...comment, reactions: updatedReactions };
        }
        return comment;
      });

      return { ...prev, comments: updatedComments };
    });

    // ✅ Send reaction to API
    try {
      await apiRequest(
        "POST",
        "/reaction",
        { type, reactionable_type, reactionable_id },
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

      // ✅ Re-fetch reactions from API to ensure correct values (optional)
      if (reactionable_type === "post") {
        const updatedReactions = await getReactions("post", reactionable_id);
        setPost((prev) => ({ ...prev, reactions: updatedReactions }));
      } else {
        const updatedComments = await Promise.all(
          post.comments.map(async (comment) => {
            if (comment.id === reactionable_id) {
              const newReactions = await getReactions("comment", comment.id);
              return { ...comment, reactions: newReactions };
            }
            return comment;
          })
        );
        setPost((prev) => ({ ...prev, comments: updatedComments }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!post) return <p className="p-6">Loading post...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {post.user ? `${post.user.name}'s Post` : "User Post"}
      </h2>

      <div className="bg-white shadow-md rounded p-5">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        <p className="mt-2 text-gray-700">{post.description}</p>

        {post.attachments?.map((att, i) => (
          <div key={i} className="mt-2">
            {att.path && /\.(jpg|jpeg|png|gif)$/i.test(att.path) && (
              <img
                src={`${att.path}`}
                alt="Attachment"
                className="max-w-xs rounded shadow mb-2"
                style={{ maxHeight: 200 }}
              />
            )}
            <a
              href={`${att.path || att}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 block"
            >
              📎 View Attachment
            </a>
          </div>
        ))}

        {/* Post Reactions */}
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

          <Button
            size="icon"
            variant="outline"
            leftIcon={<MessageCircle className="w-5 h-5" />}
            onClick={() => {}}
          />
          <span>{post.comments?.length || 0}</span>
        </div>

        {/* Latest Comments */}
        {post.comments?.length > 0 && (
          <div className="mt-4 space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border-t pt-2">
                <p className="text-gray-800 font-medium">{comment.user.name}</p>
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
                    onClick={() =>
                      handleReact("dislike", "comment", comment.id)
                    }
                  />
                  <span>{comment.reactions?.dislikes || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
