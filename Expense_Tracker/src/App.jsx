
import { useEffect, useState } from "react";
import "./App.css";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Bills",
  "Entertainment",
  "Health",
  "Other"
];

const emptyForm = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toLocaleDateString("en-CA")
};

function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("myExpenses")) || [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("myExpenses", JSON.stringify(expenses));
  }, [expenses]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newExpense = {
      id: `${Date.now()}-${Math.random()}`,
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date
    };

    setExpenses((previous) => [newExpense, ...previous]);
    setForm({
      ...emptyForm,
      date: new Date().toLocaleDateString("en-CA")
    });
  }

  function deleteExpense(id) {
    setExpenses((previous) =>
      previous.filter((expense) => expense.id !== id)
    );
  }

  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const thisMonth = new Date().toISOString().slice(0, 7);

  const monthlyTotal = expenses
    .filter((expense) => expense.date.startsWith(thisMonth))
    .reduce((total, expense) => total + expense.amount, 0);

  const averageExpense = expenses.length
    ? totalSpent / expenses.length
    : 0;

  const categoryTotals = categories.map((category) => ({
    name: category,
    total: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter((category) => category.total > 0)
    .sort((a, b) => b.total - a.total);

  const visibleExpenses = expenses.filter((expense) => {
    const matchesCategory =
      filter === "All" || expense.category === filter;

    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const currency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(amount);

  return (
    <div className="expense-app">
      <header className="expense-navbar">
        <div className="expense-brand">
          <div className="expense-logo">₹</div>
          <div>
            <h1>PennyWise</h1>
            <p>PERSONAL FINANCE TRACKER</p>
          </div>
        </div>
        <span className="app-label">EXPENSE DASHBOARD</span>
      </header>

      <main className="expense-container">
        <section className="expense-hero">
          <span className="expense-eyebrow">YOUR MONEY, YOUR CONTROL</span>
          <h2>Track spending. <span>Build better habits.</span></h2>
          <p>
            Record daily expenses, understand your spending patterns,
            and make smarter financial decisions.
          </p>
        </section>

        <section className="expense-stats">
          <div className="expense-stat">
            <span>Total Expenses</span>
            <strong>{currency(totalSpent)}</strong>
            <small>All recorded expenses</small>
          </div>

          <div className="expense-stat">
            <span>This Month</span>
            <strong>{currency(monthlyTotal)}</strong>
            <small>Spending in the current month</small>
          </div>

          <div className="expense-stat">
            <span>Transactions</span>
            <strong>{expenses.length}</strong>
            <small>Total records added</small>
          </div>

          <div className="expense-stat">
            <span>Average Expense</span>
            <strong>{currency(averageExpense)}</strong>
            <small>Average per transaction</small>
          </div>
        </section>

        <div className="expense-layout">
          <section className="expense-panel">
            <div className="expense-section-heading">
              <span className="expense-eyebrow">NEW TRANSACTION</span>
              <h2>Add an Expense</h2>
              <p>Enter the details of your spending.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Expense Name</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Lunch with friends"
                required
              />

              <label htmlFor="amount">Amount (₹)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 250"
                required
              />

              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />

              <button className="expense-submit" type="submit">
                + Add Expense
              </button>
            </form>
          </section>

          <section className="expense-panel analysis-panel">
            <div className="expense-section-heading">
              <span className="expense-eyebrow">SPENDING BREAKDOWN</span>
              <h2>Where Your Money Goes</h2>
              <p>Compare spending across your categories.</p>
            </div>

            {categoryTotals.length === 0 ? (
              <div className="expense-empty">
                <span>📊</span>
                <p>Your category analysis will appear here after you add expenses.</p>
              </div>
            ) : (
              <div className="category-list">
                {categoryTotals.map((category) => {
                  const percentage = totalSpent
                    ? (category.total / totalSpent) * 100
                    : 0;

                  return (
                    <div className="category-item" key={category.name}>
                      <div className="category-info">
                        <span>{category.name}</span>
                        <strong>{currency(category.total)}</strong>
                      </div>
                      <div className="category-track">
                        <div
                          className="category-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <small>{percentage.toFixed(1)}% of total spending</small>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <section className="expense-panel expense-history">
          <div className="history-heading">
            <div>
              <span className="expense-eyebrow">TRANSACTION HISTORY</span>
              <h2>All Expenses</h2>
              <p>Search, filter, and manage your expense records.</p>
            </div>
            <span className="expense-count">
              {visibleExpenses.length} records
            </span>
          </div>

          <div className="expense-filters">
            <input
              aria-label="Search expenses"
              type="search"
              placeholder="Search by expense name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter by category"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {visibleExpenses.length === 0 ? (
            <div className="expense-empty">
              <span>🧾</span>
              <h3>No expenses found</h3>
              <p>Add an expense or change your search and filters.</p>
            </div>
          ) : (
            <div className="expense-table-wrap">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Expense</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="expense-title">{expense.title}</td>
                      <td>
                        <span className="category-badge">
                          {expense.category}
                        </span>
                      </td>
                      <td>{expense.date}</td>
                      <td className="expense-amount">
                        {currency(expense.amount)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="expense-delete"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="expense-footer">
          <span>PennyWise · Personal Expense Tracker</span>
          <span>Your expenses are saved in this browser.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
