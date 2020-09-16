const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: Number,
      default: 0, // normal user is 0
    },

    purchasedTests: {
      type: Array,
      default: [
        {
          testName: {
            type: String,
            required: true,
          },
          testCode: {
            type: String,
            required: true,
            trim: true,
          },
          attemped: {
            type: String,
            default: "No",
          },
          obtainedMarks: {
            type: String,
            defaut: "Not Attemped",
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
