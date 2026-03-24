import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { mockBudget } from "../data/mockData";

function Budget() {
  const [budget, setBudget] = useState(null);
  const [amount, setAmount] = useState("");
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
    const budgetKey = `budget_${userData.id}`;

    const savedBudget = localStorage.getItem(budgetKey);
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    } else {
      setBudget(mockBudget);
      localStorage.setItem(budgetKey, JSON.stringify(mockBudget));
    }
  }, []);

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (!amount) {
      setError("Please enter an amount");
      return;
    }
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    const budgetKey = `budget_${userData.id}`;

    const newBudget = {
      ...budget,
      amount: Number(amount),
      remaining: Number(amount) - budget.totalSpent,
      percentage: ((budget.totalSpent / Number(amount)) * 100).toFixed(2)
    };

    setBudget(newBudget);
    localStorage.setItem(budgetKey, JSON.stringify(newBudget));

    setAmount("");
    setError("");
    setSuccess("Budget updated successfully!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Budget 🎯</h4>

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

        {budget?.alert === "warning" && (
          <div className="alert alert-warning mt-3">
            ⚠️ You have spent 80% of your monthly budget!
          </div>
        )}
        {budget?.alert === "max" && (
          <div className="alert alert-danger mt-3">
            🚨 You have reached 100% of your monthly budget!
          </div>
        )}

        <div className="card p-4 shadow mt-4">
          <h5>Set Monthly Budget</h5>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSetBudget}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Budget Amount (EGP)</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  placeholder="Enter your monthly budget"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Set Budget
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Budget;