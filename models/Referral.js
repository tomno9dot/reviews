import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'signed_up', 'converted', 'rewarded'],
    default: 'pending'
  },
  referredEmail: {
    type: String,
    default: ''
  },
  rewardGiven: {
    type: Boolean,
    default: false
  },
  rewardType: {
    type: String,
    enum: ['free_month', 'extra_requests', null],
    default: null
  },
  convertedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.models.Referral ||
  mongoose.model('Referral', ReferralSchema);