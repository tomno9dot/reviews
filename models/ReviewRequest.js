import mongoose from 'mongoose';

const ReviewRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: String,
  customerEmail: String,
  businessName: String,
  status: {
    type: String,
    enum: ['sent', 'opened', 'clicked', 'reviewed'],
    default: 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

export default mongoose.models.ReviewRequest || 
  mongoose.model('ReviewRequest', ReviewRequestSchema);