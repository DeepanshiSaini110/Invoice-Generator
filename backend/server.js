// backend-invoice/server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Email functionality 
const app = express();

app.use(cors());
app.use(express.json());

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
  const { invoiceInfo, client, items, summary, status } = req.body;

  if (!client?.email || !invoiceInfo?.invNumber) {
    return res.status(400).json({ message: "Invalid data" });
  }
    const mailOptions = {
        from: '"My Company" <your-email@domain.com>',
        to: client.email,
        subject: `Payment Confirmation & Invoice: ${invoiceInfo.invNumber}`,
        html: `
            <div style="font-family: Arial; padding: 20px; border: 1px solid #eee;">
                <h2>Hello ${client.name},</h2>
                <p>Thank you for your payment. Please find your invoice details below:</p>
                <hr/>
                <p><b>Invoice Number:</b> ${invoiceInfo.invNumber}</p>
                <p><b>Amount Paid:</b> ₹${summary.total}</p>
                <p><b>Status:</b> <span style="color: green;">${status}</span></p>
                <br/>
                <p>Regards,<br/>My Company</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
       if (error) {console.error(error);
        return res.status(500).json({ message: error.message });
    }
        res.status(200).json({ message: "Invoice Generated & Email Sent!" });
    });
});

app.listen(5000, () => console.log("Backend running on port 5000"));