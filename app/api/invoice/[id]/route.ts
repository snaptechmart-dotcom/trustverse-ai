import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ FIXED PARAM HANDLING (Next.js 14 safe)
    const { id } = await context.params;

    await dbConnect();

    const payment: any = await Payment.findById(id).lean();
    if (!payment) {
      return new Response("Invoice not found", { status: 404 });
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Trustverse AI – Invoice</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
    .box {
      max-width: 600px;
      margin: auto;
      border: 1px solid #ddd;
      padding: 25px;
      background: #fff;
    }
    h1 { text-align: center; }
    .row { margin-bottom: 10px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Trustverse AI – Invoice</h1>

    <div class="row"><span class="label">Invoice ID:</span> ${payment._id}</div>
    <div class="row"><span class="label">Payment ID:</span> ${payment.razorpay_payment_id || "-"}</div>
    <div class="row"><span class="label">Plan:</span> ${payment.plan} (${payment.billing})</div>

    ✅ <div class="row"><span class="label">Credits:</span> ${payment.creditsAdded}</div>

    <div class="row"><span class="label">Amount:</span> ${payment.currency} ${payment.amount}</div>
    <div class="row"><span class="label">Status:</span> ${payment.status}</div>
    <div class="row"><span class="label">Date:</span> ${new Date(
      payment.createdAt
    ).toLocaleDateString()}</div>

    <hr />
    <p>Thank you for using <strong>Trustverse AI</strong>.</p>
    <p>You can print or save this page as PDF.</p>
  </div>
</body>
</html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    return new Response("Failed to generate invoice", { status: 500 });
  }
}
