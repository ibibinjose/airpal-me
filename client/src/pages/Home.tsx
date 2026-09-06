import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  GraduationCap,
  Languages,
  MapPin,
  Menu,
  QrCode,
  ScanLine,
  Send,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { isDemoMode } from "../lib/app-mode";

const layers = [
  {
    path: "/demo/stay",
    kicker: "01 · Stay",
    title: "Hotel companion",
    text: "One room QR. Wi-Fi, dining, help, and what to do now — without another app.",
    tone: "peach",
  },
  {
    path: "/demo/campus",
    kicker: "02 · Campus",
    title: "College companion",
    text: "Timetable, Great Hall, night escort, and the city after class.",
    tone: "aqua",
  },
  {
    path: "/demo/tour/rocks-harbour",
    kicker: "03 · Walk",
    title: "Self-guided tours",
    text: "Map, voice at each stop, shareable link. The FreeGuides idea, from your door.",
    tone: "lilac",
  },
  {
    path: "/demo",
    kicker: "04 · OS",
    title: "Traveller operating system",
    text: "Trips with family, mates, and colleagues. Calendar sync. One timeline.",
    tone: "peach",
  },
];

function GuestPreview() {
  const [tab, setTab] = useState<"Stay" | "Walk" | "Ask">("Stay");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const copy =
    tab === "Walk"
      ? { eyebrow: "SELF-GUIDED", title: "The Rocks\nto the sails.", body: "Six stops. Voice at each one. Share the walk.", action: "Start walk" }
      : tab === "Ask"
        ? { eyebrow: "AIRPAL", title: "Ask anything.\nGet a local answer.", body: "Wi-Fi, dinner, OSHC, or a late train.", action: "Ask AirPal" }
        : { eyebrow: "ROOM 508", title: "Your stay,\nwith the city in it.", body: "Harbour Hotel · Sunday brunch is on the calendar.", action: "See 3 options" };

  return (
    <div className="phone-shell">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-topbar">
          <span className="mini-logo">
            <img src="/logo-mark.png" alt="" className="mini-mark" /> AirPal
          </span>
          <div className="topbar-actions">
            <Languages size={14} />
            <span>EN</span>
            <Bell size={15} />
          </div>
        </div>
        <div className="phone-content">
          <div className="guest-greeting">
            <span>Sunday, 6 Sep</span>
            <span className="status-dot" /> <span>Sydney</span>
          </div>
          <div className="guest-hero-copy">
            <span className="overline">{copy.eyebrow}</span>
            <h3>
              {copy.title.split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h3>
            <p>{copy.body}</p>
          </div>
          <div className="guest-action-row">
            <button
              className="dark-pill"
              onClick={() => toast.success("Open the live product", { description: "Use the buttons on the left — OS, Stay, Campus, or Walk." })}
            >
              {copy.action}
              <ArrowRight size={14} />
            </button>
            <button className="round-icon" onClick={() => toast("Saved", { description: "On the shortlist." })}>
              <Star size={15} />
            </button>
          </div>
          {tab === "Ask" ? (
            <div className="ask-box">
              <div className="ask-bubble">
                <Sparkles size={13} />
                <span>{sent ? "Great Hall dinner is 17:30–19:30. Halal line is signed." : "I know this stay, this campus, and this walk."}</span>
              </div>
              <div className="ask-input">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && message.trim() && (setSent(true), setMessage(""))}
                  placeholder="Ask a local question"
                />
                <button onClick={() => message.trim() && (setSent(true), setMessage(""))} aria-label="Send">
                  <Send size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="guest-card-grid">
              <div className="guest-card card-night">
                <div className="card-art art-night">
                  <span className="art-moon">◐</span>
                  <span className="art-line" />
                </div>
                <div>
                  <strong>{tab === "Walk" ? "Stop 1 · Hotel door" : "College brunch"}</strong>
                  <span>{tab === "Walk" ? "Then Argyle Cut" : "09:30 · Great Hall"}</span>
                </div>
              </div>
              <div className="guest-card card-coffee">
                <div className="card-art art-coffee">
                  <span>☕</span>
                </div>
                <div>
                  <strong>{tab === "Walk" ? "Hear this stop" : "Sync calendar"}</strong>
                  <span>{tab === "Walk" ? "Voice · 45 sec" : "iPhone · Gmail · Outlook"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="guest-tabs">
          {(["Stay", "Walk", "Ask"] as const).map((label) => {
            const Icon = label === "Walk" ? MapPin : label === "Ask" ? Sparkles : CalendarDays;
            return (
              <button key={label} className={tab === label ? "active" : ""} onClick={() => setTab(label)}>
                <Icon size={16} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rooms, setRooms] = useState(80);
  const hoursSaved = Math.round(rooms * 1.7);
  const monthlyRevenue = Math.round(rooms * 3.2);
  const chartData = useMemo(() => [0.68, 0.82, 0.91, 1.04, 1.12, 1.28, 1.4].map((m, i) => ({
    label: `W${i + 1}`,
    value: Math.max(30, Math.round(rooms * 0.7 * m)),
  })), [rooms]);
  const chartMax = Math.max(...chartData.map((d) => d.value), 1);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <main className={`site-shell ${isDemoMode() ? "has-app-chrome" : ""}`}>
      <nav className="nav-wrap">
        <button className="brand" onClick={() => scrollTo("top")}>
          <span className="brand-mark">
            <img src="/logo-mark.png" alt="" />
          </span>
          <span>
            AirPal<span className="brand-dot">.</span>me
          </span>
        </button>
        <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <button onClick={() => scrollTo("product")}>Product</button>
          <button onClick={() => scrollTo("walks")}>Walks</button>
          <button onClick={() => scrollTo("hosts")}>For hosts</button>
          <button onClick={() => setLocation("/auth")}>Sign in</button>
          <button className="nav-cta" onClick={() => setLocation("/start")}>
            Start free <ArrowRight size={15} />
          </button>
        </div>
        <button className="mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <section id="top" className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow-pill">
              <span className="pulse-dot" /> TRAVEL SMARTER TOGETHER
            </div>
            <h1>
              The traveller’s
              <br />
              <em>operating system.</em>
            </h1>
            <p className="hero-lede">
              One QR for the hotel or the college. Then walks, calendar, and the people you travel with — not another search engine.
            </p>
            <div className="hero-actions">
              <button className="button-primary" onClick={() => setLocation("/start")}>
                Create your property <ArrowRight size={17} />
              </button>
              <button className="button-quiet" onClick={() => setLocation("/scan")}>
                I have a QR
              </button>
              <button className="button-quiet" onClick={() => setLocation("/demo")}>
                Try the demo
              </button>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span className="avatar av-1">N</span>
                <span className="avatar av-2">M</span>
                <span className="avatar av-3">H</span>
                <span className="avatar av-4">+</span>
              </div>
              <div>
                <div className="stars">
                  ★★★★★ <b>4.9</b>
                </div>
                <span>Stays, campuses, and locals on one layer</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-a" />
            <div className="hero-orbit orbit-b" />
            <div className="hero-note note-a">
              <ScanLine size={15} />
              <span>
                One QR.
                <br />
                <b>Hotel or campus.</b>
              </span>
            </div>
            <div className="hero-note note-b">
              <MapPin size={15} />
              <span>
                Walks you can
                <br />
                <b>share.</b>
              </span>
            </div>
            <GuestPreview />
          </div>
        </div>
      </section>

      <section id="how" className="platform-section section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>
              Hosts sign up.
              <br />
              <em>Guests only scan.</em>
            </h2>
          </div>
          <p>AirPal is not an account for every traveller. The host creates the stay. The QR on the desk is the guest’s login.</p>
        </div>
        <div className="feature-grid">
          <button className="feature-card peach" onClick={() => setLocation("/start")}>
            <div className="feature-top"><span className="feature-number">01</span></div>
            <h3>Host creates a property</h3>
            <p>Hotel or college. Name, city, Wi-Fi. That’s the only account AirPal needs.</p>
          </button>
          <button className="feature-card aqua" onClick={() => setLocation("/start")}>
            <div className="feature-top"><span className="feature-number">02</span></div>
            <h3>Print the QR</h3>
            <p>Room, lobby, or college gate. Edit Wi-Fi and menus later — the printed code stays the same.</p>
          </button>
          <button className="feature-card lilac" onClick={() => setLocation("/scan")}>
            <div className="feature-top"><span className="feature-number">03</span></div>
            <h3>Guest scans</h3>
            <p>No signup. Camera on the desk QR, or paste the guest link. That’s the whole login.</p>
          </button>
        </div>
        <div className="hero-actions" style={{ marginTop: 22 }}>
          <button className="button-primary" onClick={() => setLocation("/start")}>
            I’m a host <ArrowRight size={16} />
          </button>
          <button className="button-quiet" onClick={() => setLocation("/scan")}>
            I have a QR
          </button>
        </div>
      </section>

      <section id="product" className="platform-section section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE LAYER</span>
            <h2>
              Stay, campus, walk,
              <br />
              <em>same companion.</em>
            </h2>
          </div>
          <p>Scan a room, a college gate, or a poster. AirPal is the OS behind it — Wi-Fi, timetable, voice at the next stop, calendar on your phone.</p>
        </div>
        <div className="feature-grid home-layer-grid">
          {layers.map((layer) => (
            <button key={layer.path} className={`feature-card ${layer.tone}`} onClick={() => setLocation(layer.path)}>
              <div className="feature-top">
                <span className="feature-number">{layer.kicker}</span>
              </div>
              <h3>{layer.title}</h3>
              <p>{layer.text}</p>
              <span className="feature-link">
                Open sample <ArrowRight size={15} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="walks" className="story-section section-pad">
        <div className="story-copy" style={{ order: 0 }}>
          <span className="eyebrow">WALKS & PROFILES</span>
          <h2>
            A public page
            <br />
            <em>for the people who know.</em>
          </h2>
          <p>
            Hotels, colleges, and locals get a shareable profile — walks, follow, QR — the FreeGuides idea, kept on the stay. Not a marketplace of every city. The walks that belong here.
          </p>
          <div className="check-list">
            <div>
              <span>
                <Check size={13} />
              </span>
              <p>
                <b>Self-guided, no app</b>
                <small>Map, voice, Google walking directions, copy link.</small>
              </p>
            </div>
            <div>
              <span>
                <Check size={13} />
              </span>
              <p>
                <b>Calendar you already use</b>
                <small>iPhone, Gmail, Outlook, or a .ics file.</small>
              </p>
            </div>
            <div>
              <span>
                <Check size={13} />
              </span>
              <p>
                <b>Profiles you can pin</b>
                <small>Hotel, college, or a local — one URL for every walk.</small>
              </p>
            </div>
          </div>
          <div className="hero-actions" style={{ marginTop: 8 }}>
            <button className="text-button" onClick={() => setLocation("/tour/rocks-harbour")}>
              The Rocks walk <ArrowRight size={16} />
            </button>
            <button className="text-button" onClick={() => setLocation("/u/nisha-sydney")}>
              Nisha’s profile <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="story-art">
          <div className="story-photo home-walk-photo" />
          <div className="story-stamp">
            <QrCode size={22} />
            <span>
              SCAN ONCE
              <br />
              <b>WALK ANYTIME</b>
            </span>
          </div>
          <div className="story-caption">
            <span>02</span>
            <span>
              HARBOUR HOTEL · NISHA · HARBOUR COLLEGE
              <br />
              PUBLIC PAGES, SAME OS
            </span>
          </div>
        </div>
      </section>

      <section id="hosts" className="calculator-section section-pad">
        <div className="calculator-card">
          <div className="calculator-copy">
            <span className="eyebrow">FOR HOSTS</span>
            <h2>
              Front desk quieter.
              <br />
              <em>Guests still held.</em>
            </h2>
            <p>The same QR sells the stay, the walk, and the calendar. Staff get fewer 2am Wi-Fi questions. Guests get a city that feels recommended, not searched.</p>
            <div className="calculator-control">
              <div className="control-label">
                <span>Rooms or beds</span>
                <strong>{rooms}</strong>
              </div>
              <input
                aria-label="Rooms or beds"
                type="range"
                min="10"
                max="300"
                step="5"
                value={rooms}
                style={{ "--range": `${((rooms - 10) / 290) * 100}%` } as CSSProperties}
                onChange={(e) => setRooms(Number(e.target.value))}
              />
              <div className="range-labels">
                <span>10</span>
                <span>300</span>
              </div>
            </div>
          </div>
          <div className="calculator-results">
            <div className="result-heading">
              <span>DIRECTIONAL, FOR A PROPERTY THIS SIZE</span>
            </div>
            <div className="metric-row">
              <div>
                <strong>
                  {hoursSaved}
                  <small> hrs</small>
                </strong>
                <small>front desk time / month</small>
              </div>
              <div>
                <strong>${monthlyRevenue}+</strong>
                <small>upsell potential / month</small>
              </div>
            </div>
            <div className="mini-chart">
              <div className="chart-label">
                <span>Illustrative weekly lift</span>
                <b>Stay + walk</b>
              </div>
              <div className="bars">
                {chartData.map((point) => (
                  <i key={point.label} style={{ height: `${Math.max(12, (point.value / chartMax) * 100)}%` }} />
                ))}
              </div>
            </div>
            <button className="text-button" style={{ marginTop: 18 }} onClick={() => setLocation("/start")}>
              Create your property <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <section className="final-cta section-pad">
        <div className="final-inner">
          <span className="eyebrow">ONE QR</span>
          <h2>
            Hotel, college, or
            <br />
            <em>the walk from the door.</em>
          </h2>
          <p>Hosts sign up. Guests only scan. The Harbour Hotel sample lives on the demo.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <button className="button-primary light" onClick={() => setLocation("/start")}>
              Create your property <ArrowRight size={17} />
            </button>
            <button className="button-quiet" onClick={() => setLocation("/demo")}>
              Try the demo
            </button>
          </div>
          <div className="final-note">
            <GraduationCap size={14} /> Travel smarter together
          </div>
        </div>
        <div className="final-orb orb-one" />
        <div className="final-orb orb-two" />
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <button className="brand inverse" onClick={() => scrollTo("top")}>
            <span className="brand-mark">
              <img src="/logo-mark.png" alt="" />
            </span>
            <span>
              AirPal<span className="brand-dot">.</span>me
            </span>
          </button>
          <p>Travel smarter together.</p>
        </div>
        <div className="footer-links">
          <div>
            <b>Product</b>
            <button onClick={() => setLocation("/start")}>Create a property</button>
            <button onClick={() => setLocation("/scan")}>Scan a QR</button>
            <button onClick={() => setLocation("/demo")}>Open demo</button>
            <button onClick={() => setLocation("/tour/rocks-harbour")}>Walks</button>
          </div>
          <div>
            <b>People</b>
            <button onClick={() => setLocation("/u/harbour-hotel")}>Harbour Hotel</button>
            <button onClick={() => setLocation("/u/nisha-sydney")}>Nisha</button>
            <button onClick={() => setLocation("/u/harbour-college")}>Harbour College</button>
          </div>
          <div>
            <b>Hosts</b>
            <button onClick={() => setLocation("/start")}>Start free</button>
            <button onClick={() => setLocation("/auth")}>Sign in</button>
            <button onClick={() => setLocation("/host")}>Dashboard</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AirPal.me</span>
          <span>For stays, campuses, and the people you go with.</span>
        </div>
      </footer>
    </main>
  );
}
