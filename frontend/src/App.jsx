import React, { useState } from "react";
import Header from "./components/Header";
import Stats from "./components/Stats";
import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import "./styles/invoice.css";

function App() {

  const [invoices,setInvoices] = useState([]);
  const [showForm,setShowForm] = useState(false);

  const addInvoice = (invoice)=>{
      setInvoices([...invoices,invoice]);
      setShowForm(false);
  };

  const deleteInvoice = (id)=>{
      setInvoices(invoices.filter(inv=>inv.id !== id));
  };

  return (
    <div className="app">

      <Header openForm={()=>setShowForm(true)}/>

      <div className="container">

        <Stats invoices={invoices}/>

        {showForm && 
          <InvoiceForm 
            saveInvoice={addInvoice}
            closeForm={()=>setShowForm(false)}
          />
        }

        <InvoiceList 
          invoices={invoices}
          deleteInvoice={deleteInvoice}
        />

      </div>

    </div>
  );
}

export default App;