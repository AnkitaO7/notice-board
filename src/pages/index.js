import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Normal");
  const [publishDate, setPublishDate] = useState("");

  const [notices, setNotices] = useState([]);
  const [editId, setEditId] = useState(null);

  // GET DATA
  useEffect(() => {
    fetchNotices();
  }, []);

  // Default today's date on load
  useEffect(() => {
    if (!publishDate) {
      setPublishDate(new Date().toISOString().split("T")[0]);
    }
  }, [publishDate]); // Fixed dependency warning

  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error("Fetch error:", err); // Changed to console.error
    }
  };

  // RESET FORM
  const resetForm = () => {
    setTitle("");
    setBody("");
    setCategory("General");
    setPriority("Normal");
    setPublishDate(new Date().toISOString().split("T")[0]);
    setEditId(null);
  };

  // DATE VALIDATION
  const isValidDateInRange = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    const year = date.getFullYear();
    return year >= 1950 && year <= 2050;
  };

  // ADD / UPDATE
  const handleAdd = async () => {
    if (!title?.trim() || !body?.trim() || !publishDate) {
      return alert("All fields are required!");
    }

    if (!isValidDateInRange(publishDate)) {
      return alert("Date must be between 1950 and 2050");
    }

    const payload = { title, body, category, priority, publishDate };

    try {
      if (editId !== null) {
        await fetch("/api/notices", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...payload }),
        });
      } else {
        await fetch("/api/notices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      fetchNotices();
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong!");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this notice?");
    if (!ok) return;

    await fetch("/api/notices", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (editId === id) resetForm();
    fetchNotices();
  };

  // EDIT
  const handleEdit = (item) => {
    setTitle(item.title);
    setBody(item.body);
    setCategory(item.category);
    setPriority(item.priority);

    if (item.publishDate) {
      const date = new Date(item.publishDate);
      if (!isNaN(date.getTime())) {
        setPublishDate(date.toISOString().split("T")[0]);
      }
    }

    setEditId(item.id);
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg border">
          <h1 className="text-4xl font-bold text-indigo-700 text-center">
            📢 Notice Board
          </h1>
          <p className="text-center text-gray-500 mt-2">
            Add, Edit & Delete Notices Easily
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* FORM */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">
              {editId ? "Update Notice" : "Add Notice"}
            </h2>

            <input
              className="w-full mb-3 p-3 border rounded-lg"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full mb-3 p-3 border rounded-lg"
              placeholder="Enter Body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <select
              className="w-full mb-3 p-3 border rounded-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>General</option>
              <option>Event</option>
              <option>Exam</option>
            </select>

            <select
              className="w-full mb-3 p-3 border rounded-lg"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Normal</option>
              <option>Urgent</option>
            </select>

            <input
              type="date"
              min="1950-01-01"
              max="2050-12-31"
              className="w-full mb-4 p-3 border rounded-lg"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />

            <button
              onClick={handleAdd}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              {editId ? "Update Notice" : "Add Notice"}
            </button>

            {editId && (
              <button
                onClick={cancelEdit}
                className="w-full mt-3 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h2 className="text-xl font-bold mb-4">
              All Notices ({notices.length})
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {notices.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition ${
                    item.priority === "Urgent" ? "border-red-300" : "border-green-300"
                  }`}
                >
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${
                      item.priority === "Urgent" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {item.priority}
                  </span>

                  <h3 className="font-bold text-lg mt-2">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.body}</p>
                  <p className="text-sm mt-2">
                    <b>Category:</b> {item.category}
                  </p>
                  <p className="text-sm">
                    <b>Date:</b> {new Date(item.publishDate).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}