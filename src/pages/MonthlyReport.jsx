import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function MonthlyReport() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    fetchMonthlyReport();
  }, []);

  const fetchMonthlyReport = async () => {
    try {
      const response = await API.get("/expenses/monthly-report");
      setMonthlyData(response.data.data || []);
    } catch (err) {
      console.log("Error:", err);
      setMonthlyData([]);
    } finally {
      setLoading(false);
    }
  };

  const maxTotal = monthlyData.length > 0
    ? Math.max(...monthlyData.map(d => d.total || 0))
    : 1;

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
      <div className="container text-center mt-4">
        <h4>Monthly Report 📅</h4>

        {monthlyData.length === 0 ? (
          <div className="alert alert-info mt-3">
            No expenses yet to show report!
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="row mt-4">
              {monthlyData.map((item) => {
                const monthIndex = (item._id && item._id - 1 >= 0) ? item._id - 1 : 0;
                return (
                  <div className="col-md-3 mb-3" key={item._id}>
                    <div className="card p-3 text-center shadow">
                      <h6>{monthNames[monthIndex]}</h6>
                      <h5 className="text-danger">{item.total || 0} EGP</h5>
                      <div className="progress mt-2" style={{ height: "10px" }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{
                            width: `${((item.total || 0) / maxTotal * 100).toFixed(0)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table */}
            <div className="card p-4 shadow mt-4">
              <h5>Report Details</h5>
              <table className="table table-bordered mt-2">
                <thead className="table-dark">
                  <tr>
                    <th>Month</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((item) => {
                    const monthIndex = (item._id && item._id - 1 >= 0) ? item._id - 1 : 0;
                    return (
                      <tr key={item._id}>
                        <td>{monthNames[monthIndex]}</td>
                        <td>{item.total || 0} EGP</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MonthlyReport;