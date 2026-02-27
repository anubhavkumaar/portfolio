import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anubhav Kumar - Full Stack Developer & GenAI Engineer",
  description: "Full Stack Developer working at the intersection of AI, cloud, and real-world problem solving. Designing and shipping production-grade GenAI platforms for enterprise environments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
