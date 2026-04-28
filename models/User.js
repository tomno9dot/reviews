// models/User.js
// DELETE old file content and paste this exactly

import mongoose from 'mongoose';

// ✅ Force clear cached model
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    businessType: {
      type: String,
      enum: [
        'restaurant',
        'salon',
        'clinic',
        'retail',
        'hotel',
        'pharmacy',
        'gym',
        'other',
      ],
      default: 'other',
    },
    googleReviewLink: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'pro'],
      default: 'free',
    },
    paystackCustomerCode: {
      type: String,
      default: '',
    },
    paystackSubscriptionCode: {
      type: String,
      default: '',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'inactive',
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    reviewRequestsSentThisMonth: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastResetDate: {
      type: Date,
      default: Date.now,
    },
    trialStartDate: {
      type: Date,
      default: Date.now,
    },
    trialEndDate: {
      type: Date,
      default: () =>
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    expoPushToken: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

UserSchema.methods.canSendRequest = function () {
  const limits = { free: 10, starter: 100, pro: 999999 };
  return (
    this.reviewRequestsSentThisMonth < (limits[this.plan] || 10)
  );
};

const User = mongoose.model('User', UserSchema);

export default User;