// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "El Yermo Eterno - RPG Post-Apocalíptico",
  description:
    "Un juego de supervivencia basado en texto en un mundo post-apocalíptico. Explora, combate y sobrevive en el yermo.",
  keywords:
    "RPG, post-apocalíptico, supervivencia, juego de texto, browser game",
  authors: [{ name: "Wasteland Studios" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${ibmPlexMono.variable} font-mono bg-black text-green-400 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
