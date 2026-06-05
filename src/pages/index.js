import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notices, setNotices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // ADD / UPDATE
  const handleAdd = () => {
    if (!title || !body) return;

    const newNotice = { title, body };

    if (editIndex !== null) {
      const updated = [...notices];
      updated[editIndex] = newNotice;
      setNotices(updated);
      setEditIndex(null);
    } else {
      setNotices([newNotice, ...notices]);
    }

    setTitle("");
    setBody("");
  };

  // DELETE (BUG FIX INCLUDED)
  const handleDelete = (indexToDelete) => {
    const updated = notices.filter((_, index) => index !== indexToDelete);
    setNotices(updated);

    // IMPORTANT FIX: reset edit mode
    setEditIndex(null);
  };

  // EDIT
  const handleEdit = (index) => {
    setTitle(notices[index].title);
    setBody(notices[index].body);
    setEditIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-6">
        Notice Board
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow max-w-xl mx-auto mb-6">

        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2 rounded"
          placeholder="Enter Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {editIndex !== null ? "Update Notice" : "Add Notice"}
        </button>

      </div>

      {/* LIST */}
      <div className="grid gap-4 md:grid-cols-2">

        {notices.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow">

            <h2 className="text-xl font-semibold mb-2">
              {item.title}
            </h2>

            <p className="text-gray-700 mb-3">
              {item.body}
            </p>

            <div className="flex gap-2">

              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => handleEdit(index)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}