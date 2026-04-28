// models/Customer.js
// DELETE old file content and paste this exactly

import mongoose from 'mongoose';

// ✅ Force clear cached model
if (mongoose.models.Customer) {
  delete mongoose.models.Customer;
}

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    reviewRequestSent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    emailOpened: {
      type: Boolean,
      default: false,
    },
    reviewLeft: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'customers',
  }
);

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;