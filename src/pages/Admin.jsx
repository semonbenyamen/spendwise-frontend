import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Admin() {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(loggedUser);

    // التأكد إن اليوزر admin
    if (userData.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    // جيبي كل الـ users من localStorage
    const savedUsers = localStorage.getItem("users");
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];
    setUsers(usersList);

    // جيبي كل الـ expenses من كل اليوزرز
    let allExpenses = [];
    usersList.forEach(user => {
      const expensesKey = `expenses_${user.id}`;
      const savedExpenses = localStorage.getItem(expensesKey);
      if (savedExpenses) {
        const userExpenses = JSON.parse(savedExpenses).map(exp => ({
          ...exp,
          userName: user.name,
          userEmail: user.email
        }));
        allExpenses = [...allExpenses, ...userExpenses];
      }
    });
    setExpenses(allExpenses);

    // حساب الـ analytics
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Top categories
    const categoryMap = {};
    allExpenses.forEach(exp => {
      const catName = exp.category.name;
      if (categoryMap[catName]) {
        categoryMap[catName] += exp.amount;
      } else {
        categoryMap[catName] = exp.amount;
      }
    });
    const topCategories = Object.keys(categoryMap)
      .map(name => ({ category: name, total: categoryMap[name] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    // Top users
    const userMap = {};
    allExpenses.forEach(exp => {
      if (userMap[exp.userName]) {
        userMap[exp.userName] += exp.amount;
      } else {
        userMap[exp.userName] = exp.amount;
      }
    });
    const topUsers = Object.keys(userMap)
      .map(name => ({ user: name, total: userMap[name] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    setAnalytics({ totalExpenses, topCategories, topUsers });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Admin Panel 👑</h4>

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
              <h4>{analytics?.totalExpenses} EGP</h4>
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
              {analytics?.topCategories.length === 0 ? (
                <div className="alert alert-info">No data yet!</div>
              ) : (
                <table className="table table-bordered mt-2">
                  <thead className="table-dark">
                    <tr>
                      <th>Category</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.topCategories.map((cat, index) => (
                      <tr key={index}>
                        <td>{cat.category}</td>
                        <td>{cat.total} EGP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 shadow">
              <h5>Top 3 Spending Users 👤</h5>
              {analytics?.topUsers.length === 0 ? (
                <div className="alert alert-info">No data yet!</div>
              ) : (
                <table className="table table-bordered mt-2">
                  <thead className="table-dark">
                    <tr>
                      <th>User</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.topUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.user}</td>
                        <td>{user.total} EGP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* All Users */}
        <div className="card p-4 shadow mt-4">
          <h5>All Users</h5>
          {users.length === 0 ? (
            <div className="alert alert-info">No users yet!</div>
          ) : (
            <table className="table table-bordered mt-2">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* All Expenses */}
        <div className="card p-4 shadow mt-4">
          <h5>All Expenses</h5>
          {expenses.length === 0 ? (
            <div className="alert alert-info">No expenses yet!</div>
          ) : (
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
                    <td>{expense.userName}</td>
                    <td>{expense.title}</td>
                    <td>{expense.amount} EGP</td>
                    <td>{expense.category.name}</td>
                    <td>{expense.date}</td>
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

export default Admin;