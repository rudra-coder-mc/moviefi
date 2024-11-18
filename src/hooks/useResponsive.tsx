import { useState, useEffect } from "react";

export const useResponsive = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isMediumDevice, setIsMediumDevice] = useState(false);
  const [isLargeDevice, setIsLargeDevice] = useState(false);

  useEffect(() => {
    const checkMediaQueries = () => {
      setIsSmallDevice(window.matchMedia("(max-width: 768px)").matches);
      setIsMediumDevice(
        window.matchMedia("(min-width: 769px) and (max-width: 1024px)").matches
      );
      setIsLargeDevice(window.matchMedia("(min-width: 1025px)").matches);
    };

    // Initial check
    checkMediaQueries();

    // Update on resize
    const handleResize = () => checkMediaQueries();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
  };
};
