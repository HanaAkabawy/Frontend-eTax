import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ q: '', sort: 'newest' });

  const loadPosts = () => {
    axios.get(`http://127.0.0.1:8000/api/posts?q=${filters.q}&sort=${filters.sort}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => setPosts(res.data.data)).catch(console.error);
  };

  useEffect(() => {
    loadPosts();
  }, [filters]);

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-7 text-center">All Posts</h2>

        <div className="mx-auto w-full max-w-3xl mb-6">
          <input
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none"
            placeholder="Search for a post..."
            value={filters.q}
            onChange={e => setFilters({ ...filters, q: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-8">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transition hover:shadow-2xl mx-auto w-full max-w-3xl"
            >
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
                <Link
                  to={`/user/post/${post.id}`}
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
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
          ))}
        </div>
      </div>
    </div>
  );
}
