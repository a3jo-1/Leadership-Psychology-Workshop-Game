import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "The Boss — What you value shapes what you see",
  description: "An interactive classroom leadership perception game."
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}