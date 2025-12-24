export function canAccessFullHistory(user: any) {
  return user.plan === "pro" || user.plan === "business";
}

export function canAccessAPI(user: any) {
  return user.plan === "business";
}
