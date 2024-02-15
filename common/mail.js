const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sanjeevkumar04121976@gmail.com",
    pass: "elwdonsvpqsjzoyq",
  },
});

exports.sendMail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const info = await transporter.sendMail({
      from: '"Shopify" <sanjeevkumar04121976@gmail.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    res.status(200).json({ email: to });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Email couldn't be sent" });
  }
};
