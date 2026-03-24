import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const loggedUser = localStorage.getItem("user");
  const user = loggedUser ? JSON.parse(loggedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <span className="navbar-brand fw-bold">SpendWise 💰</span>

      <div className="d-flex gap-3">
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

        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/profile")}
        >
          {user?.name?.charAt(0).toUpperCase()} 👤
        </button>

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