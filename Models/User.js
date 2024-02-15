const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  addresses: { type: [mongoose.Schema.Types.Mixed] },
  orders: { type: [mongoose.Schema.Types.Mixed] },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
  virtuals: true,
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

// Compare the stored password hash with the provided password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};
const User = mongoose.model("User", userSchema);
module.exports = User;

// {
//       "email": "harshdhunna777@gmail.com",
//       "password": "harsh123",
//       "id": 2,
//       "role": "user",
//       "addresses": [
//         {
//           "name": "Harsh Dhunna",
//           "phone": "6283231679",
//           "email": "harshdhunna777@gmail.com",
//           "country": "United States",
//           "street": "2457/1, gali kucha khair deen, chitta gumat",
//           "city": "amritsar",
//           "state": "Punjab",
//           "postalCode": "143001"
//         },
//         {
//           "name": "Harsh Dhunna",
//           "phone": "6283231679",
//           "email": "harshdhunna777@gmail.com",
//           "country": "United States",
//           "street": "2457/1, gali kucha khair deen, chitta gumat",
//           "city": "jodhpur",
//           "state": "Himachal",
//           "postalCode": "143001"
//         }
//       ]
//     },
