import mongoose from "mongoose";

const affirmationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
    type: String,
    enum: ["Self-Worth", "Growth", "Resilience", "Self-Care", "General"],
    default: "General",
  },
  },
  { timestamps: true }
);

export const Affirmation = mongoose.model("Affirmation", affirmationSchema);
