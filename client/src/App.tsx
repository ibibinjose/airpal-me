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
import { TravelOsProvider } from "./contexts/TravelOsContext";
import { isNativeShell } from "./lib/platform";

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
    if (isNativeShell()) {
      setDeviceMode("responsive");
    } else if (frame === "iphone" || frame === "android" || frame === "tablet" || frame === "responsive") {
      setDeviceMode(frame);
    }
  }, [params?.propertyId, setPropertyId, setQrType, setRoomNumber, setDeviceMode]);

  return <GuestCompanion />;
}

function CampusRoute() {
  const { setQrType, setRoomNumber, setDeviceMode } = useAirPal();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const qr = parseQrType(searchParams.get("type"));
    const room = searchParams.get("room");
    const frame = searchParams.get("frame");
    if (qr) setQrType(qr);
    setRoomNumber(room || "R12");
    if (isNativeShell()) {
      setDeviceMode("responsive");
    } else if (frame === "iphone" || frame === "android" || frame === "tablet" || frame === "responsive") {
      setDeviceMode(frame);
    }
  }, [setQrType, setRoomNumber, setDeviceMode]);

  return <CampusCompanion />;
}

function MainApp() {
  const [location, setLocation] = useLocation();
  const native = isNativeShell();
  const showChrome = !native && !location.startsWith("/trip");

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
    : location.startsWith("/stay") || location.startsWith("/g/")
    ? "companion"
    : native
    ? "companion"
    : "landing";

  useEffect(() => {
    if (native && location === "/") setLocation("/os");
  }, [native, location, setLocation]);

  const lockViewport = activeView === "companion" || activeView === "os" || activeView === "campus" || location.startsWith("/trip");

  return (
    <div className={`flex flex-col bg-[#f9f8f4] text-[#16211c] font-sans antialiased ${lockViewport ? "h-dvh overflow-hidden" : "min-h-dvh"}`}>
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
            else setLocation("/");
          }}
        />
      )}
      <div className={lockViewport ? "flex-1 min-h-0 overflow-hidden" : "flex-1"}>
        <Switch>
          <Route path="/admin" component={SuperAdminDashboard} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/host" component={HostDashboard} />
          <Route path="/os" component={TravelOs} />
          <Route path="/stay" component={GuestRoute} />
          <Route path="/g/:propertyId" component={GuestRoute} />
          <Route path="/campus" component={CampusRoute} />
          <Route path="/c/:campusId" component={CampusRoute} />
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
