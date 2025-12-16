"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";

export default function QRTrustBadge({
  username,
  displayName,
  trustScore,
}: {
  username: string;
  displayName: string;
  trustScore: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setProfileUrl(`${window.location.origin}/profile/${username}`);
  }, [username]);

  if (!mounted) return null;

  const downloadBadge = async () => {
    if (!badgeRef.current) return;

    const dataUrl = await toPng(badgeRef.current, {
      cacheBust: true,
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = `trust-badge-${username}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-6">
      {/* BADGE CONTENT */}
      <div
        ref={badgeRef}
        className="rounded-xl border bg-white p-6 text-center space-y-4"
      >
        <h3 className="text-lg font-bold">{displayName}</h3>

        <div className="flex justify-center">
          <QRCodeCanvas
            value={profileUrl}
            size={160}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin
          />
        </div>

        <p className="text-sm font-medium text-gray-700">
          Trust Score: {trustScore}/100
        </p>

        <p className="text-xs text-gray-400 break-all">
          {profileUrl}
        </p>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadBadge}
        className="w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white hover:bg-gray-900 transition"
      >
        ⬇ Download Trust QR Badge
      </button>
    </div>
  );
}
