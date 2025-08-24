import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/posts/mine', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => setPosts(res.data)).catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>My Posts</h2>
      {posts.length === 0 ? <p>No posts yet.</p> :
        posts.map(post => (
          <div key={post.id} className="card">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            {post.attachments && post.attachments.map((att, i) => (
              <a key={i} href={`http://127.0.0.1:8000/storage/${att}`} target="_blank">📎 View Attachment</a>
            ))}
          </div>
        ))}
    </div>
  );
}
