const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  skills: [String],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    default: "open",
    enum: ["open", "in-progress", "completed"]
  },

  applications: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"]
      },
      appliedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Work submission from freelancer
  workSubmission: {
    github: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    submittedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      default: "not_submitted",
      enum: ["not_submitted", "pending", "approved", "rejected"]
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);