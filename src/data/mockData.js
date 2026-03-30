// i was use it before Link with backend
export const mockUser = {
  id: "1",
  name: "Semon Benyamin",
  email: "semon@gmail.com",
  password: "123456",
  role: "admin"
};

// list for new user to find there are no expenses.
export const mockCategories = [
  { _id: "c1", name: "Food" },
  { _id: "c2", name: "Transport" },
  { _id: "c3", name: "Shopping" },
  { _id: "c4", name: "Bills" },
];

export const mockExpenses = [];

export const mockBudget = {
  amount: 0,
  totalSpent: 0,
  remaining: 0,
  percentage: "0.00",
  alert: "none"
};