import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import PDFDocument from "pdfkit";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const payment: any = await Payment.findById(params.id).lean();
    if (!payment) {
      return new Response("Invoice not found", { status: 404 });
    }

    // 🔹 Create PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // 🔹 Collect chunks as Uint8Array (NO Buffer.concat)
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk: Uint8Array) => {
      chunks.push(chunk);
    });

    // ===== PDF CONTENT =====
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
    // =======================

    doc.end();

    // 🔹 Merge Uint8Array chunks safely
    const pdfBytes = new Uint8Array(
      chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    );

    let offset = 0;
    for (const chunk of chunks) {
      pdfBytes.set(chunk, offset);
      offset += chunk.length;
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
