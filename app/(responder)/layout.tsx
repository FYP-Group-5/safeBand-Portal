"use client";

import { EmergencyProvider } from "@/lib/emergency-context";

export default function ResponderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmergencyProvider role="responder">{children}</EmergencyProvider>;
}
