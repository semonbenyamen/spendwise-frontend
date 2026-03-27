// // for hooks and tools
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import API from "../api/axios";

// function Dashboard() {
//   // data state
//   const [budget, setBudget] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [expensesByCategory, setExpensesByCategory] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   // get Data when the page loads
//   useEffect(() => {
//     const loggedUser = localStorage.getItem("user");
//     if (!loggedUser) {
//       navigate("/login");
//       return;
//     }
//     setUser(JSON.parse(loggedUser));
//     fetchData();
//   }, []);

//   // Function get all data from backend
//   const fetchData = async () => {
//     try {
//       // get budget
//       try {
//         const budgetRes = await API.get("/budget/status");
//         setBudget(budgetRes.data);
//       } catch (err) {
//         if (err.response?.status !== 404) {
//           console.log("Budget error:", err);
//         }
//       }

//       // get expenses
//       const expensesRes = await API.get("/expenses/all");
//       setExpenses(expensesRes.data.data || []);

//       // get expenses divided into categories.
//       const categoryRes = await API.get("/expenses/by-category");
//       setExpensesByCategory(categoryRes.data.data || []);

//     } catch (err) {
//       console.log("Error:", err);
//       setError("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function get category name from the expenses
//   const getCategoryName = (categoryId) => {
//     const found = expenses.find(exp => exp.category?._id === categoryId);
//     return found?.category?.name || "Unknown";
//   };

//   // screen loading
//   if (loading) {
//     return (
//       <div>
//         <Navbar />
//         <div className="container mt-4 text-center">
//           <div className="spinner-border text-primary" role="status" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar />

//       <div className="container mt-4">
//         <h4>Welcome, {user?.name} 👋</h4>

//         {/* Message error */}
//         {error && <div className="alert alert-danger mt-3">{error}</div>}

//         {/* alerts Budget */}
//         {budget?.alert === "warning" && (
//           <div className="alert alert-warning mt-3">
//             ⚠️ Warning! You have spent 80% of your monthly budget!
//           </div>
//         )}
//         {budget?.alert === "max" && (
//           <div className="alert alert-danger mt-3">
//             🚨 You have reached 100% of your monthly budget!
//           </div>
//         )}

//         {/* Budget summary cards */}
//         <div className="row mt-4">
//           <div className="col-md-3">
//             <div className="card text-white bg-primary p-3 text-center">
//               <h6>Monthly Budget</h6>
//               <h4>{budget?.budget || 0} EGP</h4>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card text-white bg-danger p-3 text-center">
//               <h6>Total Spent</h6>
//               <h4>{budget?.totalSpent || 0} EGP</h4>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card text-white bg-success p-3 text-center">
//               <h6>Remaining</h6>
//               <h4>{budget?.remaining || 0} EGP</h4>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card text-white bg-warning p-3 text-center">
//               <h6>Spent %</h6>
//               <h4>{budget?.percentage || "0.00"}%</h4>
//             </div>
//           </div>
//         </div>

//         {/*budget usage*/}
//         <div className="mt-4">
//           <h6>Budget Usage</h6>
//           <div className="progress" style={{ height: "25px" }}>
//             <div
//               className="progress-bar bg-danger"
//               style={{ width: `${budget?.percentage || 0}%` }}
//             >
//               {budget?.percentage || "0.00"}%
//             </div>
//           </div>
//         </div>

//         {/*Expenses divided each category*/}
//         <div className="mt-4">
//           <h5>Expenses by Category 📊</h5>
//           {expensesByCategory.length > 0 ? (
//             <div className="row">
//               {expensesByCategory.map((cat, index) => {
//                 // Calculating the percentage of category in total expenses
//                 const percent = budget?.totalSpent > 0
//                   ? ((cat.total / budget.totalSpent) * 100).toFixed(0)
//                   : 0;
//                 return (
//                   <div className="col-md-3 mb-3" key={index}>
//                     <div className="card p-3 text-center shadow">
//                       <h6>{getCategoryName(cat._id)}</h6>
//                       <h5 className="text-danger">{cat.total} EGP</h5>
//                       {/*category ratio*/}
//                       <div className="progress mt-2" style={{ height: "10px" }}>
//                         <div
//                           className="progress-bar bg-primary"
//                           style={{ width: `${percent}%` }}
//                         />
//                       </div>
//                       <small className="text-muted mt-1">{percent}% of total</small>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="alert alert-info">No expenses yet!</div>
//           )}
//         </div>

//         {/*Other expenses table*/}
//         <div className="mt-4">
//           <h5>Latest Expenses</h5>
//           {expenses.length > 0 ? (
//             <table className="table-bordered">
//               <thead className="table-dark">
//                 <tr>
//                   <th>Title</th>
//                   <th>Amount</th>
//                   <th>Category</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/*last 5 expenses only*/}
//                 {expenses.slice(0, 5).map((expense) => (
//                   <tr key={expense._id}>
//                     <td>{expense.title}</td>
//                     <td>{expense.amount} EGP</td>
//                     <td>{expense.category?.name}</td>
//                     <td>{expense.createdAt?.split("T")[0]}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="alert alert-info">No expenses yet!</div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Dashboard;





































import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Dashboard() {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(loggedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Budget
      try {
        const budgetResponse = await API.get("/budget/status");
        setBudget(budgetResponse.data);
      } catch (err) {
        if (err.response?.status !== 404) {
          console.log("Budget error:", err);
        }
      }

      // Expenses
      const expensesResponse = await API.get("/expenses/all");
      setExpenses(expensesResponse.data.data || []);

      // By Category
      const byCategoryResponse = await API.get("/expenses/by-category");
      setExpensesByCategory(byCategoryResponse.data.data || []);

    } catch (err) {
      console.log("Error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 helper: get category name from expenses
  const getCategoryName = (categoryId) => {
    const found = expenses.find(exp => exp.category?._id === categoryId);
    return found?.category?.name || "Unknown";
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4 text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Welcome, {user?.name} 👋</h4>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* Alerts */}
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

        {/* Progress */}
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

        {/* Expenses by Category */}
        <div className="mt-4">
          <h5>Expenses by Category 📊</h5>

          {expensesByCategory.length > 0 ? (
            <div className="row">
              {expensesByCategory.map((cat, index) => {
                const percent =
                  budget?.totalSpent > 0
                    ? ((cat.total / budget.totalSpent) * 100).toFixed(0)
                    : 0;

                return (
                  <div className="col-md-3 mb-3" key={index}>
                    <div className="card p-3 text-center shadow">
                      <h6>{getCategoryName(cat._id)}</h6>
                      <h5 className="text-danger">{cat.total} EGP</h5>

                      <div className="progress mt-2" style={{ height: "10px" }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <small className="text-muted mt-1">
                        {percent}% of total
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="alert alert-info">No expenses yet!</div>
          )}
        </div>

        {/* Latest Expenses */}
        <div className="mt-4">
          <h5>Latest Expenses</h5>

          {expenses.length > 0 ? (
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
                {expenses.slice(0, 5).map((expense) => (
                  <tr key={expense._id}>
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

export default Dashboard;