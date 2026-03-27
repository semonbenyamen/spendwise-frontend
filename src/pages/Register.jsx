// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";

// function Register() {
//   // state Data, error, success, and loading
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // To move between pages
//   const navigate = useNavigate();

//   // Function Create a new account
//   const handleRegister = async (e) => {
//     // stop the page from refreshing
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // sent data to backend for create a new account.
//       await API.post("/auth/register", { name, email, password });

//       // Displaying the success message and transfer to the login
//       setSuccess("Account created successfully! Redirecting...");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       // Displaying the error message from the backend
//       setError(
//         err.response?.data?.msg ||
//         err.response?.data?.message ||
//         err.response?.data?.errors?.[0]?.msg ||
//         "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // main wrapper
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-5">

//           {/*Account creation card*/}
//           <div className="card p-4 shadow">
//             <h2 className="text-center mb-4">SpendWise 💰</h2>
//             <h5 className="text-center mb-4">Create Account</h5>

//             {/*Error and success messages*/}
//             {error && <div className="alert alert-danger">{error}</div>}
//             {success && <div className="alert alert-success">{success}</div>}

//             {/*Account creation form*/}
//             <form onSubmit={handleRegister}>

//               {/*Name field*/}
//               <div className="mb-3">
//                 <label>Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>

//               {/*email field*/}
//               <div className="mb-3">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>

//               {/*Password field*/}
//               <div className="mb-3">
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>

//               {/*Record button*/}
//               <button
//                 type="submit"
//                 className="btn btn-primary w-100"
//                 disabled={loading}
//               >
//                 {loading ? "Loading..." : "Register"}
//               </button>
//             </form>

//             {/*Link to login*/}
//             <p className="text-center mt-3">
//               Already have an account?{" "}
//               <span
//                 style={{ cursor: "pointer", color: "blue" }}
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </span>
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
























import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/register", { name, email, password });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
        console.log("Full error:", err.response);
        setError(err.response?.data?.msg || err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">SpendWise 💰</h2>
            <h5 className="text-center mb-4">Create Account</h5>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleRegister}>
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

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;