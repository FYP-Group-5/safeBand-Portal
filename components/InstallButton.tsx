"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface InstallButtonProps {
  variant?: "primary" | "secondary" | "white";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export default function InstallButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  showIcon = true,
}: InstallButtonProps) {
  const { isInstalled, isInstallable, installApp } = usePWAInstall();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    console.log("[InstallButton] Button clicked");
    setIsLoading(true);
    const result = await installApp();
    console.log("[InstallButton] Install result:", result);
    
    // Add a small delay for UX
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Base styles
  const baseStyles = "font-bold rounded-full transition-all inline-flex items-center justify-center gap-2";
  
  // Size variants
  const sizeStyles = {
    sm: "text-sm px-5 py-2.5",
    md: "text-sm px-7 py-3",
    lg: "text-lg px-12 py-5",
  };

  // Variant styles
  const variantStyles = {
    primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-105",
    secondary: "bg-secondary text-white shadow-lg shadow-secondary/20 hover:bg-secondary/90 hover:scale-105",
    white: "bg-white text-primary shadow-2xl hover:scale-105",
  };

  // Button text logic
  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (isInstalled) return children || "Open App";
    if (isInstallable) return children || "Install SafeBand";
    return children || "Get Started";
  };

  // Icon logic
  const getIcon = () => {
    if (!showIcon) return null;
    if (isLoading) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (isInstalled) return <CheckCircle className="w-5 h-5" />;
    return <Download className="w-5 h-5" />;
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${
        isLoading ? "opacity-70 cursor-wait" : ""
      }`}
    >
      {getButtonText()}
      {getIcon()}
    </button>
  );
}
