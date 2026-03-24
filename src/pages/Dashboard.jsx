import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { mockBudget } from "../data/mockData";

function Dashboard() {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(loggedUser);
    setUser(userData);

    const budgetKey = `budget_${userData.id}`;
    const expensesKey = `expenses_${userData.id}`;

    const savedExpenses = localStorage.getItem(expensesKey);
    const expensesList = savedExpenses ? JSON.parse(savedExpenses) : [];
    setExpenses(expensesList);

    // حساب الـ expenses by category
    const categoryMap = {};
    expensesList.forEach(exp => {
      const catName = exp.category.name;
      if (categoryMap[catName]) {
        categoryMap[catName] += exp.amount;
      } else {
        categoryMap[catName] = exp.amount;
      }
    });

    const categoryData = Object.keys(categoryMap).map(name => ({
      name,
      total: categoryMap[name]
    }));
    setExpensesByCategory(categoryData);

    const totalSpent = expensesList.reduce((sum, exp) => sum + exp.amount, 0);

    const savedBudget = localStorage.getItem(budgetKey);
    if (savedBudget) {
      const budgetData = JSON.parse(savedBudget);

      let alert = "none";
      if (budgetData.amount > 0 && totalSpent >= budgetData.amount) {
        alert = "max";
      } else if (budgetData.amount > 0 && totalSpent >= budgetData.amount * 0.8) {
        alert = "warning";
      }

      const updatedBudget = {
        ...budgetData,
        totalSpent,
        remaining: budgetData.amount - totalSpent,
        percentage: budgetData.amount > 0
          ? ((totalSpent / budgetData.amount) * 100).toFixed(2)
          : "0.00",
        alert
      };
      setBudget(updatedBudget);
    } else {
      setBudget(mockBudget);
      localStorage.setItem(budgetKey, JSON.stringify(mockBudget));
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Welcome, {user?.name} 👋</h4>

        {/* Alert */}
        {budget?.alert === "warning" && (
          <div className="alert alert-warning mt-3">
            ⚠️ Warning! You have spent 80% of your monthly budget!
          </div>
        )}
        {budget?.alert === "max" && (
          <div className="alert alert-danger mt-3">
            🚨 You have reached 100% of your monthly budget!
          </div>
        )}

        {/* Budget Cards */}
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-white bg-primary p-3 text-center">
              <h6>Monthly Budget</h6>
              <h4>{budget?.amount} EGP</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger p-3 text-center">
              <h6>Total Spent</h6>
              <h4>{budget?.totalSpent} EGP</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success p-3 text-center">
              <h6>Remaining</h6>
              <h4>{budget?.remaining} EGP</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning p-3 text-center">
              <h6>Spent %</h6>
              <h4>{budget?.percentage}%</h4>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <h6>Budget Usage</h6>
          <div className="progress" style={{ height: "25px" }}>
            <div
              className="progress-bar bg-danger"
              style={{ width: `${budget?.percentage}%` }}
            >
              {budget?.percentage}%
            </div>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="mt-4">
          <h5>Expenses by Category 📊</h5>
          {expensesByCategory.length === 0 ? (
            <div className="alert alert-info">No expenses yet!</div>
          ) : (
            <div className="row">
              {expensesByCategory.map((cat, index) => (
                <div className="col-md-3 mb-3" key={index}>
                  <div className="card p-3 text-center shadow">
                    <h6>{cat.name}</h6>
                    <h5 className="text-danger">{cat.total} EGP</h5>
                    {/* Progress bar للكاتيجوري */}
                    <div className="progress mt-2" style={{ height: "10px" }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{
                          width: budget?.totalSpent > 0
                            ? `${((cat.total / budget.totalSpent) * 100).toFixed(0)}%`
                            : "0%"
                        }}
                      />
                    </div>
                    <small className="text-muted mt-1">
                      {budget?.totalSpent > 0
                        ? `${((cat.total / budget.totalSpent) * 100).toFixed(0)}% of total`
                        : "0% of total"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Expenses */}
        <div className="mt-4">
          <h5>Latest Expenses</h5>
          {expenses.length === 0 ? (
            <div className="alert alert-info">No expenses yet!</div>
          ) : (
            <table className="table table-bordered mt-2">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
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

export default Dashboard;