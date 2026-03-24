import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories/all");
      setCategories(response.data.data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Category name is required");
      return;
    }
    setLoading(true);
    try {
      await API.post("/categories/add", { name });
      setName("");
      setError("");
      setSuccess("Category added successfully!");
      setTimeout(() => setSuccess(""), 2000);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/categories/delete/${id}`);
      setSuccess("Category deleted!");
      setTimeout(() => setSuccess(""), 2000);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.msg || "Cannot delete category");
    }
  };

  const handleEditClick = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  const handleEditSave = async (id) => {
    if (!editName) {
      setError("Category name is required");
      return;
    }
    try {
      await API.put(`/categories/update/${id}`, { name: editName });
      setEditId(null);
      setEditName("");
      setError("");
      setSuccess("Category updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Category"}
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