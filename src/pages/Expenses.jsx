// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import API from "../api/axios";

// function Expenses() {
//   // State for expenses and categories
//   const [expenses, setExpenses] = useState([]);
//   const [categories, setCategories] = useState([]);

//   // state to add a new expense
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");

//   // state for messages
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   // state for ubdate
//   const [editId, setEditId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editAmount, setEditAmount] = useState("");
//   const [editCategory, setEditCategory] = useState("");

//   const navigate = useNavigate();

//   // get Data when the page loads
//   useEffect(() => {
//     const loggedUser = localStorage.getItem("user");
//     if (!loggedUser) {
//       navigate("/login");
//       return;
//     }
//     fetchExpenses();
//     fetchCategories();
//   }, []);

//   // Function to get expenses from thebackend
//   const fetchExpenses = async () => {
//     try {
//       const response = await API.get("/expenses/all");
//       setExpenses(response.data.data);
//     } catch (err) {
//       setError("Failed to load expenses");
//     }
//   };

//   // Function to get Categories from backend
//   const fetchCategories = async () => {
//     try {
//       const response = await API.get("/categories/all");
//       setCategories(response.data.data);
//     } catch (err) {
//       setError("Failed to load categories");
//     }
//   };

//   // Function Adding a new expense
//   const handleAddExpense = async (e) => {
//     e.preventDefault();
//     if (!title || !amount || !category) {
//       setError("All fields are required");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await API.post("/expenses/add", {
//         title,
//         amount: Number(amount),
//         category
//       });

//       // alert if 80% or 100% of the budget
//       if (response.data.message) {
//         setAlertMessage(response.data.message);
//         setTimeout(() => setAlertMessage(""), 4000);
//       }

//       // to delete form after adding
//       setTitle("");
//       setAmount("");
//       setCategory("");
//       setError("");
//       setSuccess("Expense added successfully!");
//       setTimeout(() => setSuccess(""), 2000);
//       fetchExpenses();
//     } catch (err) {
//       setError(
//         err.response?.data?.msg ||
//         err.response?.data?.errors?.[0]?.msg ||
//         "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function opens editing mode
//   const handleEditClick = (expense) => {
//     setEditId(expense._id);
//     setEditTitle(expense.title);
//     setEditAmount(expense.amount);
//     setEditCategory(expense.category._id);
//   };

//   // Function to save editing
//   const handleEditSave = async (id) => {
//     if (!editTitle || !editAmount || !editCategory) {
//       setError("All fields are required");
//       return;
//     }
//     try {
//       await API.put(`/expenses/update/${id}`, {
//         title: editTitle,
//         amount: Number(editAmount),
//         category: editCategory
//       });
//       // delete edit data
//       setEditId(null);
//       setEditTitle("");
//       setEditAmount("");
//       setEditCategory("");
//       setError("");
//       setSuccess("Expense updated successfully!");
//       setTimeout(() => setSuccess(""), 2000);
//       fetchExpenses();
//     } catch (err) {
//       setError(err.response?.data?.msg || "Something went wrong");
//     }
//   };

//   // Function Delete expense
//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/expenses/delete/${id}`);
//       setSuccess("Expense deleted!");
//       setTimeout(() => setSuccess(""), 2000);
//       fetchExpenses();
//     } catch (err) {
//       setError(err.response?.data?.msg || "Something went wrong");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="container mt-4">
//         <h4>Expenses 💸</h4>

//         {/*alert Budget*/}
//         {alertMessage && (
//           <div className="alert alert-warning mt-2">{alertMessage}</div>
//         )}

//         {/*Expense Add Form*/}
//         <div className="card p-4 shadow mb-4">
//           <h5>Add New Expense</h5>

//           {/**/}
//           {error && <div className="alert alert-danger">{error}</div>}
//           {success && <div className="alert alert-success">{success}</div>}

//           <form onSubmit={handleAddExpense}>
//             <div className="row">

//               {/*Title*/}
//               <div className="col-md-4 mb-3">
//                 <label>Title</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </div>

//               {/*Amount*/}
//               <div className="col-md-4 mb-3">
//                 <label>Amount (EGP)</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                 />
//               </div>

//               {/*List of Categories*/}
//               <div className="col-md-4 mb-3">
//                 <label>Category</label>
//                 <select
//                   className="form-control"
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/*Add button*/}
//             <button type="submit" className="btn btn-primary" disabled={loading}>
//               {loading ? "Adding..." : "Add Expense"}
//             </button>
//           </form>
//         </div>

//         {/*Expenses table*/}
//         <div className="card p-4 shadow">
//           <h5>All Expenses</h5>
//           {expenses.length === 0 ? (
//             <div className="alert alert-info">No expenses yet!</div>
//           ) : (
//             <table className="table-bordered">
//               <thead className="table-dark">
//                 <tr>
//                   <th>Title</th>
//                   <th>Amount</th>
//                   <th>Category</th>
//                   <th>Date</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {expenses.map((expense) => (
//                   <tr key={expense._id}>

//                     {/*Title Normal or Ubdate*/}
//                     <td>
//                       {editId === expense._id ? (
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={editTitle}
//                           onChange={(e) => setEditTitle(e.target.value)}
//                         />
//                       ) : expense.title}
//                     </td>

//                     {/*Amount Normal or Ubdate*/}
//                     <td>
//                       {editId === expense._id ? (
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={editAmount}
//                           onChange={(e) => setEditAmount(e.target.value)}
//                         />
//                       ) : `${expense.amount} EGP`}
//                     </td>

//                     {/*Category Normal or Ubdate*/}
//                     <td>
//                       {editId === expense._id ? (
//                         <select
//                           className="form-control"
//                           value={editCategory}
//                           onChange={(e) => setEditCategory(e.target.value)}
//                         >
//                           <option value="">Select Category</option>
//                           {categories.map((cat) => (
//                             <option key={cat._id} value={cat._id}>
//                               {cat.name}
//                             </option>
//                           ))}
//                         </select>
//                       ) : expense.category?.name}
//                     </td>

//                     {/*the date*/}
//                     <td>{expense.date?.split("T")[0] || expense.date}</td>

//                     {/*Edit and delete buttons*/}
//                     <td>
//                       {editId === expense._id ? (
//                         <button
//                           className="btn btn-success btn-sm me-2"
//                           onClick={() => handleEditSave(expense._id)}
//                         >
//                           Save
//                         </button>
//                       ) : (
//                         <button
//                           className="btn btn-warning btn-sm me-2"
//                           onClick={() => handleEditClick(expense)}
//                         >
//                           Edit
//                         </button>
//                       )}
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => handleDelete(expense._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Expenses;






























import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await API.get("/expenses/all");
      setExpenses(response.data.data);
    } catch (err) {
      setError("Failed to load expenses");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories/all");
      setCategories(response.data.data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/expenses/add", {
        title,
        amount: Number(amount),
        category
      });

      // الـ alert بتاع الـ backend
      if (response.data.message) {
        setAlertMessage(response.data.message);
        setTimeout(() => setAlertMessage(""), 4000);
      }

      setTitle("");
      setAmount("");
      setCategory("");
      setError("");
      setSuccess("Expense added successfully!");
      setTimeout(() => setSuccess(""), 2000);
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (expense) => {
    setEditId(expense._id);
    setEditTitle(expense.title);
    setEditAmount(expense.amount);
    setEditCategory(expense.category._id);
  };

  const handleEditSave = async (id) => {
    if (!editTitle || !editAmount || !editCategory) {
      setError("All fields are required");
      return;
    }
    try {
      await API.put(`/expenses/update/${id}`, {
        title: editTitle,
        amount: Number(editAmount),
        category: editCategory
      });

      setEditId(null);
      setEditTitle("");
      setEditAmount("");
      setEditCategory("");
      setError("");
      setSuccess("Expense updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/delete/${id}`);
      setSuccess("Expense deleted!");
      setTimeout(() => setSuccess(""), 2000);
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Expenses 💸</h4>

        {alertMessage && (
          <div className="alert alert-warning mt-2">{alertMessage}</div>
        )}

        <div className="card p-4 shadow mb-4">
          <h5>Add New Expense</h5>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleAddExpense}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Amount (EGP)</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>

        <div className="card p-4 shadow">
          <h5>All Expenses</h5>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>
                      {editId === expense._id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      ) : (
                        expense.title
                      )}
                    </td>
                    <td>
                      {editId === expense._id ? (
                        <input
                          type="number"
                          className="form-control"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                        />
                      ) : (
                        `${expense.amount} EGP`
                      )}
                    </td>
                    <td>
                      {editId === expense._id ? (
                        <select
                          className="form-control"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        expense.category?.name
                      )}
                    </td>
                    <td>{expense.date?.split("T")[0] || expense.date}</td>
                    <td>
                      {editId === expense._id ? (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleEditSave(expense._id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEditClick(expense)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </td>
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

export default Expenses;