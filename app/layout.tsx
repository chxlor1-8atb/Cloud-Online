import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex-sans-thai",
});

export const metadata: Metadata = {
  title: "CloudSync - \u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e40\u0e01\u0e47\u0e1a\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e04\u0e25\u0e32\u0e27\u0e14\u0e4c",
  description: "\u0e40\u0e01\u0e47\u0e1a\u0e44\u0e1f\u0e25\u0e4c\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e1b\u0e25\u0e2d\u0e14\u0e20\u0e31\u0e22 \u0e23\u0e27\u0e14\u0e40\u0e23\u0e47\u0e27 \u0e41\u0e25\u0e30\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e07\u0e48\u0e32\u0e22 \u0e1c\u0e48\u0e32\u0e19 Google Drive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${ibmPlexSansThai.variable} ${ibmPlexSansThai.className} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
