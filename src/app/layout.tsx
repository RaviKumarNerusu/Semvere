import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
// Import the new bot component
import HeatAssistant from "@/components/HeatAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heat Transfer Visualizer | Interactive Physics Simulation",
  description: "Interactive simulation showing how heat moves through materials via conduction, convection, and radiation. Experiment with different materials and insulation layers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <VisualEditsMessenger />
        {/* Render the Bot here */}
        <HeatAssistant />
      </body>
    </html>
  );
}