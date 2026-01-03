export const runtime = "nodejs";

import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";

// pdfkit CommonJS
const PDFDocument = require("pdfkit");

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  // ✅ FIX: params ko await karo
  const { id } = await context.params;

  const payment = await Payment.findById(id);
  if (!payment) {
    return new Response("Invoice not found", { status: 404 });
  }

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  const chunks: Uint8Array[] = [];

  doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
  doc.on("end", () => {});

  // ---------- INVOICE CONTENT ----------
  doc.fontSize(20).text("Trustverse AI - Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Payment ID: ${payment.razorpayPaymentId}`);
  doc.text(`Plan: ${payment.plan}`);
  doc.text(`Amount Paid: ₹${payment.amount / 100}`);
  doc.text(`Credits Added: ${payment.creditsAdded}`);
  doc.text(`Status: ${payment.status}`);
  doc.text(`Date: ${new Date(payment.createdAt).toDateString()}`);

  doc.moveDown();
  doc.text("Thank you for choosing Trustverse AI ❤️", {
    align: "center",
  });
  // -----------------------------------

  doc.end();

  // ✅ Uint8Array merge (TS safe)
  const pdfBytes = new Uint8Array(
    chunks.reduce((acc, chunk) => [...acc, ...chunk], [] as number[])
  );

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${id}.pdf`,
    },
  });
}
