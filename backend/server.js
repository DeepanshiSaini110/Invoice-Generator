// backend-invoice/server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Email functionality 
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Nodemailer transporter setup (Zoho/Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "codevirus1234@gmail.com",
    pass: "puwxnfgqlvfcdkkj" // Gmail App Password
  }
});

app.post('/api/save-invoice', (req, res) => {
  const { invoiceInfo, client, summary, status, pdf } = req.body;

  if (!client?.email || !invoiceInfo?.invNumber) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const mailOptions = {
    from: '"My Company" <codevirus1234@gmail.com>',
    to: client.email,
    subject: `Invoice: ${invoiceInfo.invNumber}`,
    html: `
      <h2>Hello ${client.name}</h2>
      <p>Your invoice is attached.</p>
      <p><b>Total:</b> ₹${summary.total}</p>
    `,
    attachments: [
      {
        filename: `Invoice-${invoiceInfo.invNumber}.pdf`,
        content: pdf.split("base64,")[1], 
        encoding: "base64"
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
    res.status(200).json({ message: "Invoice + PDF Sent Successfully!" });
  });
});
app.listen(5000, () => console.log("Backend running on port 5000"));