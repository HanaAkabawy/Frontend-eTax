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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Posts</h2>

      <div className="flex gap-4 mb-6">
        <input
          className="border border-gray-300 rounded px-4 py-2 w-full"
          placeholder="Search..."
          value={filters.q}
          onChange={e => setFilters({ ...filters, q: e.target.value })}
        />
        <select
          className="border border-gray-300 rounded px-4 py-2"
          onChange={e => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="newest">Newest</option>
          <option value="liked">Most Liked</option>
        </select>
      </div>

      <div className="grid gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow-md rounded p-5">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="mt-2 text-gray-700">{post.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              <strong>By:</strong> {post.user ? post.user.name : "Unknown"}
            </p>
            {post.attachments?.map((att, i) => (
              <div key={i} className="mt-2">
                {/* Show image preview if the file is an image */}
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
            <Link
              to={`/user/post/${post.id}`}
              className="text-indigo-600 hover:underline mt-3 inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
