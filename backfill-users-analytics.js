/**
 * Backfill Script for User Analytics Fields
 * Run this ONCE to update existing users with analytics data
 * 
 * Usage:
 * 1. Copy this to a temporary file
 * 2. Run: node backfill-users.js
 * 3. Check database for updated fields
 * 4. Delete this file
 */

import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import Payment from "@/app/lib/models/Payment";

async function backfillUserData() {
  try {
    await connectDB();
    console.log("Connected to database...");

    // 1. Set default authProvider for existing users
    const updateAuthProvider = await User.updateMany(
      { authProvider: { $exists: false } },
      { 
        $set: { 
          authProvider: "email",
          emailVerified: true 
        } 
      }
    );
    console.log(`✓ Updated ${updateAuthProvider.modifiedCount} users with default authProvider`);

    // 2. Set lastLoginAt from payment data for existing users
    // Find users who have payments but no lastLoginAt
    const usersToUpdate = await User.find({
      lastLoginAt: { $exists: false }
    }).lean();

    console.log(`Found ${usersToUpdate.length} users without lastLoginAt...`);

    for (const user of usersToUpdate) {
      // Find the most recent payment for this user
      const latestPayment = await Payment.findOne(
        { email: user.email },
        { paidAt: 1 }
      )
        .sort({ paidAt: -1 })
        .lean();

      if (latestPayment && latestPayment.paidAt) {
        // Set lastLoginAt to payment date as a proxy
        await User.updateOne(
          { _id: user._id },
          { $set: { lastLoginAt: latestPayment.paidAt } }
        );
        console.log(`✓ Updated ${user.email} with payment date`);
      }
    }

    console.log("✅ Backfill complete!");
  } catch (error) {
    console.error("❌ Error during backfill:", error);
  }
}

// Run it
backfillUserData();
