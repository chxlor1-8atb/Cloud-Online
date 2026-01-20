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
  title: "CloudSync - พื้นที่เก็บข้อมูลคลาวด์",
  description: "เก็บไฟล์อย่างปลอดภัย รวดเร็ว และใช้งานง่าย ผ่าน Google Drive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <body
        suppressHydrationWarning
        className={`${ibmPlexSansThai.variable} ${ibmPlexSansThai.className} antialiased bg-[#09090b] text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

