import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Check, Copy, QrCode, Share2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { getGuideProfile, getWalkingTour } from "@shared/tours";
import { makeQrDataUrl } from "../lib/qr";
import { DeviceStage } from "../components/os/DeviceStage";
import { useAirPal } from "../contexts/AirPalContext";
import { isNativeShell } from "../lib/platform";

export const GuideProfilePage: React.FC<{ params?: { profileId?: string } }> = ({ params }) => {
  const { deviceMode } = useAirPal();
  const [, setLocation] = useLocation();
  const profile = getGuideProfile(params?.profileId || "harbour-hotel");
  const tours = profile.tourIds.map(getWalkingTour);
  const [followed, setFollowed] = useState(false);
  const [qr, setQr] = useState("");
  const href = typeof window === "undefined" ? `/u/${profile.id}` : `${window.location.origin}/u/${profile.id}`;

  useEffect(() => {
    void makeQrDataUrl(href).then(setQr);
  }, [href]);

  const copy = async () => {
    await navigator.clipboard.writeText(href);
    toast.success("Profile link copied", { description: "Paste it on Instagram, WhatsApp, or a poster." });
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: profile.name, text: profile.bio, url: href });
        return;
      } catch {
        /* fall through */
      }
    }
    await copy();
  };

  const kindLabel = profile.kind === "hotel" ? "Property" : profile.kind === "campus" ? "Campus" : "Local";

  const content = (
    <div className="relative h-full min-h-0 flex flex-col overflow-hidden bg-[#f9f8f4] text-[#16211c]">
      <div className="guest-scroll flex-1 px-5 pt-6 pb-8 space-y-5">
        <section className="text-center space-y-3">
          <div className="mx-auto grid place-items-center w-20 h-20 rounded-full bg-[#18271f] text-[#fffdf8] ap-display text-2xl">
            {profile.initials}
          </div>
          <div>
            <p className="ap-kicker">{kindLabel} · {profile.city}</p>
            <h1 className="ap-display text-[28px] leading-tight">{profile.name}</h1>
            <p className="text-sm text-[#5a6b62] mt-2 leading-relaxed">{profile.bio}</p>
          </div>
          <div className="flex justify-center gap-4 text-[11px] text-[#7a877f]">
            <span>
              <strong className="text-[#16211c]">{profile.walks}</strong> walks
            </span>
            <span>
              <strong className="text-[#16211c]">{followed ? Number(profile.followers) + 1 : profile.followers}</strong> following
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {profile.languages.map((lang) => (
              <span key={lang} className="px-2.5 py-1 rounded-full bg-white border border-[#e3e9e1] text-[10px]">
                {lang}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFollowed((v) => !v);
                toast.success(followed ? "Unfollowed" : "Following", { description: followed ? undefined : `You’ll see ${profile.name}’s walks.` });
              }}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-semibold ${
                followed ? "bg-[#dceee4] text-[#2d7a55]" : "bg-[#18271f] text-white"
              }`}
            >
              {followed ? <Check size={14} /> : <UserPlus size={14} />}
              {followed ? "Following" : "Follow"}
            </button>
            <button onClick={share} className="ap-icon-btn" aria-label="Share profile">
              <Share2 size={15} />
            </button>
            <button onClick={copy} className="ap-icon-btn" aria-label="Copy profile link">
              <Copy size={15} />
            </button>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="ap-display text-lg">Walks</h2>
          {tours.map((tour) => (
            <button
              key={tour.id}
              onClick={() => setLocation(`/tour/${tour.id}`)}
              className="w-full text-left ap-card p-4"
            >
              <span className="ap-kicker">{tour.city} · {tour.duration}</span>
              <h3 className="font-bold text-sm mt-0.5">{tour.title}</h3>
              <p className="text-[11px] text-[#7a877f] mt-1">{tour.tagline}</p>
            </button>
          ))}
        </section>

        {(profile.stayPath || profile.campusPath) && (
          <section className="grid grid-cols-2 gap-2">
            {profile.stayPath && (
              <button onClick={() => setLocation(profile.stayPath!)} className="ap-card p-3.5 text-left text-xs font-semibold">
                Open stay
              </button>
            )}
            {profile.campusPath && (
              <button onClick={() => setLocation(profile.campusPath!)} className="ap-card p-3.5 text-left text-xs font-semibold">
                Open campus
              </button>
            )}
          </section>
        )}

        <section className="ap-card p-4 flex items-center gap-3">
          {qr ? <img src={qr} alt={`${profile.name} QR`} className="w-24 h-24 rounded-xl border border-[#e3e9e1]" /> : <div className="w-24 h-24 rounded-xl bg-[#f3f6f1]" />}
          <div className="min-w-0">
            <span className="ap-kicker inline-flex items-center gap-1">
              <QrCode size={11} /> Profile QR
            </span>
            <p className="text-xs text-[#5a6b62] mt-1 leading-relaxed">
              Stick this on a poster or Instagram. One scan opens every walk from {profile.name}.
            </p>
          </div>
        </section>
      </div>
    </div>
  );

  if (isNativeShell()) return content;
  return <DeviceStage mode={deviceMode}>{content}</DeviceStage>;
};
