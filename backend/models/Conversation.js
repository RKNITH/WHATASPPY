const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    sender: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Conversation", conversationSchema);
