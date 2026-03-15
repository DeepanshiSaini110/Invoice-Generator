import React from "react";

function Dashboard({invoices}){

const revenue=invoices.reduce((sum,i)=>sum+i.total,0);

return(

<div className="stats">

<div className="stat-card">
<h4>Total Invoices</h4>
<p>{invoices.length}</p>
</div>

<div className="stat-card">
<h4>Total Revenue</h4>
<p>₹{revenue}</p>
</div>

</div>

)

}

export default Dashboard;