import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Globe2,
  Headphones,
  Languages,
  MapPin,
  Menu,
  MessageCircle,
  QrCode,
  ScanLine,
  Send,
  Sparkles,
  ShieldCheck,
  Star,
  Ticket,
  Utensils,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const features = [
  { icon: MessageCircle, title: "Air concierge", text: "Instant answers to check-in, Wi-Fi, transport, and the questions that arrive at 2am.", tone: "peach" },
  { icon: MapPin, title: "Local, made personal", text: "Turn your team's favourite cafés, beaches, and hidden corners into a living city guide.", tone: "aqua" },
  { icon: CalendarDays, title: "More to do", text: "Sell experiences, events, and upgrades from the same beautiful guest hub.", tone: "lilac" },
];

const capabilityTabs = [
  { id: "compendium", label: "Compendium", icon: BedDouble, kicker: "THE DIGITAL WELCOME BOOK", title: "Everything guests ask for,\nright at their fingertips.", description: "Turn your property knowledge into a beautiful, searchable guest hub — check-in, Wi-Fi, menus, house rules, transport, and more.", items: ["Digital compendium", "Check-in & house info", "Menus, Wi-Fi & transport", "Works on any phone"] },
  { id: "concierge", label: "AI concierge", icon: Sparkles, kicker: "ELI, YOUR 24/7 RECEPTIONIST", title: "Answers at 2am,\nwithout the wake-up call.", description: "AirPal answers in the guest's language, knows your property, and escalates the moments that truly need a human.", items: ["AI receptionist", "100+ auto-translated languages", "Smart staff escalation", "GDPR-conscious by design"] },
  { id: "local", label: "Local discovery", icon: MapPin, kicker: "MORE LOCAL", title: "Your neighbourhood,\nthrough your eyes.", description: "Curate favourite cafés, bars, beaches, and hidden gems — then turn them into self-guided walking tours guests can follow.", items: ["Curated local map", "Self-guided walking tours", "Tour stop details", "Hotel & hostel modes"] },
  { id: "social", label: "Social & events", icon: MessageCircle, kicker: "MORE SOCIAL", title: "Turn a stay into\na shared experience.", description: "Give guests a safe place to meet, discover tonight's events, and book tickets without another app or login.", items: ["Guest group chat", "Profiles & moderation", "Events & ticketing", "Stripe-ready payments"] },
  { id: "revenue", label: "Experiences", icon: Ticket, kicker: "MORE PROFITABLE", title: "Make it easy to\nsay yes to more.", description: "Sell local activities, spa treatments, tours, and upgrades from the guest hub — with commission-ready partner links.", items: ["Bookable experiences", "GetYourGuide connections", "ExperienceOz & Blys", "Commission revenue"] },
  { id: "insights", label: "Host insights", icon: BarChart3, kicker: "YOUR QUIET ADVANTAGE", title: "See what guests\ncare about most.", description: "A clear analytics layer shows what guests ask, read, book, and share — so every stay gets smarter.", items: ["Analytics dashboard", "Question trends", "Booking performance", "Review lift signals"] },
];

const guestTabs = [
  { label: "Explore", icon: MapPin },
  { label: "Ask AirPal", icon: Sparkles },
  { label: "Events", icon: CalendarDays },
];

function GuestPreview() {
  const [activeTab, setActiveTab] = useState("Explore");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const content = useMemo(() => {
    if (activeTab === "Ask AirPal") {
      return { eyebrow: "AIRPAL AI", title: "Ask anything.\nGet local answers.", body: "Try: Where can I find a late dinner nearby?", action: "Ask AirPal" };
    }
    if (activeTab === "Events") {
      return { eyebrow: "TONIGHT IN SYDNEY", title: "Make the most\nof your stay.", body: "Three hand-picked ways to spend your evening.", action: "See events" };
    }
    return { eyebrow: "WELCOME TO THE NEIGHBOURHOOD", title: "Your stay,\nwith local flavour.", body: "A pocket-sized guide to the places worth leaving the hotel for.", action: "Explore nearby" };
  }, [activeTab]);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    toast.success("AirPal is on it", { description: "A local recommendation is ready for your guest." });
  };

  return (
    <div className="phone-shell">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-topbar">
          <span className="mini-logo"><span className="logo-spark">✦</span> airpal</span>
          <div className="topbar-actions"><Languages size={14} /><span>EN</span><Bell size={15} /></div>
        </div>
        <div className="phone-content">
          <div className="guest-greeting"><span>Thursday, 14 March</span><span className="status-dot" /> <span>Room 204</span></div>
          <div className="guest-hero-copy"><span className="overline">{content.eyebrow}</span><h3>{content.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h3><p>{content.body}</p></div>
          <div className="guest-action-row"><button className="dark-pill" onClick={() => toast.success("Demo action opened", { description: "In the full product, this opens the guest journey." })}>{content.action}<ArrowRight size={14} /></button><button className="round-icon" onClick={() => toast("Saved for later", { description: "Your guest's shortlist is ready." })}><Star size={15} /></button></div>
          <div className="guest-card-grid">
            <div className="guest-card card-night"><div className="card-art art-night"><span className="art-moon">◐</span><span className="art-line" /></div><div><strong>Night markets</strong><span>12 min walk · $$</span></div></div>
            <div className="guest-card card-coffee"><div className="card-art art-coffee"><span>☕</span></div><div><strong>Good coffee</strong><span>4 local favourites</span></div></div>
          </div>
          {activeTab === "Ask AirPal" && <div className="ask-box"><div className="ask-bubble"><Sparkles size={13} /><span>{sent ? "I found a late-night favourite 7 minutes away — want the details?" : "Hi, I’m AirPal. I know this neighbourhood well."}</span></div><div className="ask-input"><input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Ask a local question" /><button onClick={handleSend} aria-label="Send"><Send size={14} /></button></div></div>}
          {activeTab === "Events" && <div className="event-mini"><span className="event-time">7:30 PM</span><div><strong>Rooftop film club</strong><span>Under the stars · 8 spots left</span></div><ArrowRight size={15} /></div>}
        </div>
        <div className="guest-tabs">{guestTabs.map(({ label, icon: Icon }) => <button key={label} className={activeTab === label ? "active" : ""} onClick={() => setActiveTab(label)}><Icon size={16} /><span>{label}</span></button>)}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rooms, setRooms] = useState(80);
  const [showDemo, setShowDemo] = useState(false);
  const [chartMetric, setChartMetric] = useState<"revenue" | "hours">("revenue");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [activeCapability, setActiveCapability] = useState("compendium");
  const monthlyRevenue = Math.round(rooms * 3.2);
  const hoursSaved = Math.round(rooms * 1.7);
  const chartData = useMemo(() => {
    const multipliers = [0.68, 0.82, 0.91, 1.04, 1.12, 1.28, 1.4];
    return multipliers.map((multiplier, index) => ({
      label: `W${index + 1}`,
      revenue: Math.max(30, Math.round(rooms * 0.7 * multiplier)),
      hours: Math.max(8, Math.round(rooms * 0.31 * multiplier)),
      questions: Math.max(24, Math.round(rooms * 3.1 * multiplier)),
    }));
  }, [rooms]);
  const activeSeries = chartData.map((point) => chartMetric === "revenue" ? point.revenue : point.hours);
  const chartMax = Math.max(...activeSeries, 1);
  const chartAverage = Math.round(activeSeries.reduce((sum, value) => sum + value, 0) / activeSeries.length);
  const currency = (value: number) => `$${value}`;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const notifyComingSoon = (label: string) => toast(label, { description: "This demo flow is ready for your next product sprint." });

  return (
    <main className="site-shell has-app-chrome">
      <nav className="nav-wrap">
        <button className="brand" onClick={() => scrollTo("top")}><span className="brand-mark">✦</span><span>airpal<span className="brand-dot">.</span>me</span></button>
        <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <button onClick={() => scrollTo("platform-suite")}>Platform <ChevronDown size={14} /></button>
          <button onClick={() => scrollTo("why-airpal")}>Why AirPal</button>
          <button onClick={() => scrollTo("calculator")}>ROI calculator</button>
          <button onClick={() => setLocation("/host")}>Hotel dashboard</button>
          <button className="nav-cta" onClick={() => setLocation("/stay")}>See the guest view <ArrowRight size={15} /></button>
        </div>
        <button className="mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>
      </nav>

      <section id="top" className="hero-section">
        <div className="hero-glow glow-one" /><div className="hero-glow glow-two" />
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow-pill"><span className="pulse-dot" /> THE DIGITAL GUEST EXPERIENCE, REIMAGINED</div>
            <h1>Make every stay<br /><em>feel like a local secret.</em></h1>
            <p className="hero-lede">AirPal gives your guests one beautifully simple place to ask, explore, book, and belong — before, during, and after their stay.</p>
            <div className="hero-actions"><button className="button-primary" onClick={() => setLocation("/stay")}>Open the guest experience <ArrowRight size={17} /></button><button className="button-quiet" onClick={() => scrollTo("platform")}><span className="play-ring">▶</span> See how it works</button></div>
            <div className="hero-proof"><div className="avatar-stack"><span className="avatar av-1">M</span><span className="avatar av-2">J</span><span className="avatar av-3">L</span><span className="avatar av-4">+</span></div><div><div className="stars">★★★★★ <b>4.9</b></div><span>Loved by independent stays</span></div></div>
          </div>
          <div className="hero-visual"><div className="hero-orbit orbit-a" /><div className="hero-orbit orbit-b" /><div className="hero-note note-a"><ScanLine size={15} /><span>One QR.<br /><b>Every answer.</b></span></div><div className="hero-note note-b"><Globe2 size={15} /><span>100+ languages<br /><b>Auto-detected</b></span></div><GuestPreview /><div className="sparkle s1">✦</div><div className="sparkle s2">✧</div></div>
        </div>
        <div className="trust-strip"><span>TRUSTED BY TEAMS WHO CARE ABOUT THE DETAILS</span><div className="trust-logos"><b>OAK &amp; IVY</b><b>goodstay</b><b>ROOMERS</b><b>◒ northstar</b><b>the local</b></div></div>
      </section>

      <section id="platform" className="platform-section section-pad">
        <div className="section-heading"><div><span className="eyebrow">A BETTER GUEST JOURNEY</span><h2>Everything they need.<br /><em>Nothing they need to download.</em></h2></div><p>From the first scan to the last review, AirPal makes your property feel more thoughtful — and your team's day feel a lot lighter.</p></div>
        <div className="feature-grid">{features.map(({ icon: Icon, title, text, tone }, index) => <button className={`feature-card ${tone}`} key={title} onClick={() => notifyComingSoon(`${title} preview`) }><div className="feature-top"><span className="feature-number">0{index + 1}</span><span className="feature-icon"><Icon size={21} /></span></div><h3>{title}</h3><p>{text}</p><span className="feature-link">Explore feature <ArrowRight size={15} /></span></button>)}</div>
      </section>

      <section id="platform-suite" className="capability-section section-pad"><div className="capability-heading"><div><span className="eyebrow">THE FULL AIRPAL PLATFORM</span><h2>One QR code.<br /><em>A complete guest experience.</em></h2></div><p>No app. No login. No language barrier. Every capability lives in one place your guests can open in seconds.</p></div><div className="capability-shell"><div className="capability-tabs" role="tablist" aria-label="AirPal platform capabilities">{capabilityTabs.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={activeCapability === id} className={activeCapability === id ? "active" : ""} onClick={() => setActiveCapability(id)}><Icon size={16} /><span>{label}</span><ArrowRight size={14} /></button>)}</div>{capabilityTabs.filter((capability) => capability.id === activeCapability).map(({ id, kicker, title, description, items, icon: Icon }) => <div className={`capability-panel capability-${id}`} key={id}><div className="capability-panel-copy"><span className="eyebrow">{kicker}</span><h3>{title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h3><p>{description}</p><div className="capability-list">{items.map((item) => <span key={item}><Check size={13} />{item}</span>)}</div><button className="text-button" onClick={() => notifyComingSoon(`${kicker} demo`)}>Preview this capability <ArrowRight size={15} /></button></div><div className="capability-visual"><div className="visual-grid" />{id === "compendium" && <div className="dashboard-card compendium-visual"><div className="dash-top"><span className="mini-logo"><span className="logo-spark">✦</span> airpal</span><span className="dash-pill">ROOM 204</span></div><div className="dash-welcome">Welcome to<br /><b>Harbour House</b></div><div className="dash-menu"><span><BedDouble size={14} /> Your stay</span><span><Utensils size={14} /> Eat & drink</span><span><MapPin size={14} /> Explore Sydney</span><span><Headphones size={14} /> Ask AirPal</span></div></div>}{id === "concierge" && <div className="dashboard-card concierge-visual"><div className="chat-header"><span className="airpal-avatar"><Sparkles size={14} /></span><span><b>AirPal concierge</b><small>Always on · Replies instantly</small></span><span className="online-dot" /></div><div className="chat-thread"><div className="chat-msg guest-msg">Where can I get a late dinner nearby?</div><div className="chat-msg airpal-msg">Try Bar Ombra — 7 minutes away and open until midnight. Want me to send the map?</div></div><div className="language-chip"><Languages size={13} /> Detected: English · 100+ supported</div></div>}{id === "local" && <div className="dashboard-card map-visual"><div className="map-top"><span>SYDNEY, YOUR WAY</span><MapPin size={15} /></div><div className="map-art"><span className="map-pin pin-a">✦</span><span className="map-pin pin-b">✦</span><span className="map-pin pin-c">✦</span><div className="map-route" /></div><div className="map-stop"><span className="stop-photo">☕</span><span><b>Three Blue Ducks</b><small>Good coffee · 8 min walk</small></span><ArrowRight size={14} /></div></div>}{id === "social" && <div className="dashboard-card social-visual"><div className="event-banner"><span className="event-date">FRI<br /><b>14</b></span><span><small>TONIGHT · 7:30 PM</small><b>Rooftop film club</b></span><Ticket size={21} /></div><div className="people-row"><span className="avatar av-1">M</span><span className="avatar av-2">J</span><span className="avatar av-3">L</span><span className="avatar av-4">+</span><span>18 guests are going</span></div><div className="social-message"><MessageCircle size={14} /><span><b>Guest group chat</b><small>“Anyone up for sunset drinks?”</small></span></div></div>}{id === "revenue" && <div className="dashboard-card revenue-visual"><div className="booking-head"><span>BOOKABLE EXPERIENCES</span><b>THIS MONTH</b></div><div className="experience-row"><span className="experience-icon">◒</span><span><b>Sunset kayak tour</b><small>3 spots · from $54</small></span><strong>+ $42</strong></div><div className="experience-row"><span className="experience-icon orange">☼</span><span><b>Day spa ritual</b><small>Wellness · from $89</small></span><strong>+ $67</strong></div><div className="revenue-total"><span>Potential commission</span><b>$1,240</b></div></div>}{id === "insights" && <div className="dashboard-card insights-visual"><div className="insights-head"><span>GUEST INSIGHTS</span><b>Last 30 days</b></div><div className="insight-number"><b>+34%</b><span>more local guide opens</span></div><div className="insight-bars"><i style={{ height: "35%" }} /><i style={{ height: "50%" }} /><i style={{ height: "47%" }} /><i style={{ height: "68%" }} /><i style={{ height: "60%" }} /><i style={{ height: "86%" }} /><i style={{ height: "98%" }} /></div><div className="insight-axis"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span></div><div className="insight-foot"><span><span className="legend-swatch" /> Local discovery</span><span><span className="legend-swatch warm" /> Bookings</span></div></div>}</div></div>)}</div><div className="capability-badges"><span><QrCode size={16} /> Wooden QR stands</span><span><ScanLine size={16} /> Large & small stickers</span><span><Globe2 size={16} /> 100+ languages</span><span><ShieldCheck size={16} /> GDPR-conscious</span></div></section><section id="why-airpal" className="story-section section-pad"><div className="story-art"><div className="story-photo" style={{ backgroundImage: "url('/manus-storage/airpal-local_458f0159.jpg')" }} /><div className="story-stamp"><QrCode size={22} /><span>SCAN ONCE<br /><b>STAY CURIOUS</b></span></div><div className="story-caption"><span>01</span><span>THE BEST LOCAL TIP<br />IS THE ONE YOU'D NEVER GOOGLE</span></div></div><div className="story-copy"><span className="eyebrow">THE AIRPAL DIFFERENCE</span><h2>A warmer welcome,<br /><em>on autopilot.</em></h2><p>Printed binders get ignored. Generic apps get deleted. AirPal feels like a recommendation from someone who knows the neighbourhood — because it is.</p><div className="check-list"><div><span><Check size={13} /></span><p><b>Feels like your brand</b><small>Bring your voice, values, and local point of view to every screen.</small></p></div><div><span><Check size={13} /></span><p><b>Works in every language</b><small>Auto-translate your compendium, concierge, and group chat instantly.</small></p></div><div><span><Check size={13} /></span><p><b>Gets better every day</b><small>See what guests ask for, love, and book — then make it yours.</small></p></div></div><button className="text-button" onClick={() => setShowDemo(true)}>Tour the guest experience <ArrowRight size={16} /></button></div></section>

      <section id="calculator" className="calculator-section section-pad"><div className="calculator-card"><div className="calculator-copy"><span className="eyebrow">THE QUIET ROI</span><h2>Let your team<br /><em>be more present.</em></h2><p>Less time answering the same questions. More time creating the kind of stay people tell their friends about.</p><div className="calculator-control"><div className="control-label"><span>Rooms or beds</span><strong>{rooms}</strong></div><input aria-label="Rooms or beds" type="range" min="10" max="300" step="5" value={rooms} style={{ "--range": `${((rooms - 10) / 290) * 100}%` } as CSSProperties} onChange={(e) => setRooms(Number(e.target.value))} /><div className="range-labels"><span>10</span><span>300</span></div></div><div className="calculator-assumption"><span className="assumption-dot"><Sparkles size={11} /></span><span>Estimates use a conservative <b>3.2% monthly upsell rate</b> and 1.7 hours saved per room.</span></div></div><div className="calculator-results"><div className="result-heading"><span>FOR A PROPERTY YOUR SIZE</span><button className="info-dot" aria-label="How are these estimates calculated?">i<span className="inline-tooltip">Estimates are directional planning numbers, not a promise of revenue.</span></button></div><div className="metric-row"><div className="metric-card"><div className="metric-topline"><strong>{hoursSaved}<small> hrs</small></strong><button className="info-dot" aria-label="How are time savings calculated?">i<span className="inline-tooltip">Based on 1.7 front-desk hours reclaimed per room or bed each month.</span></button></div><span>front desk time reclaimed / month</span></div><div className="metric-card"><div className="metric-topline"><strong>{currency(monthlyRevenue)}<small>+</small></strong><button className="info-dot" aria-label="How are upsell estimates calculated?">i<span className="inline-tooltip">Based on 3.2% monthly upsell potential across rooms or beds.</span></button></div><span>potential monthly upsell revenue</span></div></div><div className="mini-chart"><div className="chart-header"><div><span className="chart-title">Potential impact over time</span><span className="chart-subtitle">Illustrative weekly trend · average {chartMetric === "revenue" ? currency(chartAverage) : `${chartAverage} hrs`}</span></div><div className="chart-switcher" role="group" aria-label="Choose chart metric"><button className={chartMetric === "revenue" ? "active" : ""} onClick={() => { setChartMetric("revenue"); setHoveredPoint(null); }}>Revenue</button><button className={chartMetric === "hours" ? "active" : ""} onClick={() => { setChartMetric("hours"); setHoveredPoint(null); }}>Time saved</button></div></div><div className="chart-wrap"><div className="chart-y-labels"><span>{chartMetric === "revenue" ? currency(chartMax) : `${chartMax}h`}</span><span>{chartMetric === "revenue" ? currency(Math.round(chartMax / 2)) : `${Math.round(chartMax / 2)}h`}</span><span>0</span></div><div className="dynamic-chart" role="img" aria-label={`${chartMetric === "revenue" ? "Potential revenue" : "Front desk hours saved"} trend across seven weeks`}><div className="chart-grid-lines"><i /><i /><i /></div><div className="chart-bars">{chartData.map((point, index) => { const value = activeSeries[index]; return <button key={point.label} className={`chart-bar-group ${hoveredPoint === index ? "is-hovered" : ""}`} aria-label={`${point.label}: ${chartMetric === "revenue" ? currency(point.revenue) : `${point.hours} hours saved`}`} onMouseEnter={() => setHoveredPoint(index)} onMouseLeave={() => setHoveredPoint(null)} onFocus={() => setHoveredPoint(index)} onBlur={() => setHoveredPoint(null)}><span className="chart-bar-value">{hoveredPoint === index ? (chartMetric === "revenue" ? currency(value) : `${value}h`) : ""}</span><span className="chart-bar" style={{ height: `${Math.max(10, (value / chartMax) * 100)}%` }} /><span className="chart-week">{point.label}</span></button>; })}</div>{hoveredPoint !== null && <div className="chart-tooltip" style={{ left: `${((hoveredPoint + 0.5) / chartData.length) * 100}%` }}><strong>{chartData[hoveredPoint].label} · {chartMetric === "revenue" ? currency(chartData[hoveredPoint].revenue) : `${chartData[hoveredPoint].hours} hrs`}</strong><span>{chartData[hoveredPoint].questions} guest questions handled</span></div>}</div></div><div className="chart-footnote"><span><span className="legend-swatch" /> {chartMetric === "revenue" ? "Potential upsell revenue" : "Front desk hours reclaimed"}</span><span>Hover a bar for detail</span></div></div></div></div></section>

      <section className="final-cta section-pad"><div className="final-inner"><span className="eyebrow">READY WHEN YOU ARE</span><h2>Give your guests<br /><em>something to talk about.</em></h2><p>Set up your digital guest experience in an afternoon. No app download. No training manual. Just a better stay.</p><button className="button-primary light" onClick={() => setLocation("/stay")}>Start with AirPal <ArrowRight size={17} /></button><div className="final-note"><Check size={14} /> Free to explore · No credit card required</div></div><div className="final-orb orb-one" /><div className="final-orb orb-two" /></section>

      <footer className="footer"><div className="footer-brand"><button className="brand inverse" onClick={() => scrollTo("top")}><span className="brand-mark">✦</span><span>airpal<span className="brand-dot">.</span>me</span></button><p>Make every stay feel like a local secret.</p></div><div className="footer-links"><div><b>Product</b><button onClick={() => scrollTo("platform")}>Platform</button><button onClick={() => scrollTo("calculator")}>ROI calculator</button><button onClick={() => notifyComingSoon("Integrations are coming soon")}>Integrations</button></div><div><b>Company</b><button onClick={() => notifyComingSoon("About AirPal")}>About</button><button onClick={() => notifyComingSoon("Journal")}>Journal</button><button onClick={() => notifyComingSoon("Contact")}>Contact</button></div><div><b>Follow along</b><button onClick={() => notifyComingSoon("Instagram")}>Instagram</button><button onClick={() => notifyComingSoon("LinkedIn")}>LinkedIn</button><button onClick={() => notifyComingSoon("Privacy")}>Privacy</button></div></div><div className="footer-bottom"><span>© 2026 AirPal.me</span><span>Built for curious guests &amp; thoughtful hosts.</span></div></footer>

      {showDemo && <div className="demo-overlay" onClick={() => setShowDemo(false)}><div className="demo-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowDemo(false)} aria-label="Close"><X size={18} /></button><div className="modal-copy"><span className="eyebrow">GUEST MODE</span><h2>One scan.<br /><em>Welcome in.</em></h2><p>This is the guest side of AirPal — the view your guests open from a QR code in their room, lobby, or welcome email.</p><div className="modal-perks"><span><QrCode size={15} /> No app</span><span><Languages size={15} /> 100+ languages</span><span><Headphones size={15} /> Always on</span></div></div><GuestPreview /></div></div>}
    </main>
  );
}

export { Home };


function _UnusedIconReference() {
  return <><BarChart3 /><Ticket /><Utensils /><MessageCircle /></>;
}

void _UnusedIconReference;
