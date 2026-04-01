// lib/models/SignedAgreement.js
import mongoose from "mongoose";

const signedAgreementSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    clientName: {
      type: String,
      required: false,
      default: "Unknown",
    },
    clientEmail: {
      type: String,
      required: false,
      default: null,
    },
    clientPan: {
      type: String,
      required: false,
      default: "NOT_PROVIDED",
    },
    clientPhone: {
      type: String,
      required: false,
      default: null,
    },
    clientDob: {
      type: String,
      required: false,
      default: null,
    },
    clientState: {
      type: String,
      required: false,
      default: null,
    },
    signedPlanName: {
      type: String,
      required: false,
      default: null,
    },
    agreementHtml: {
      type: String,
      required: false,
      default: "",
    },
    signatureData: {
      type: String, // Base64 encoded signature image
      required: true,
    },
    signedName: {
      type: String, // Name as signed
    },
    signedTimestamp: {
      type: Date,
      required: true,
    },
    signatureTab: {
      type: String, // "typed", "draw", or "upload"
      enum: ["typed", "draw", "upload"],
    },
    ipAddress: {
      type: String,
      default: null,
    },
    fileHash: {
      type: String, // SHA-256 hash of agreement + signature
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "SIGNED", "LOCKED"],
      default: "SIGNED",
      index: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadedAt: {
      type: Date,
      default: null,
    },
    pdfGeneratedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent re-signing
signedAgreementSchema.index({ userId: 1, status: 1 });

export default mongoose.models.SignedAgreement ||
  mongoose.model("SignedAgreement", signedAgreementSchema);
