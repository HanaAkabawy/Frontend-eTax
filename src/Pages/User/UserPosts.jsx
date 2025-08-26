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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {post.user ? `${post.user.name}'s Post` : 'User Post'}
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
      </div>
    </div>
  );
}