import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  businessName: {
    type: String,
    required: true,
    trim: true
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
      'other'
    ],
    default: 'other'
  },
  googleReviewLink: {
    type: String,
    default: ''
  },
  // Paystack subscription details
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro'],
    default: 'free'
  },
  paystackCustomerCode: {
    type: String,
    default: ''
  },
  paystackSubscriptionCode: {
    type: String,
    default: ''
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'inactive'
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  // Usage tracking
  reviewRequestsSentThisMonth: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Check monthly limit
UserSchema.methods.canSendRequest = function() {
  const limits = {
    free: 10,
    starter: 100,
    pro: 999999 // unlimited
  };
  
  return this.reviewRequestsSentThisMonth < limits[this.plan];
};

// Reset monthly count
UserSchema.methods.resetMonthlyCount = function() {
  const now = new Date();
  const lastReset = new Date(this.lastResetDate);
  
  if (now.getMonth() !== lastReset.getMonth()) {
    this.reviewRequestsSentThisMonth = 0;
    this.lastResetDate = now;
  }
};

export default mongoose.models.User || 
  mongoose.model('User', UserSchema);