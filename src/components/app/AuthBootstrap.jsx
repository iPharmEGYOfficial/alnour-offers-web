import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";

export default function AuthBootstrap({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return <SplashScreen />;
  }

  return children;
}

