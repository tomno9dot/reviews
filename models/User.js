// review-saas/models/User.js

import mongoose from 'mongoose';

// ✅ Force clear cached model to avoid conflicts
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const UserSchema = new mongoose.Schema(
  {
    // ─────────────────────────────────────
    // BASIC INFO
    // ─────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // ─────────────────────────────────────
    // BUSINESS INFO
    // ─────────────────────────────────────
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },

    businessType: {
      type: String,
      enum: {
        values: [
          'restaurant',
          'salon',
          'clinic',
          'retail',
          'hotel',
          'pharmacy',
          'gym',
          'other',
        ],
        message: '{VALUE} is not a valid business type',
      },
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

    // ─────────────────────────────────────
    // SUBSCRIPTION & PLAN
    // ─────────────────────────────────────
    plan: {
      type: String,
      enum: {
        values: ['free', 'starter', 'pro'],
        message: '{VALUE} is not a valid plan',
      },
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

    stripeCustomerId: {
      type: String,
      default: '',
    },

    stripeSubscriptionId: {
      type: String,
      default: '',
    },

    subscriptionStatus: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'cancelled', 'past_due'],
        message: '{VALUE} is not a valid subscription status',
      },
      default: 'inactive',
    },

    subscriptionEndDate: {
      type: Date,
      default: null,
    },

    // ─────────────────────────────────────
    // TRIAL
    // ─────────────────────────────────────
    trialStartDate: {
      type: Date,
      default: Date.now,
    },

    trialEndDate: {
      type: Date,
      default: () =>
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },

    isTrialUsed: {
      type: Boolean,
      default: false,
    },

    // ─────────────────────────────────────
    // USAGE TRACKING
    // ─────────────────────────────────────
    reviewRequestsSentThisMonth: {
      type: Number,
      default: 0,
      min: [0, 'Count cannot be negative'],
    },

    totalReviewRequestsSent: {
      type: Number,
      default: 0,
      min: [0, 'Count cannot be negative'],
    },

    lastResetDate: {
      type: Date,
      default: Date.now,
    },

    // ─────────────────────────────────────
    // PASSWORD RESET
    // ─────────────────────────────────────
    resetPasswordToken: {
      type: String,
      default: undefined,
    },

    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },

    // ─────────────────────────────────────
    // NOTIFICATIONS
    // ─────────────────────────────────────
    expoPushToken: {
      type: String,
      default: '',
    },

    emailNotifications: {
      newReview: {
        type: Boolean,
        default: true,
      },
      weeklyReport: {
        type: Boolean,
        default: true,
      },
      limitWarning: {
        type: Boolean,
        default: true,
      },
      productUpdates: {
        type: Boolean,
        default: false,
      },
    },

    // ─────────────────────────────────────
    // REFERRAL
    // ─────────────────────────────────────
    referralCode: {
      type: String,
      default: '',
      unique: true,
      sparse: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    freeMonthsEarned: {
      type: Number,
      default: 0,
    },

    // ─────────────────────────────────────
    // ACCOUNT STATUS
    // ─────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: undefined,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    // ─────────────────────────────────────
    // SETTINGS
    // ─────────────────────────────────────
    timezone: {
      type: String,
      default: 'UTC',
    },

    currency: {
      type: String,
      default: 'USD',
    },

    country: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// ─────────────────────────────────────────────
// INDEXES for better query performance
// ─────────────────────────────────────────────
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ plan: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ referralCode: 1 }, { sparse: true });
UserSchema.index({ resetPasswordToken: 1 }, { sparse: true });

// ─────────────────────────────────────────────
// METHODS
// ─────────────────────────────────────────────

// ✅ Check if user can send review request based on plan
UserSchema.methods.canSendRequest = function () {
  const limits = {
    free: 10,
    starter: 100,
    pro: 999999,
  };
  const limit = limits[this.plan] || 10;
  return this.reviewRequestsSentThisMonth < limit;
};

// ✅ Get monthly limit for user plan
UserSchema.methods.getMonthlyLimit = function () {
  const limits = {
    free: 10,
    starter: 100,
    pro: 'Unlimited',
  };
  return limits[this.plan] || 10;
};

// ✅ Reset monthly count if new month
UserSchema.methods.resetMonthlyCountIfNeeded = function () {
  const now = new Date();
  const lastReset = new Date(this.lastResetDate);

  const isDifferentMonth =
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear();

  if (isDifferentMonth) {
    this.reviewRequestsSentThisMonth = 0;
    this.lastResetDate = now;
    return true;
  }

  return false;
};

// ✅ Check if trial is still active
UserSchema.methods.isTrialActive = function () {
  if (this.plan !== 'free') return false;
  return new Date() < new Date(this.trialEndDate);
};

// ✅ Check if subscription is active
UserSchema.methods.hasActiveSubscription = function () {
  if (this.plan === 'free') return false;
  if (this.subscriptionStatus !== 'active') return false;
  if (!this.subscriptionEndDate) return false;
  return new Date() < new Date(this.subscriptionEndDate);
};

// ✅ Get days remaining in trial
UserSchema.methods.getTrialDaysRemaining = function () {
  if (this.plan !== 'free') return 0;
  const now = new Date();
  const end = new Date(this.trialEndDate);
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// ✅ Get usage percentage
UserSchema.methods.getUsagePercentage = function () {
  const limits = { free: 10, starter: 100, pro: 999999 };
  const limit = limits[this.plan] || 10;
  if (this.plan === 'pro') return 0;
  return Math.min(
    Math.round((this.reviewRequestsSentThisMonth / limit) * 100),
    100
  );
};

// ─────────────────────────────────────────────
// STATIC METHODS
// ─────────────────────────────────────────────

// ✅ Find user by email (case insensitive)
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase().trim(),
  });
};

// ✅ Get all users on a specific plan
UserSchema.statics.getUsersByPlan = function (plan) {
  return this.find({ plan, isActive: true });
};

// ✅ Get users whose monthly count needs resetting
UserSchema.statics.getUsersForMonthlyReset = function () {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  return this.find({
    lastResetDate: { $lt: currentMonth },
    reviewRequestsSentThisMonth: { $gt: 0 },
  });
};

// ─────────────────────────────────────────────
// VIRTUAL FIELDS
// ─────────────────────────────────────────────

// ✅ Full name virtual
UserSchema.virtual('firstName').get(function () {
  return this.name ? this.name.split(' ')[0] : '';
});

// ✅ Is premium virtual
UserSchema.virtual('isPremium').get(function () {
  return this.plan === 'starter' || this.plan === 'pro';
});

// ✅ Monthly limit virtual
UserSchema.virtual('monthlyLimit').get(function () {
  const limits = { free: 10, starter: 100, pro: 999999 };
  return limits[this.plan] || 10;
});

// ─────────────────────────────────────────────
// PRE-SAVE HOOKS
// ─────────────────────────────────────────────

// ✅ Auto update lastLoginAt would be done manually
// ✅ Auto generate referral code if not set
UserSchema.pre('save', function (next) {
  if (!this.referralCode && this._id) {
    this.referralCode = this._id
      .toString()
      .slice(-8)
      .toUpperCase();
  }
  next();
});

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────
const User = mongoose.model('User', UserSchema);

export default User;