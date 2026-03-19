import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/invoice.css";

const InvoiceGenerator = () => {

const companyInfo = {
name: "Codevirus Security",
address:
"House No-A-76, Near Chandganj Garden Road, Kapoorthala, Aliganj, Lucknow - 226024, Uttar Pradesh",
email: "",
phone: ""
};

const [invoiceInfo, setInvoiceInfo] = useState({
invNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
date: new Date().toISOString().split("T")[0],
dueDate: ""
});

const [client, setClient] = useState({ name: "", address: "", email: "" });

const [items, setItems] = useState([
{ desc: "", qty: 1, price: 0, tax: 0 }
]);

const [discount, setDiscount] = useState(0);

const updateItem = (index, field, value) => {
const newItems = [...items];
newItems[index][field] = value;
setItems(newItems);
};

const deleteRow = (index) => {
setItems(items.filter((_, i) => i !== index));
};

const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
const totalTax = items.reduce(
(acc, item) => acc + item.qty * item.price * (item.tax / 100),
0
);

const grandTotal = Math.max(0, subtotal + totalTax - discount);

const downloadPDF = () => {
const input = document.getElementById("invoice-main-ui");

html2canvas(input, { scale: 2 }).then((canvas) => {
const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF("p", "mm", "a4");

const imgWidth = 190;
const imgHeight = (canvas.height * imgWidth) / canvas.width;

pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

pdf.save(`Invoice-${invoiceInfo.invNumber}.pdf`);
});
};

const printInvoice = () => {
window.print();
};

const [loading, setLoading] = useState(false);

const sendEmail = () => {

  if (!client?.email) {
    alert("Please enter client email");
    return;
  }

  setLoading(true);

  fetch("http://localhost:5000/api/save-invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      invoiceInfo,
      client,
      items,
      summary: {
        subtotal,
        totalTax,
        total: grandTotal
      },
      status: "Paid"
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    setLoading(false);
  })
  .catch(err => {
    console.error(err);
    alert("Failed to send email");
    setLoading(false);
  });
};
return (
   
    

<div className="invoice-wrapper">

<div id="invoice-main-ui" className="invoice-container">
    

{/* Header */}

<div className="invoice-header">

<div className="company-info">
<h2>{companyInfo.name}</h2>
<p>{companyInfo.address}</p>
</div>

<div className="invoice-title">
<h1>INVOICE</h1>
<p>#{invoiceInfo.invNumber}</p>
</div>

</div>


{/* Bill Section */}

<div className="bill-section">

<div className="bill-left">

<h4>Bill To:</h4>

<input
type="text"
placeholder="Client Name"
onChange={(e)=>setClient({...client,name:e.target.value})}
/>

<input
type="email"
placeholder="Client Email"
onChange={(e)=>setClient({...client,email:e.target.value})}
/>

<textarea
placeholder="Client Address"
onChange={(e)=>setClient({...client,address:e.target.value})}
/>

</div>


<div className="bill-right">

<p>
<b>Date:</b>
<input
type="date"
value={invoiceInfo.date}
onChange={(e)=>
setInvoiceInfo({...invoiceInfo,date:e.target.value})
}
/>
</p>

<p>
<b>Due Date:</b>
<input
type="date"
onChange={(e)=>
setInvoiceInfo({...invoiceInfo,dueDate:e.target.value})
}
/>
</p>

</div>

</div>


{/* Main Layout */}

<div className="main-content">


{/* Items */}

<div className="table-wrapper">

<table>

<thead>
<tr>
<th>Item</th>
<th>Qty</th>
<th>Price</th>
<th>Tax %</th>
<th>Total</th>
<th></th>
</tr>
</thead>

<tbody>

{items.map((item,index)=>(
<tr key={index}>

<td>
<input
className="description-input"
placeholder="Description"
value={item.desc}
onChange={(e)=>updateItem(index,"desc",e.target.value)}
/>
</td>

<td>
<input
type="number"
value={item.qty}
onChange={(e)=>updateItem(index,"qty", Number(e.target.value))}
/>
</td>

<td>
<input
type="number"
value={item.price}
onChange={(e)=>updateItem(index,"price",Number(e.target.value))}
/>
</td>

<td>
<input
type="number"
value={item.tax}
onChange={(e)=>updateItem(index,"tax",Number(e.target.value))}
/>
</td>

<td>
₹{(item.qty*item.price*(1+item.tax/100)).toFixed(2)}
</td>

<td>
<button
className="delete-btn"
onClick={()=>deleteRow(index)}
>
✖
</button>
</td>

</tr>
))}

</tbody>

</table>

<button
className="add-btn"
onClick={()=>setItems([...items,{desc:"",qty:1,price:0,tax:0}])}
>
+ Add Line Item
</button>

</div>


{/* Summary */}

<div className="summary-card">

<h4 className="summary-title">Summary</h4>

<div className="summary-row">
<span>Subtotal:</span>
<span>₹{subtotal.toFixed(2)}</span>
</div>

<div className="summary-row">
<span>Tax:</span>
<span>₹{totalTax.toFixed(2)}</span>
</div>

<div className="summary-row">
<span>Discount:</span>
<input
type="number"
value={discount}
onChange={(e)=>setDiscount(Number(e.target.value))}
/>
</div>

<div className="summary-total">
<span>Total:</span>
<span>₹{grandTotal.toFixed(2)}</span>
</div>

<button className="primary-btn" onClick={downloadPDF}>
Download PDF
</button>

<button className="secondary-btn" onClick={printInvoice}>
Print Invoice
</button>

<button 
  className="success-btn" 
  onClick={sendEmail} 
  disabled={loading}
>
  {loading ? "Sending..." : "Send via Email"}
</button>

</div>


</div>

</div>

</div>

);

};

export default InvoiceGenerator;