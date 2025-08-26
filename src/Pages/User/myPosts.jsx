import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/posts/mine', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => setPosts(res.data.data)).catch(console.error);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 px-4">My Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-600 px-4">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md mb-6 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold text-lg">
                    {post.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.user?.name || "You"}</p>
                    <p className="text-sm text-gray-500">Posted just now</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-3">{post.description}</p>

              {post.attachments?.length > 0 && (
                <div className="mb-3">
                  {post.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={`${att}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      📎 View Attachment
                    </a>
                  ))}
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-600 mt-4 border-t pt-3">
                <div className="flex items-center space-x-2">
                  <span>👍</span>
                  <span>12 Likes</span> {/* Placeholder static number */}
                </div>
                <div className="flex items-center space-x-2">
                  <span>💬</span>
                  <span>3 Comments</span> {/* Placeholder static number */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
