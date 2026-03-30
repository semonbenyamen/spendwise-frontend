import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/profile");
      const userData = response.data;

      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);

      // back end send URL for image
      if (userData.profileImage) {
        setImage(userData.profileImage);
      }

      localStorage.setItem("user", JSON.stringify({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role || "user",
          profileImage: userData.profileImage || null,
        })
      );
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await API.put("/auth/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data.data;

      localStorage.setItem("user", JSON.stringify({
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role || "user",
          profileImage: updatedUser.profileImage || null,
        })
      );

      setUser(updatedUser);

      // URL come from back end
      if (updatedUser.profileImage) {
        setImage(updatedUser.profileImage);
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess("");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container text-center mt-4">
        <h4>Profile 👤</h4>

        <div className="row justify-content-center mt-4">
          <div className="col-md-6">

            <div className="card p-4 shadow mb-4 text-center">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="mb-3">
                <label
                  htmlFor="imageUpload"
                  className="btn btn-outline-primary btn-sm"
                >
                  Change Photo
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>

              <h5>{user?.name}</h5>
              <p className="text-muted">{user?.email}</p>
              <span className={`badge ${user?.role === "admin" ? "bg-danger" : "bg-primary"}`}>
                {user?.role === "admin" ? "Admin" : "User"}
              </span>
            </div>

            <div className="card p-4 shadow">
              <h5>Edit Profile</h5>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;