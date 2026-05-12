import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import logo from "@/assets/logo.png";

const TopBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const getTotalItems = useCartStore((state) => state.getTotalItems);

  return (
    <header className="h-16 bg-dark border-b border-dark/20 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Caffeeine Logo"
          className="w-9 h-9 object-contain"
        />
        <div>
          <p className="text-cream font-bold text-sm leading-tight">
            Caffeeine POS
          </p>
          <p className="text-cream/40 text-xs">coffee shop for the homies.</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-cream/60 text-xs">{formattedDate}</p>
        <p className="text-cream font-mono font-bold text-lg leading-tight">
          {formattedTime}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {getTotalItems() > 0 && (
          <div className="bg-brand text-cream text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            {getTotalItems()} item aktif
          </div>
        )}
        <div className="text-right">
          <p className="text-cream text-sm font-semibold">Kasir</p>
          <p className="text-cream/40 text-xs">Shift Pagi</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-cream font-bold text-sm">
          K
        </div>
      </div>
    </header>
  );
};

export default TopBar;
