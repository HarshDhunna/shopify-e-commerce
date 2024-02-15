const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: { type: Number, required: true },
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  address: { type: mongoose.Schema.Types.Mixed, required: true },
  total: { type: Number, required: true },
  shippingMethod: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "pending" },
});
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
  virtuals: true,
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
