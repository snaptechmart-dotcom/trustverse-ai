import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import PDFDocument from "pdfkit";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ VERY IMPORTANT (fixes build error)
    const { id } = await context.params;

    await dbConnect();

    const payment: any = await Payment.findById(id).lean();
    if (!payment) {
      return new Response("Invoice not found", { status: 404 });
    }

    // ===== CREATE PDF =====
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));

    doc.fontSize(20).text("Trustverse AI - Invoice", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Invoice ID: ${payment._id}`);
    doc.text(`Payment ID: ${payment.razorpay_payment_id || "N/A"}`);
    doc.text(`Plan: ${payment.plan || "-"}`);
    doc.text(`Credits Added: ${payment.credits || 0}`);
    doc.text(`Status: ${payment.status || "SUCCESS"}`);
    doc.text(
      `Date: ${new Date(payment.createdAt).toLocaleDateString()}`
    );

    doc.moveDown(2);
    doc.text("Thank you for choosing Trustverse AI.");
    doc.end();

    // ===== MERGE PDF CHUNKS =====
    const pdfBytes = new Uint8Array(
      chunks.reduce((sum, c) => sum + c.length, 0)
    );
    let offset = 0;
    for (const c of chunks) {
      pdfBytes.set(c, offset);
      offset += c.length;
    }

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=invoice.pdf",
      },
    });
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    return new Response("Failed to generate invoice", { status: 500 });
  }
}
