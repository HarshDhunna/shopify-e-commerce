const discountedPrice = require("../common/constants.js");
const stripe = require("stripe")(`${process.env.SK_STRIPE}`);
const YOUR_DOMAIN = "";

exports.createPaymentIntent = async (req, res) => {
  try {
    const { total } = req.body;

    // Calculate the order amount by awaiting the result of calculateOrderAmount function
    const orderAmount = total * 100;
    // const customer = await stripe.customers.create({
    //   name: "Jenny Rosen",
    //   address: {
    //     line1: "510 Townsend St",
    //     postal_code: "98140",
    //     city: "San Francisco",
    //     state: "CA",
    //     country: "US",
    //   },
    // });

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
      shipping: {
        name: "Jenny Rosen",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
      metadata: {
        orderId: req.body._id,
      },
      description: "Payment for order",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
