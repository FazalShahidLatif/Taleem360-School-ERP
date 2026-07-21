import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Supported subscription tier types across all 5 personas.
 */
export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'STARTER',       // Tutors & Daycares
  GROWTH = 'GROWTH',         // Growing Bootcamps & Schools
  ENTERPRISE = 'ENTERPRISE'  // Large multi-campus Institutions / Academic chains
}

/**
 * Current status of subscription managed via Paddle engine.
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  PAUSED_RECOVERING = 'paused_recovering'
}

/**
 * Detailed tenant allowance limits and quota usage metrics.
 * Critical for multi-tenant isolation, throttling, and billing compliance enforcement.
 */
interface ISchemaQuotas {
  maxStudents: number;
  maxCampuses: number;
  maxStorageBytes: number;
  maxCourseCount: number;
  videoAllowed: boolean;
}

/**
 * Primary Interface for Multi-Tenant Subscriptions
 */
export interface ISubscription extends Document {
  tenantId: string;                 // Linked Tenant reference (accountId)
  paddleSubscriptionId?: string;    // Optional ID from billing Dashboard
  paddleCustomerId?: string;        // Optional customer ID
  priceId?: string;                 // Optional price ID
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  
  billingCycle: 'monthly' | 'yearly';
  priceAmount: number;
  currency: string;
  
  quotas: ISchemaQuotas;
  
  trialStartsAt?: Date;
  trialEndsAt?: Date;
  nextBillAt?: Date;
  cancelledAt?: Date;
  pausedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    tenantId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paddleSubscriptionId: {
      type: String,
      index: true,
    },
    paddleCustomerId: {
      type: String,
    },
    priceId: {
      type: String,
    },
    tier: {
      type: String,
      enum: Object.values(SubscriptionTier),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
      index: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    priceAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    quotas: {
      maxStudents: { type: Number, default: 50 },
      maxCampuses: { type: Number, default: 1 },
      maxStorageBytes: { type: Number, default: 10737418240 }, // Default 10GB in Bytes
      maxCourseCount: { type: Number, default: 3 },
      videoAllowed: { type: Boolean, default: false },
    },
    trialStartsAt: { type: Date },
    trialEndsAt: { type: Date },
    nextBillAt: { type: Date },
    cancelledAt: { type: Date },
    pausedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for ultra-fast webhook querying during state events
SubscriptionSchema.index({ paddleSubscriptionId: 1, status: 1 });
SubscriptionSchema.index({ tenantId: 1, tier: 1 });

const SubscriptionModel: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default SubscriptionModel;
