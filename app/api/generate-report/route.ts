import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import connectDB from "@/app/lib/mongodb";
import History from "@/app/models/History";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    const decoded: any = jwt.decode(token);

    if (!decoded?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scoreId } = await req.json();
    const record = await History.findById(scoreId);

    if (!record) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    // -----------------------
    // 📄 CREATE PDF DOCUMENT
    // -----------------------
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const drawText = (text: string, x: number, y: number, size = 14) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    };

    // HEADER
    drawText("TRUSTVERSE AI - TRUST REPORT", 150, 760, 20);

    // USER INFO
    drawText(`Generated For: ${decoded.name}`, 50, 710);
    drawText(`Email: ${decoded.email}`, 50, 690);
    drawText(`Date: ${new Date().toLocaleString()}`, 50, 670);

    // SCORE
    drawText("Trust Score:", 50, 630, 16);
    drawText(`${record.score}/100`, 180, 630, 20);

    // DETAILS
    drawText("Profile Summary:", 50, 580, 16);
    drawText(record.name, 50, 560);

    drawText("Information:", 50, 530, 16);
    drawText(record.info, 50, 510, 12);

    drawText("AI Analysis:", 50, 470, 16);
    drawText(record.analysis, 50, 450, 12);

    // RECOMMENDATION
    drawText("AI Recommendations:", 50, 410, 16);
    drawText(
      record.score > 80
        ? "✔ Highly trustworthy. Recommended for partnerships & collaboration."
        : record.score > 60
        ? "✔ Moderately trustworthy. Recommended after basic verification."
        : "⚠ Use caution. Perform strong verification before trusting.",
      50,
      390,
      12
    );

    // FOOTER
    drawText("© 2025 Trustverse AI - Automated Trust Assessment", 140, 50, 10);

    const pdfBytes = await pdfDoc.save();

    // ⭐ FINAL & CORRECT FIX → Uint8Array (supported by NextResponse)
    const uint8 = new Uint8Array(pdfBytes);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=trust_report.pdf",
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
