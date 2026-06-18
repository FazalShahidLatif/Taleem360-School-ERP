import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Supported User/Tenant Personas in the Unified Taleem360 ecosystem.
 * Fully decoupling traditional "Schools" into unified Micro-Tenants.
 */
export enum TenantPersona {
  CONVENTIONAL_K12 = 'CONVENTIONAL_K12',
  KINDERGARTEN_DAYCARE = 'KINDERGARTEN_DAYCARE',
  SOLO_TUTOR = 'SOLO_TUTOR',
  BOOTCAMP_ENTREPRENEUR = 'BOOTCAMP_ENTREPRENEUR',
  STUDENT_CONSUMER = 'STUDENT_CONSUMER'
}

/**
 * Multi-region and localization configurations.
 */
interface ILocalizationSettings {
  timezone: string;
  currency: string;
  locale: string;
}

/**
 * 1. Conventional K12 Schools & Colleges Configuration
 */
interface IK12Settings {
  campuses: Array<{
    id: string;
    name: string;
    code: string;
    address: string;
  }>;
  sections: string[];
  boardAffiliation: string;
  gradingSystem: 'GPA' | 'PERCENTAGE' | 'LETTER_GRADE';
  isBoardExamAffiliated: boolean;
}

/**
 * 2. Kindergartens & Daycares Configuration
 */
interface IDaycareSettings {
  napTrackingEnabled: boolean;
  mealLoggingEnabled: boolean;
  parentDailyFeedSync: boolean;
  allowedCheckInGracePeriodMinutes: number;
}

/**
 * 3. Solo-preneurs & Tutors Configuration (Calendly-style)
 */
interface ISoloTutorSettings {
  bookingSlug: string; // e.g. "taleem360.online/tutor/sir-ahmed"
  availability: Array<{
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0
    slots: Array<{
      startTime: string; // "09:00"
      endTime: string;   // "10:00"
    }>;
  }>;
  zoomMeetingConfig: {
    autoScheduleZoom: boolean;
    usePersonalMeetingId: boolean;
  };
  pricingPerHour: number;
}

/**
 * 4. Educational Entrepreneurs & Bootcamps Configuration
 */
interface IBootcampSettings {
  courseCatalog: Array<{
    courseId: string;
    title: string;
    isPublished: boolean;
    price: number;
    lessonsCount: number;
  }>;
  marketingFunnelUrl?: string;
  studentOnboardingHook?: string;
}

/**
 * 5. Students & Consumers Configuration
 */
interface IStudentConsumerSettings {
  enrolledCourses: string[];
  streamingQuotaUsedBytes: number;
  streamingQuotaLimitBytes: number;
  gradeLevel?: string;
}

/**
 * Primary Interface for Tenant Profile Document
 */
export interface ITenant extends Document {
  accountId: string;          // Direct link to identity/Auth record
  name: string;               // Display name
  email: string;              // Primary contact email
  persona: TenantPersona;     // Polymorphic type
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  localization: ILocalizationSettings;

  // Tenant-specific settings (polymorphic configuration parameters)
  k12Settings?: IK12Settings;
  daycareSettings?: IDaycareSettings;
  soloTutorSettings?: ISoloTutorSettings;
  bootcampSettings?: IBootcampSettings;
  studentConsumerSettings?: IStudentConsumerSettings;

  // Extensible JSONB-style settings block to support future plugin developments without migration pain
  metadata: Record<string, any>;
}

const TenantSchema: Schema<ITenant> = new Schema(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
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
    persona: {
      type: String,
      enum: Object.values(TenantPersona),
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    localization: {
      timezone: { type: String, default: 'Asia/Karachi' },
      currency: { type: String, default: 'PKR' },
      locale: { type: String, default: 'en-US' },
    },
    
    // Conventional K12 settings
    k12Settings: {
      campuses: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          code: { type: String },
          address: { type: String },
        },
      ],
      sections: [{ type: String }],
      boardAffiliation: { type: String },
      gradingSystem: { type: String, enum: ['GPA', 'PERCENTAGE', 'LETTER_GRADE'], default: 'PERCENTAGE' },
      isBoardExamAffiliated: { type: Boolean, default: false },
    },

    // Daycare settings
    daycareSettings: {
      napTrackingEnabled: { type: Boolean, default: true },
      mealLoggingEnabled: { type: Boolean, default: true },
      parentDailyFeedSync: { type: Boolean, default: true },
      allowedCheckInGracePeriodMinutes: { type: Number, default: 15 },
    },

    // Solo Tutor settings
    soloTutorSettings: {
      bookingSlug: { type: String, sparse: true, unique: true },
      availability: [
        {
          dayOfWeek: { type: Number, min: 0, max: 6 },
          slots: [
            {
              startTime: { type: String },
              endTime: { type: String },
            },
          ],
        },
      ],
      zoomMeetingConfig: {
        autoScheduleZoom: { type: Boolean, default: false },
        usePersonalMeetingId: { type: Boolean, default: false },
      },
      pricingPerHour: { type: Number, default: 0 },
    },

    // Bootcamp Settings
    bootcampSettings: {
      courseCatalog: [
        {
          courseId: { type: String, required: true },
          title: { type: String, required: true },
          isPublished: { type: Boolean, default: false },
          price: { type: Number, default: 0 },
          lessonsCount: { type: Number, default: 0 },
        },
      ],
      marketingFunnelUrl: { type: String },
      studentOnboardingHook: { type: String },
    },

    // Student Consumer Settings
    studentConsumerSettings: {
      enrolledCourses: [{ type: String }],
      streamingQuotaUsedBytes: { type: Number, default: 0 },
      streamingQuotaLimitBytes: { type: Number, default: 53687091200 }, // Default: 50GB in bytes
      gradeLevel: { type: String },
    },

    // Fully schemaless custom metadata for ultimate architectural flexibility (Mongoose JSONB equivalency)
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Optimize queries with Compound Index structures
TenantSchema.index({ persona: 1, isActive: 1 });
TenantSchema.index({ accountId: 1, email: 1 });

const TenantModel: Model<ITenant> = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);

export default TenantModel;
