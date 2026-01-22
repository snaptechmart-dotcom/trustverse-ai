export const initPaddle = () => {
  if (typeof window === "undefined") return;

  if (!(window as any).Paddle) return;

  (window as any).Paddle.Environment.set("production"); 
  // testing ke liye: "sandbox"

  (window as any).Paddle.Initialize({
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
  });
};
