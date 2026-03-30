// to save data in component,and whene data changes,the page updates automatically
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// get axios to call backend API
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
// It saves page is loading or not,false:meaning it's not loading
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  // stop page from the default refresh when the form is submitted  
    e.preventDefault();
  // change loading to true,to make button say "Loading"  
    setLoading(true);
  // deletes any old errors before sending  
    setError("");

    try {
  // sends request to backend on endpoint and with it email and password,wait for response    
      const response = await API.post("/auth/login", { email, password });

      // get token from res and save it in localstorage to use with req
      const token = response.data.token;
      localStorage.setItem("token", token);

      // get data of user from profile
      const profileResponse = await API.get("/auth/profile");
      const userData = profileResponse.data;

    // change object to string,localStorage only stores strings  
      localStorage.setItem("user", JSON.stringify({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || "user"
      }));

      navigate("/dashboard");
    } catch (err) {
        console.log("Full error:", err.response);
        setError(err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg || "Something went wrong");
  // Finally:always executed whatever request succeeds or fails, return loading to false
    } finally {
      setLoading(false);
    }
  };

  return (
  // mt: maegin top  
    <div className="container mt-5">
      <div className="row justify-content-center">
  // column takes 5 out of 12 parts of the display on medium-sized screens
        <div className="col-md-5">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">SpendWise 💰</h2>
            <h5 className="text-center mb-4">Login</h5>
  // &&:If first condition true , show the second part
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
      // when user types a letter, it is saved in the state           
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
            // blue button with full width 100%  
                className="btn btn-primary w-100"
                disabled={loading}
              >
            // If there loading, button will disabled to stop user from press it again
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <span
            // make mouse as it a link.  
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