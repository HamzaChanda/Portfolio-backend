import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.yourhost.com'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // send from your Gmail
      to: process.env.EMAIL_USER,                    // your inbox
      replyTo: email,                                 // reply goes to the sender
      subject: `Portfolio Contact from ${name}`,
      text: `You got a new message from your portfolio:
Name: ${name}
Email: ${email}
Message:
${message}
      `,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});