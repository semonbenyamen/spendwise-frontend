import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(loggedUser);
    setUser(userData);
    setName(userData.name);
    setEmail(userData.email);

    // جيبي الصورة لو موجودة
    const savedImage = localStorage.getItem(`profile_image_${userData.id}`);
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // تحويل الصورة لـ base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImage(base64);
      localStorage.setItem(`profile_image_${user.id}`, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name,
      email
    };

    // حفظ البيانات الجديدة في localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // تحديث الـ users list
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, name, email } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    setUser(updatedUser);
    setSuccess("Profile updated successfully!");
    setTimeout(() => {
      setSuccess("");
      // عشان الـ Navbar يتحدث
      window.location.reload();
    }, 1500);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Profile 👤</h4>

        <div className="row justify-content-center mt-4">
          <div className="col-md-6">

            {/* Profile Info Card */}
            <div className="card p-4 shadow mb-4 text-center">

              {/* الصورة */}
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

              {/* زرار رفع الصورة */}
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

            {/* Edit Profile Form */}
            <div className="card p-4 shadow">
              <h5>Edit Profile</h5>

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

                <button type="submit" className="btn btn-primary w-100">
                  Save Changes
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