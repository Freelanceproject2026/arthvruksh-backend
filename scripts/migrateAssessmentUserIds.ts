import { connectDB } from '@/lib/mongodb';

import User from '@/models/User';
import UserAssessment from '@/models/UserAssessment';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function migrate() {
  try {
    await connectDB();

    const assessments = await UserAssessment.find({});

    let updated = 0;

    for (const assessment of assessments) {
      if (assessment.userId) {
        continue;
      }

      const user = await User.findOne({
        email: assessment.email,
      });

      if (!user) {
        console.log(
          `⚠ User not found for ${assessment.email}`
        );
        continue;
      }

      assessment.userId = user._id;

      await assessment.save();

      updated++;

      console.log(
        `✔ Linked ${assessment.email}`
      );
    }

    console.log(
      `\nMigration Complete`
    );

    console.log(
      `Updated: ${updated}`
    );

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();