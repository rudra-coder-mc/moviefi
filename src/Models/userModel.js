import mongoose from "mongoose";

const userSchems = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "please provide a username"],
      unique: [true, "username already existe"],
    },

    email: {
      type: String,
      require: [true, "please provide a email"],
      unique: [true, "email already existe"],
    },

    password: {
      type: String,
      require: [true, "please provide a email"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.users || mongoose.model("users", userSchems);

export default User;
