const mongoose = require("mongoose");

const testSchema = mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },

    testCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", testSchema);
