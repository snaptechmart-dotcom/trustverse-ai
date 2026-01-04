import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { NextRequest } from "next/server";
import PDFDocument from "pdfkit";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const payment = await Payment.findById(params.id);
    if (!payment) {
      return new Response("Invoice not found", { status: 404 });
    }

    // ✅ Create PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {});

    doc.fontSize(20).text("Trustverse AI - Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${payment._id}`);
    doc.text(`Plan: ${payment.plan}`);
    doc.text(`Credits: ${payment.credits}`);
    doc.text(`Status: ${payment.status}`);
    doc.text(
      `Date: ${new Date(payment.createdAt).toLocaleDateString()}`
    );

    doc.end();

    // ✅ VERY IMPORTANT PART
    const pdfBuffer = new Uint8Array(
      chunks.reduce(
        (acc, chunk) => [...acc, ...chunk],
        [] as number[]
      )
    );

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=invoice-${payment._id}.pdf`,
      },
    });
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    return new Response("Failed to generate invoice", { status: 500 });
  }
}
