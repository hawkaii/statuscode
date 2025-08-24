"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

// Grid Background Component
export interface GridBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  gridSize?: number;
  gridColor?: string;
  darkGridColor?: string;
  showFade?: boolean;
  fadeIntensity?: number;
  children?: React.ReactNode;
}

export const GridBackground = ({
  className,
  children,
  gridSize = 20,
  gridColor = "rgba(0, 0, 0, 0.1)",
  darkGridColor = "rgba(255, 255, 255, 0.1)",
  showFade = true,
  fadeIntensity = 20,
  ...props
}: GridBackgroundProps) => {
  const [currentGridColor, setCurrentGridColor] = useState(gridColor);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateGridColor = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setCurrentGridColor(isDarkMode ? darkGridColor : gridColor);
    };

    // Initial color setup
    updateGridColor();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateGridColor();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Also listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (!document.documentElement.classList.contains('dark') &&
        !document.documentElement.classList.contains('light')) {
        updateGridColor();
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [gridColor, darkGridColor]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        className={cn(
          "absolute inset-0 w-full h-full",
          className
        )}
        {...props}
      >
        <div className="relative z-20">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage: `linear-gradient(to right, ${currentGridColor} 1px, transparent 1px), linear-gradient(to bottom, ${currentGridColor} 1px, transparent 1px)`,
          backgroundRepeat: 'repeat',
        }}
      />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, rgba(255, 255, 255, 0.8))`,
            mixBlendMode: 'multiply',
          }}
        />
      )}

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

// Dot Background Component
export interface DotBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  dotSize?: number;
  dotColor?: string;
  darkDotColor?: string;
  spacing?: number;
  showFade?: boolean;
  fadeIntensity?: number;
  children?: React.ReactNode;
}

export const DotBackground = ({
  className,
  children,
  dotSize = 1,
  dotColor = "rgba(0, 0, 0, 0.2)",
  darkDotColor = "rgba(255, 255, 255, 0.2)",
  spacing = 20,
  showFade = true,
  fadeIntensity = 20,
  ...props
}: DotBackgroundProps) => {
  const [currentDotColor, setCurrentDotColor] = useState(dotColor);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateDotColor = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setCurrentDotColor(isDarkMode ? darkDotColor : dotColor);
    };

    updateDotColor();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateDotColor();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [dotColor, darkDotColor]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "absolute inset-0 w-full h-full",
          className
        )}
        {...props}
      >
        <div className="relative z-20">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundSize: `${spacing}px ${spacing}px`,
          backgroundImage: `radial-gradient(${currentDotColor} ${dotSize}px, transparent ${dotSize}px)`,
          backgroundRepeat: 'repeat',
        }}
      />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, rgba(255, 255, 255, 0.8))`,
            mixBlendMode: 'multiply',
          }}
        />
      )}

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default { GridBackground, DotBackground };