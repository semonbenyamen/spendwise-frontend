import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(loggedUser);
    const categoriesKey = `categories_${userData.id}`;

    const saved = localStorage.getItem(categoriesKey);
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories([]);
      localStorage.setItem(categoriesKey, JSON.stringify([]));
    }
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!name) {
      setError("Category name is required");
      return;
    }
    const userData = JSON.parse(localStorage.getItem("user"));
    const categoriesKey = `categories_${userData.id}`;

    const newCategory = { _id: Date.now().toString(), name };
    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem(categoriesKey, JSON.stringify(updated));

    setName("");
    setError("");
    setSuccess("Category added successfully!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleDelete = (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const categoriesKey = `categories_${userData.id}`;

    const updated = categories.filter(cat => cat._id !== id);
    setCategories(updated);
    localStorage.setItem(categoriesKey, JSON.stringify(updated));

    setSuccess("Category deleted!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleEditClick = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const handleEditSave = (id) => {
    if (!editName) {
      setError("Category name is required");
      return;
    }
    const userData = JSON.parse(localStorage.getItem("user"));
    const categoriesKey = `categories_${userData.id}`;

    const updated = categories.map(cat =>
      cat._id === id ? { ...cat, name: editName } : cat
    );
    setCategories(updated);
    localStorage.setItem(categoriesKey, JSON.stringify(updated));

    setEditId(null);
    setEditName("");
    setError("");
    setSuccess("Category updated successfully!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Categories 📂</h4>

        <div className="card p-4 shadow mb-4">
          <h5>Add New Category</h5>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleAddCategory}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  placeholder="e.g. Food, Transport..."
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Category
            </button>
          </form>
        </div>

        <div className="card p-4 shadow">
          <h5>All Categories</h5>
          {categories.length === 0 ? (
            <div className="alert alert-info">No categories yet!</div>
          ) : (
            <table className="table table-bordered mt-2">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td>{index + 1}</td>
                    <td>
                      {editId === cat._id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td>
                      {editId === cat._id ? (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleEditSave(cat._id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEditClick(cat)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;