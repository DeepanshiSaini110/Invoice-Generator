import React, { useState } from "react";

function InvoiceList({ invoices, deleteInvoice }) {

  const [search, setSearch] = useState("");

  const filtered = invoices.filter(inv =>
    inv.client.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) {
    return <p>No invoices found</p>;
  }

  return (
    <div className="invoice-list">

      <h2>Invoice History</h2>

      <input
        className="search"
        placeholder="Search invoice..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map(inv => (

        <div className="invoice-card" key={inv.id}>

          <div>
            <h4>{inv.client}</h4>
            <p>{inv.date}</p>
          </div>

          <div className="invoice-right">

            <p className="amount">₹{inv.total}</p>

            <button
              className="delete-btn"
              onClick={() => deleteInvoice(inv.id)}
            >
              Delete
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}

export default InvoiceList;