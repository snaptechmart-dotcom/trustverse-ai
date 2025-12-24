import { recalculateTrustScore } from "@/lib/trustScoreEngine";

user.verifiedPhone = true;
await user.save();

await recalculateTrustScore(user._id.toString(), "PHONE_VERIFIED");
