import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Wind,
  Droplets,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  locationName: string;
}

export const RealtimeTopBar: React.FC<{
  className?: string;
  compact?: boolean;
}> = ({ className = "", compact = false }) => {
  // Live ticking clock
  const [time, setTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timezone & Location detection
  const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Sydney";
  const cityParts = detectedTimeZone.split("/");
  const detectedCity = cityParts[cityParts.length - 1]?.replace(/_/g, " ") || "Sydney";

  // Weather state
  const [weather, setWeather] = useState<WeatherData>({
    temp: 21,
    condition: "Sunny & Clear",
    weatherCode: 0,
    humidity: 58,
    windSpeed: 14,
    isDay: true,
    locationName: detectedCity,
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  const getWeatherDescription = (code: number, isDay: boolean) => {
    if (code === 0) return isDay ? "Sunny & Clear" : "Clear Night";
    if (code === 1 || code === 2) return "Mostly Sunny";
    if (code === 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Misty / Fog";
    if (code >= 51 && code <= 55) return "Light Drizzle";
    if (code >= 61 && code <= 65) return "Rain Showers";
    if (code >= 71 && code <= 77) return "Light Snow";
    if (code >= 80 && code <= 82) return "Heavy Showers";
    if (code >= 95) return "Thunderstorms";
    return "Pleasant";
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // Default to Sydney (-33.8688, 151.2093) or use browser coords
      let lat = -33.8688;
      let lon = 151.2093;

      if ("geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 3000,
              maximumAge: 300000,
            });
          });
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch {
          // fallback to default coordinates
        }
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day`
      );

      if (res.ok) {
        const data = await res.json();
        const current = data.current;
        if (current) {
          const code = current.weather_code ?? 0;
          const isDay = current.is_day !== 0;
          setWeather({
            temp: Math.round(current.temperature_2m ?? 21),
            condition: getWeatherDescription(code, isDay),
            weatherCode: code,
            humidity: Math.round(current.relative_humidity_2m ?? 58),
            windSpeed: Math.round(current.wind_speed_10m ?? 14),
            isDay,
            locationName: detectedCity,
          });
          setLastUpdated(
            new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          );
        }
      }
    } catch {
      // Keep existing data gracefully on offline/failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateString = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const renderWeatherIcon = () => {
    const code = weather.weatherCode;
    if (code >= 95) return <CloudLightning size={14} className="text-amber-500 animate-pulse" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={14} className="text-sky-400" />;
    if (code >= 51 && code <= 82) return <CloudRain size={14} className="text-blue-500" />;
    if (code === 3 || code === 2) return <CloudSun size={14} className="text-amber-500" />;
    return <Sun size={14} className="text-amber-500 animate-spin-slow" />;
  };

  return (
    <div
      className={`w-full bg-[#f8f9f6]/95 backdrop-blur-md border-b border-[#dde3db] text-[#16211c] text-xs font-sans transition-colors select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        
        {/* LEFT: Live Status Indicator & Location */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LIVE LOCAL</span>
          </div>

          <div className="flex items-center gap-1 font-medium text-stone-700 text-xs">
            <MapPin size={13} className="text-amber-600 shrink-0" />
            <span className="font-semibold text-stone-900">{weather.locationName}</span>
            <span className="text-stone-300">·</span>
            <span className="text-[11px] text-stone-500 hidden md:inline">AirPal Hospitality Network</span>
          </div>
        </div>

        {/* RIGHT: Realtime Clock & Realtime Weather */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap ml-auto">
          
          {/* REALTIME LOCAL TIME WITH LIVE SECONDS */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#e2e8e0] shadow-2xs font-mono text-xs text-stone-800">
            <Clock size={13} className="text-amber-600 shrink-0" />
            <span className="font-bold tracking-tight text-stone-900">{timeString}</span>
            <span className="text-stone-300">|</span>
            <span className="text-[11px] text-stone-500 font-sans hidden sm:inline">{dateString}</span>
          </div>

          {/* REALTIME LIVE WEATHER BADGE */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 border border-amber-200/80 shadow-2xs text-xs text-amber-950"
            title={`Humidity: ${weather.humidity}% | Wind: ${weather.windSpeed} km/h (Updated ${lastUpdated})`}
          >
            <div className="flex items-center gap-1.5 font-medium">
              {renderWeatherIcon()}
              <span className="font-bold text-amber-950">{weather.temp}°C</span>
              <span className="text-[11px] text-amber-900 font-medium hidden sm:inline">
                · {weather.condition}
              </span>
            </div>

            {/* Weather secondary metrics */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-amber-200 text-[11px] text-amber-800/80">
              <span className="inline-flex items-center gap-1" title="Humidity">
                <Droplets size={11} className="text-sky-500" />
                {weather.humidity}%
              </span>
              <span className="inline-flex items-center gap-1" title="Wind Speed">
                <Wind size={11} className="text-teal-600" />
                {weather.windSpeed} km/h
              </span>
            </div>

            <button
              onClick={fetchWeather}
              disabled={loading}
              className="hover:rotate-180 transition-transform duration-500 p-0.5 text-amber-700/60 hover:text-amber-900 disabled:opacity-50"
              title="Refresh weather"
              aria-label="Refresh weather data"
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
