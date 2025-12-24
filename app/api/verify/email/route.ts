import { recalculateTrustScore } from "@/lib/trustScoreEngine";

user.verifiedEmail = true;
await user.save();

await recalculateTrustScore(user._id.toString(), "EMAIL_VERIFIED");
