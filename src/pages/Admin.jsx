import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Admin() {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(loggedUser);
    if (userData.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, expensesRes, analyticsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/expenses"),
        API.get("/admin/analytics")
      ]);

      setUsers(usersRes.data.data || []);
      setExpenses(expensesRes.data.data || []);
      setAnalytics(analyticsRes.data.data || {});
    } catch (err) {
      console.log("Error:", err);
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Admin Panel 👑</h4>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* Analytics Cards */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card text-white bg-primary p-3 text-center">
              <h6>Total Users</h6>
              <h4>{users.length}</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-danger p-3 text-center">
              <h6>Total Expenses</h6>
              <h4>{analytics?.totalExpenses || 0} EGP</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-success p-3 text-center">
              <h6>Total Transactions</h6>
              <h4>{expenses.length}</h4>
            </div>
          </div>
        </div>

        {/* Top Categories & Top Users */}
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card p-4 shadow">
              <h5>Top 3 Categories 📊</h5>

              {analytics?.topCategories?.length > 0 ? (
                <table className="table table-bordered mt-2">
                  <thead className="table-dark">
                    <tr>
                      <th>Category</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topCategories.map((cat, index) => (
                      <tr key={index}>
                        <td>{cat.category}</td>
                        <td>{cat.total} EGP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info mt-2">No data yet!</div>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 shadow">
              <h5>Top 3 Spending Users 👤</h5>

              {analytics?.topUsers?.length > 0 ? (
                <table className="table table-bordered mt-2">
                  <thead className="table-dark">
                    <tr>
                      <th>User</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.user}</td>
                        <td>{user.total} EGP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info mt-2">No data yet!</div>
              )}
            </div>
          </div>
        </div>

        {/* All Users */}
        <div className="card p-4 shadow mt-4">
          <h5>All Users</h5>

          {users.length > 0 ? (
            <table className="table table-bordered mt-2">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin" ? "bg-danger" : "bg-primary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info">No users yet!</div>
          )}
        </div>

        {/* All Expenses */}
        <div className="card p-4 shadow mt-4 mb-4">
          <h5>All Expenses</h5>

          {expenses.length > 0 ? (
            <table className="table table-bordered mt-2">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.user?.name}</td>
                    <td>{expense.title}</td>
                    <td>{expense.amount} EGP</td>
                    <td>{expense.category?.name}</td>
                    <td>{expense.createdAt?.split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info">No expenses yet!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;