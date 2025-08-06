const Contact = require("../models/Contact");

exports.handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res.status(200).json({ success: true, message: "Message saved to database." });
  } catch (err) {
    console.error("Error saving contact:", err.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
