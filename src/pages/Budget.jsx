import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Budget() {
  const [budget, setBudget] = useState(null);
  const [amount, setAmount] = useState("");
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
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
    // get budget status from backend
      const response = await API.get("/budget/status");
      setBudget(response.data);
    } catch (err) {
      // لو مفيش budget لسه مش error
      if (err.response?.status !== 404) {
        setError("Failed to load budget");
      }
    }
  };

  const handleSetBudget = async (e) => {
  // Stop refresh
    e.preventDefault();
    if (!amount) {
      setError("Please enter an amount");
      return;
    }
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      await API.post("/budget/add", { amount: Number(amount) });
      setAmount("");
      setError("");
      setSuccess("Budget updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
      fetchBudget();
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
        <h4>Budget 🎯</h4>

        {/* Budget Status Cards */}
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-white bg-primary p-3 text-center">
              <h6>Monthly Budget</h6>
              <h4>{budget?.budget || 0} EGP</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger p-3 text-center">
              <h6>Total Spent</h6>
              <h4>{budget?.totalSpent || 0} EGP</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success p-3 text-center">
              <h6>Remaining</h6>
              <h4>{budget?.remaining || 0} EGP</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning p-3 text-center">
              <h6>Spent %</h6>
              <h4>{budget?.percentage || "0.00"}%</h4>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <h6>Budget Usage</h6>
          <div className="progress" style={{ height: "25px" }}>
            <div
              className="progress-bar bg-danger"
              style={{ width: `${budget?.percentage || 0}%` }}
            >
              {budget?.percentage || "0.00"}%
            </div>
          </div>
        </div>

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

        {/* Set Budget Form */}
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
              // placeholder: Text field when it is empty as a hint to the user
                  placeholder="Enter your monthly budget"
              // when user types a number, it is saved in the state
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
          {/* If have loading, the button will stop and display "Saving..." */}
              {loading ? "Saving..." : "Set Budget"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Budget;