import { useState } from 'react';
import axios from 'axios';

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', description: '', attachment: null });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, attachment: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    if (form.attachment) data.append('attachment', form.attachment);

    try {
      await axios.post('http://127.0.0.1:8000/api/posts', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Post created successfully! ✅ ');
    } catch (error) {
      alert('Failed to create post ❌');
    }
  };

  return (
    <div className="container">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
