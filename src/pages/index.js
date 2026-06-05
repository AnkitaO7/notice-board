import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Normal");
  const [publishDate, setPublishDate] = useState("");

  const [notices, setNotices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // ADD / UPDATE
  const handleAdd = () => {
    if (!title || !body || !publishDate) return;

    const newNotice = {
      title,
      body,
      category,
      priority,
      publishDate,
    };

    if (editIndex !== null) {
      const updated = [...notices];
      updated[editIndex] = newNotice;
      setNotices(updated);
      setEditIndex(null);
    } else {
      setNotices([newNotice, ...notices]);
    }

    // RESET FORM
    setTitle("");
    setBody("");
    setCategory("General");
    setPriority("Normal");
    setPublishDate("");
  };

  // DELETE
  const handleDelete = (indexToDelete) => {
    const updated = notices.filter((_, index) => index !== indexToDelete);
    setNotices(updated);
    setEditIndex(null);
  };

  // EDIT
  const handleEdit = (index) => {
    const item = notices[index];

    setTitle(item.title);
    setBody(item.body);
    setCategory(item.category);
    setPriority(item.priority);
    setPublishDate(item.publishDate);

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

        {/* CATEGORY */}
        <select
          className="border p-2 w-full mb-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>General</option>
          <option>Event</option>
          <option>Exam</option>
        </select>

        {/* PRIORITY */}
        <select
          className="border p-2 w-full mb-2 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Normal</option>
          <option>Urgent</option>
        </select>

        {/* DATE */}
        <input
          type="date"
          className="border p-2 w-full mb-2 rounded"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
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

            {/* URGENT BADGE */}
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                item.priority === "Urgent"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              {item.priority}
            </span>

            <h2 className="text-xl font-semibold mt-3">
              {item.title}
            </h2>

            <p className="text-gray-700 mt-2">
              {item.body}
            </p>

            <p className="mt-2">
              <strong>Category:</strong> {item.category}
            </p>

            <p>
              <strong>Date:</strong> {item.publishDate}
            </p>

            <div className="flex gap-2 mt-4">

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