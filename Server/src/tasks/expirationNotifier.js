import cron from "node-cron";
import Partnership from "../Models/partnership.model.js";
import Notification from "../Models/notification.model.js";

cron.schedule("0 0 * * *", async () => {
  const soonExpiring = await Partnership.find({
    expiringDate: { $lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  });

  for (let p of soonExpiring) {
    await Notification.create({
      user: p.createdBy,
      message: `Partnership with ${p.partnersName} is expiring soon.`,
      type: "expiration",
    });
  }
});
