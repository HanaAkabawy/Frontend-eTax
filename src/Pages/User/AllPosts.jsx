import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AllPosts() {
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
    <div className="container">
      <h2>All Posts</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input placeholder="Search..." value={filters.q} onChange={e => setFilters({ ...filters, q: e.target.value })} />
        <select onChange={e => setFilters({ ...filters, sort: e.target.value })}>
          <option value="newest">Newest</option>
          <option value="liked">Most Liked</option>
        </select>
      </div>

      {posts.map(post => (
        <div key={post.id} className="card">
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          <p><strong>By:</strong> {post.user.name}</p>
          {post.attachments && post.attachments.map((att, i) => (
            <a key={i} href={`http://127.0.0.1:8000/storage/${att}`} target="_blank">📎 View Attachment</a>
          ))}
          <br />
          <Link to={`/user/post/${post.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
