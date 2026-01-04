import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const payment: any = await Payment.findById(params.id).lean();
    if (!payment) {
      return new Response("Invoice not found", { status: 404 });
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { text-align: center; }
          .box { max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; }
          .row { margin-bottom: 10px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Trustverse AI – Invoice</h1>
          <div class="row"><span class="label">Invoice ID:</span> ${payment._id}</div>
          <div class="row"><span class="label">Payment ID:</span> ${payment.razorpay_payment_id || "-"}</div>
          <div class="row"><span class="label">Plan:</span> ${payment.plan || "-"}</div>
          <div class="row"><span class="label">Credits:</span> ${payment.credits || 0}</div>
          <div class="row"><span class="label">Status:</span> ${payment.status}</div>
          <div class="row"><span class="label">Date:</span> ${new Date(payment.createdAt).toLocaleDateString()}</div>
          <hr />
          <p>Thank you for using <strong>Trustverse AI</strong>.</p>
          <p>You can print this page or save it as PDF.</p>
        </div>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    return new Response("Failed to generate invoice", { status: 500 });
  }
}
