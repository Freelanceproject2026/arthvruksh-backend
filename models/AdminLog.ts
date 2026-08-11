import mongoose, { Schema, Document, Model } from 'mongoose';

export type AdminAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE';

export type AdminResource =
  | 'AUTH'
  | 'USER'
  | 'USERS'
  | 'ASSESSMENT'
  | 'DASHBOARD'
  | 'SITE_CONFIG'
  | 'INSTAGRAM_DEAL';

export interface IAdminLog extends Document {
  adminId: mongoose.Types.ObjectId;

  adminName: string;

  adminEmail: string;

  action: AdminAction;

  resource: AdminResource;

  resourceId?: mongoose.Types.ObjectId;

  details?: Record<string, unknown>;

  ipAddress?: string;

  userAgent?: string;

  createdAt: Date;
}

const AdminLogSchema = new Schema<IAdminLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },

    adminName: {
      type: String,
      required: true,
    },

    adminEmail: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    resource: {
      type: String,
      required: true,
      index: true,
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    details: {
      type: Schema.Types.Mixed,
      default: {},
    },

    ipAddress: String,

    userAgent: String,

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

const AdminLog: Model<IAdminLog> =
  mongoose.models.AdminLog ||
  mongoose.model<IAdminLog>(
    'AdminLog',
    AdminLogSchema
  );

export default AdminLog;