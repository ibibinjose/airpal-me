import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { AirPalProvider, useAirPal, type QrType } from "./contexts/AirPalContext";
import { DeviceFrameSwitcher } from "./components/DeviceFrameSwitcher";
import { GuestCompanion } from "./pages/GuestCompanion";
import { HostDashboard } from "./pages/HostDashboard";
import { SuperAdminDashboard } from "./pages/SuperAdminDashboard";
import { AuthPage } from "./pages/AuthPage";
import Home from "./pages/Home";
import { SharedTrip } from "./pages/SharedTrip";
import { TravelOs } from "./pages/TravelOs";
import { CampusCompanion } from "./pages/CampusCompanion";
import { WalkingTourPage } from "./pages/WalkingTour";
import { GuideProfilePage } from "./pages/GuideProfile";
import { TravelOsProvider } from "./contexts/TravelOsContext";
import { isNativeShell } from "./lib/platform";
import { enterDemo, isDemoMode } from "./lib/app-mode";
import { DEMO_USERS } from "@shared/airpal-data";
import StartPage from "./pages/StartPage";
import ScanPage from "./pages/ScanPage";
import { useAuth } from "./contexts/AuthContext";

function parseQrType(value: string | null): QrType | null {
  if (value === "room" || value === "property" || value === "dining" || value === "experience" || value === "emergency") {
    return value;
  }
  return null;
}

function GuestRoute({ params }: { params?: { propertyId?: string } }) {
  const { setQrType, setRoomNumber, setDeviceMode, setPropertyId } = useAirPal();

  useEffect(() => {
    if (params?.propertyId) {
      setPropertyId(params.propertyId);
    }
    const searchParams = new URLSearchParams(window.location.search);
    const qr = parseQrType(searchParams.get("type"));
    const room = searchParams.get("room");
    const frame = searchParams.get("frame");
    if (qr) setQrType(qr);
    if (room) setRoomNumber(room);
    if (isNativeShell() || !isDemoMode()) {
      setDeviceMode("responsive");
    } else if (frame === "iphone" || frame === "android" || frame === "tablet" || frame === "responsive") {
      setDeviceMode(frame);
    }
  }, [params?.propertyId, setPropertyId, setQrType, setRoomNumber, setDeviceMode]);

  return <GuestCompanion />;
}

function CampusRoute({ params }: { params?: { campusId?: string } }) {
  const { setQrType, setRoomNumber, setDeviceMode, setPropertyId } = useAirPal();

  useEffect(() => {
    if (params?.campusId) setPropertyId(params.campusId);
    const searchParams = new URLSearchParams(window.location.search);
    const qr = parseQrType(searchParams.get("type"));
    const room = searchParams.get("room");
    const frame = searchParams.get("frame");
    if (qr) setQrType(qr);
    setRoomNumber(room || "R12");
    if (isNativeShell() || !isDemoMode()) {
      setDeviceMode("responsive");
    } else if (frame === "iphone" || frame === "android" || frame === "tablet" || frame === "responsive") {
      setDeviceMode(frame);
    }
  }, [params?.campusId, setPropertyId, setQrType, setRoomNumber, setDeviceMode]);

  return <CampusCompanion />;
}

function DemoGate() {
  const [location, setLocation] = useLocation();
  const { user, switchRole } = useAuth();
  const { setPropertyId } = useAirPal();
  useEffect(() => {
    // Explicit /demo entry only — never auto-demo on the live marketing site.
    if (location === "/demo" || location.startsWith("/demo/")) {
      enterDemo();
      setPropertyId("harbour-hotel");
      const segment = location.replace(/^\/demo\/?/, "").split("/")[0] || "";
      if (!user) {
        if (segment === "admin") switchRole("super_admin");
        else if (segment === "stay" || segment.startsWith("g")) switchRole("guest");
        else switchRole("host_admin");
      }
      const rest = location.replace(/^\/demo/, "") || "/os";
      setLocation(rest);
    }
  }, [location, setLocation, user, switchRole, setPropertyId]);
  return null;
}

function HostGate() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  useEffect(() => {
    if (location.startsWith("/host") && !user && !isDemoMode()) setLocation("/start");
  }, [location, user, setLocation]);
  return null;
}

function LiveAuthGuard() {
  const { user, exitDemoToLive } = useAuth();
  useEffect(() => {
    // Live site must never keep a DEMO_USERS persona signed in.
    if (!isDemoMode() && user && DEMO_USERS.some((row) => row.uid === user.uid)) {
      exitDemoToLive();
    }
  }, [user, exitDemoToLive]);
  return null;
}

function MainApp() {
  const [location, setLocation] = useLocation();
  const { exitDemoToLive } = useAuth();
  const native = isNativeShell();
  const demo = isDemoMode() || location.startsWith("/demo");
  const showChrome = demo && !native && !location.startsWith("/trip");

  const activeView = location.startsWith("/admin")
    ? "admin"
    : location.startsWith("/auth")
    ? "auth"
    : location.startsWith("/host")
    ? "dashboard"
    : location.startsWith("/os")
    ? "os"
    : location.startsWith("/campus") || location.startsWith("/c/")
    ? "campus"
    : location.startsWith("/tour") || location.startsWith("/u/")
    ? "companion"
    : location.startsWith("/stay") || location.startsWith("/g/")
    ? "companion"
    : native
    ? "companion"
    : "landing";

  useEffect(() => {
    if (native && location === "/") setLocation(demo ? "/os" : "/scan");
  }, [native, location, setLocation, demo]);

  const lockViewport =
    activeView === "companion" ||
    activeView === "os" ||
    activeView === "campus" ||
    location.startsWith("/trip") ||
    location.startsWith("/tour") ||
    location.startsWith("/u/");

  return (
    <div className={`flex flex-col bg-[#f9f8f4] text-[#16211c] font-sans antialiased ${lockViewport ? "h-dvh overflow-hidden" : "min-h-dvh"}`}>
      <DemoGate />
      <HostGate />
      <LiveAuthGuard />
      {showChrome && (
        <DeviceFrameSwitcher
          activeView={activeView}
          onViewChange={(view) => {
            if (view === "os") setLocation("/os");
            else if (view === "companion") setLocation("/stay");
            else if (view === "campus") setLocation("/campus");
            else if (view === "dashboard") setLocation("/host");
            else if (view === "admin") setLocation("/admin");
            else if (view === "auth") setLocation("/auth");
            else {
              exitDemoToLive();
              setLocation("/");
            }
          }}
        />
      )}
      <div className={lockViewport ? "flex-1 min-h-0 overflow-hidden" : "flex-1"}>
        <Switch>
          <Route path="/admin" component={SuperAdminDashboard} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/start" component={StartPage} />
          <Route path="/scan" component={ScanPage} />
          <Route path="/demo" component={TravelOs} />
          <Route path="/host" component={HostDashboard} />
          <Route path="/os" component={TravelOs} />
          <Route path="/stay" component={GuestRoute} />
          <Route path="/g/:propertyId" component={GuestRoute} />
          <Route path="/campus" component={CampusRoute} />
          <Route path="/c/:campusId" component={CampusRoute} />
          <Route path="/tour/:tourId" component={WalkingTourPage} />
          <Route path="/u/:profileId" component={GuideProfilePage} />
          <Route path="/trip/:tripId" component={SharedTrip} />
          <Route path="/">{native ? <TravelOs /> : <Home />}</Route>
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AirPalProvider>
          <TravelOsProvider>
            <TooltipProvider>
              <Toaster richColors position="top-right" />
              <MainApp />
            </TooltipProvider>
          </TravelOsProvider>
        </AirPalProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
