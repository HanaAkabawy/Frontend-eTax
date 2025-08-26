import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UserPosts() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      setPost(res.data.data); // single post object
    })
    .catch(console.error);
  }, [id]);

  if (!post) return <p className="p-6">Loading post...</p>;

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-6 max-w-3xl">
        <h2 className="text-3xl font-bold mb-7 text-center">
          {post.user ? `${post.user.name}'s Post` : 'User Post'}
        </h2>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transition hover:shadow-2xl mx-auto w-full max-w-3xl">
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
                href={`${att.path || att}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center mb-2"
              >
                <span className="mr-1">📎</span> View Attachment
              </a>
            ))}
            <div className="flex justify-between text-sm text-gray-600 mt-4 border-t pt-3">
              <div className="flex items-center space-x-2">
                <span>👍</span>
                <span>12 Likes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💬</span>
                <span>3 Comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}