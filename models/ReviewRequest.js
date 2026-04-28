// models/ReviewRequest.js
// DELETE old file content and paste this exactly

import mongoose from 'mongoose';

// ✅ Force clear cached model
if (mongoose.models.ReviewRequest) {
  delete mongoose.models.ReviewRequest;
}

const ReviewRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['sent', 'opened', 'clicked', 'reviewed'],
      default: 'sent',
    },
    channel: {
      type: String,
      enum: ['email', 'whatsapp', 'sms'],
      default: 'email',
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    openedAt: {
      type: Date,
      default: null,
    },
    followUp1Sent: {
      type: Boolean,
      default: false,
    },
    followUp1SentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'reviewrequests',
  }
);

const ReviewRequest = mongoose.model(
  'ReviewRequest',
  ReviewRequestSchema
);

export default ReviewRequest;