// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Stripe = require("stripe");
const contactRoutes = require("./routes/contactRoutes");
const connectDB = require("./config/db");
dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

connectDB();
const corsOptions = {
  origin: "https://localhost:5173", 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/contact", contactRoutes);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { item } = req.body;
    const origin = req.headers.origin || "https://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              images: [item.image],
              description: item.outcome,
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?type=kit&name=${encodeURIComponent(item.name)}&id=kit123`,
      cancel_url: `${origin}/cancel`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});
app.post("/create-course-checkout-session", async (req, res) => {
  try {
    const { item, type } = req.body;
    const origin = req.headers.origin || "https://localhost:5173"; 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Course: ${item.name}`,
              images: [item.image],
              metadata: {
                type,
              },
            },
            unit_amount: item.price * 100, // Stripe uses paise
          },
          quantity: item.quantity || 1,
        },
      ],
      success_url: `${origin}/course-success?type=course&course=${type}`,
      cancel_url: `${origin}/courses`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating course checkout session:", error);
    res.status(500).send("Failed to create course checkout session");
  }
});
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
