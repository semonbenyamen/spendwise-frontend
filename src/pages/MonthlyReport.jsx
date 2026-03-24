import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function MonthlyReport() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [user, setUser] = useState(null);

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

    const userData = JSON.parse(loggedUser);
    setUser(userData);

    const expensesKey = `expenses_${userData.id}`;
    const savedExpenses = localStorage.getItem(expensesKey);
    const expensesList = savedExpenses ? JSON.parse(savedExpenses) : [];

    // تجميع المصاريف حسب الشهر زي الـ backend بالظبط
    const monthMap = {};
    expensesList.forEach(exp => {
      const month = new Date(exp.date).getMonth() + 1;
      if (monthMap[month]) {
        monthMap[month] += exp.amount;
      } else {
        monthMap[month] = exp.amount;
      }
    });

    // تحويل الـ map لـ array وترتيبه
    const data = Object.keys(monthMap)
      .map(month => ({
        month: Number(month),
        total: monthMap[month]
      }))
      .sort((a, b) => a.month - b.month);

    setMonthlyData(data);
  }, []);

  // أعلى شهر في المصاريف
  const maxTotal = Math.max(...monthlyData.map(d => d.total), 1);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4>Monthly Report 📅</h4>

        {monthlyData.length === 0 ? (
          <div className="alert alert-info mt-3">
            No expenses yet to show report!
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="row mt-4">
              {monthlyData.map((item, index) => (
                <div className="col-md-3 mb-3" key={index}>
                  <div className="card p-3 text-center shadow">
                    <h6>{monthNames[item.month - 1]}</h6>
                    <h5 className="text-danger">{item.total} EGP</h5>
                    <div className="progress mt-2" style={{ height: "10px" }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{
                          width: `${((item.total / maxTotal) * 100).toFixed(0)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
                  {monthlyData.map((item, index) => (
                    <tr key={index}>
                      <td>{monthNames[item.month - 1]}</td>
                      <td>{item.total} EGP</td>
                    </tr>
                  ))}
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