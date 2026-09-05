import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, ImagePlus, X } from "lucide-react";
import { CompanionSheet } from "../companion/CompanionSheet";
import { parseQrPayload, type QrIntent } from "../../lib/qr";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onResult: (intent: QrIntent) => void;
}

export function QrScanSheet({ isOpen, onClose, onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onResultRef = useRef(onResult);
  const onCloseRef = useRef(onClose);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  onResultRef.current = onResult;
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let dead = false;

    const tick = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" });
      if (code?.data) {
        onResultRef.current(parseQrPayload(code.data));
        onCloseRef.current();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((got) => {
        if (dead) {
          got.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = got;
        setActive(true);
        setError(null);
        if (videoRef.current) {
          videoRef.current.srcObject = got;
          void videoRef.current.play();
        }
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {
        setError("Camera blocked. Upload a QR photo instead.");
        setActive(false);
      });

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      setActive(false);
    };
  }, [isOpen]);

  const onFile = async (file: File) => {
    const bmp = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bmp, 0, 0);
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(image.data, image.width, image.height);
    if (!code?.data) {
      setError("No QR found in that photo.");
      return;
    }
    onResultRef.current(parseQrPayload(code.data));
    onCloseRef.current();
  };

  return (
    <CompanionSheet isOpen={isOpen}>
      <div className="h-full min-h-0 flex flex-col bg-[#111]">
        <div className="flex items-center justify-between px-4 py-3 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Camera size={16} />
            Scan AirPal QR
          </div>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 rounded-full bg-white/10" aria-label="Close scanner">
            <X size={16} />
          </button>
        </div>
        <div className="relative flex-1 min-h-0 bg-black">
          <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
          <div className="pointer-events-none absolute inset-16 border-2 border-amber-400/80 rounded-3xl" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="p-4 space-y-2 bg-[#161616] text-white">
          {error && <p className="text-xs text-amber-300">{error}</p>}
          <p className="text-[11px] text-white/70">
            {active ? "Point at a hotel, campus, or trip QR. It opens inside AirPal." : "Use the camera, or upload a still."}
          </p>
          <label className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#16211c] text-xs font-semibold">
            <ImagePlus size={14} />
            Upload QR photo
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && void onFile(e.target.files[0])} />
          </label>
        </div>
      </div>
    </CompanionSheet>
  );
}
