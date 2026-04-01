// to change between pages without Refresh
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const loggedUser = localStorage.getItem("user");
  // if find data change it from string to object if not find return null
  const user = loggedUser ? JSON.parse(loggedUser) : null;

  const handleLogout = () => {
  // delete token,user data from local storage  
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <span className="navbar-brand fw-bold">SpendWise 💰</span>

      <div className="d-flex gap-3 align-items-center">
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/expenses")}
        >
          Expenses
        </button>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/budget")}
        >
          Budget
        </button>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/categories")}
        >
          Categories
        </button>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/monthly-report")}
        >
          Report
        </button>

        {user?.role === "admin" && (
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => navigate("/admin")}
          >
            Admin
          </button>
        )}

        {/* Profile Button */}
        <div
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "35px", height: "35px", objectFit: "cover", border: "2px solid white" }}
            />
          ) : (
            <div
              className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center"
              style={{ width: "35px", height: "35px", fontWeight: "bold" }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <button
          className="btn btn-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;