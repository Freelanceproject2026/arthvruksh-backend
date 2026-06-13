import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserAssessment extends Document {
  timestamp?: string;

  fullName: string;
  email: string;
  mobile: string;

  pan?: string;
  age?: number;

  annualIncome?: number;
  savingsPercentage?: number;
  annualSavings?: number;
  monthlySavings?: number;

  q1EmergencyBuffer?: string;
  q2InvestmentTimeline?: string;
  q3CashFlowStability?: string;
  q4MarketDropReaction?: string;
  q5RiskAppetite?: string;
  q6MFKnowledge?: string;

  totalScore?: number;
  riskProfile?: string;

  createdAt: Date;
}

const UserAssessmentSchema = new Schema<IUserAssessment>(
  {
    timestamp: {
      type: String,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    pan: String,

    age: Number,

    annualIncome: Number,
    savingsPercentage: Number,
    annualSavings: Number,
    monthlySavings: Number,

    q1EmergencyBuffer: String,
    q2InvestmentTimeline: String,
    q3CashFlowStability: String,
    q4MarketDropReaction: String,
    q5RiskAppetite: String,
    q6MFKnowledge: String,

    totalScore: Number,
    riskProfile: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const UserAssessment: Model<IUserAssessment> =
  mongoose.models.UserAssessment ||
  mongoose.model<IUserAssessment>(
    'UserAssessment',
    UserAssessmentSchema
  );

export default UserAssessment;