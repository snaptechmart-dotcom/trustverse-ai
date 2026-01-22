import { initPaddle } from "./paddle";

export const openCheckout = (priceId: string, customerEmail?: string) => {
  initPaddle();

  const Paddle = (window as any).Paddle;
  if (!Paddle) {
    alert("Paddle not loaded");
    return;
  }

  Paddle.Checkout.open({
    items: [
      {
        priceId: priceId,
        quantity: 1,
      },
    ],
    customer: customerEmail
      ? { email: customerEmail }
      : undefined,
  });
};
