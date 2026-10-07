const path = require("node:path");
const secondBatch = process.argv.includes("--batch=21-40");
const business = process.argv.includes("--course=business");
module.exports = {
  course: business ? "business" : "conversation",
  firstUnit: secondBatch ? 21 : 1,
  lastUnit: secondBatch ? 40 : 20,
  directory: path.resolve(
    business
      ? "audio_backup/business-reading-01-40-v4"
      : `audio_backup/conversation-reading-${secondBatch ? "21-40" : "01-20"}-v4`
  ),
};
