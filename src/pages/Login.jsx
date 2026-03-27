// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";

// function Login() {
//   // state for email, password, error, and loading
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // To move between pages
//   const navigate = useNavigate();

//   // Function Login
//   const handleLogin = async (e) => {
//     // Prevent the page from refreshing
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // sent email and password to backend
//       const response = await API.post("/auth/login", { email, password });

//       // Save the token in localStorage
//       localStorage.setItem("token", response.data.token);

//       // get user data from profile
//       const profileResponse = await API.get("/auth/profile");
//       const userData = profileResponse.data;

//       // Saving user data in localStorage
//       localStorage.setItem("user", JSON.stringify({
//         id: userData._id,
//         name: userData.name,
//         email: userData.email,
//         role: userData.role || "user",
//         profileImage: userData.profileImage || null
//       }));

//       // Go to dashboard
//       navigate("/dashboard");
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

//           {/*Login card*/}
//           <div className="card p-4 shadow">
//             <h2 className="text-center mb-4">SpendWise 💰</h2>
//             <h5 className="text-center mb-4">Login</h5>

//             {/*error message*/}
//             {error && <div className="alert alert-danger">{error}</div>}

//             {/*Login form*/}
//             <form onSubmit={handleLogin}>

//               {/*Email field*/}
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

//               {/*Login button*/}
//               <button
//                 type="submit"
//                 className="btn btn-primary w-100"
//                 disabled={loading}
//               >
//                 {loading ? "Loading..." : "Login"}
//               </button>
//             </form>

//             {/*Link to register*/}
//             <p className="text-center mt-3">
//               Don't have an account?{" "}
//               <span
//                 style={{ cursor: "pointer", color: "blue" }}
//                 onClick={() => navigate("/register")}
//               >
//                 Register
//               </span>
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

























import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", { email, password });

      // الـ backend بيرجع token
      const token = response.data.token;
      localStorage.setItem("token", token);

      // جيبي بيانات اليوزر من الـ profile
      const profileResponse = await API.get("/auth/profile");
      const userData = profileResponse.data;
      localStorage.setItem("user", JSON.stringify({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || "user"
      }));

      navigate("/dashboard");
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
            <h5 className="text-center mb-4">Login</h5>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
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
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;