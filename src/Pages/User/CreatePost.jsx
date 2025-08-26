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
      alert('Post created successfully! ✅');
    } catch (error) {
      alert('Failed to create post ❌');
    }
  };

return (  
  <div className="bg-gray-100 min-h-screen p-4">
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="What's on your mind?"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="description"
          placeholder="Write something..."
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Attach File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Post
        </button>
      </form>
    </div>
  </div>
);
}
