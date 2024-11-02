import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { config } from "dotenv";
config()

export const apiAddress = process.env.API_ADDRESS // Set's api address

// Creating JWT types to send and get data with api
export type JWTUserInfo = {
  message: string,
  username: string,
  email: string
}

export type JWTFileTransfer = {
  message: string,
  file: FormData
}

export type JWTTokenResponse = {
  message: string,
  token: string,
  expTime: number
}

export type JWTCheckTokenResponse = {
  message: string
}

export type keyResp = {
  message: string,
  key: string,
}

// Const font vars
const fontLight = localFont({
  src: "../fonts/Quicksand-Light.ttf",
  variable: "--font-Quicksand-Light",
  weight: "100 900",
});

const fontBold = localFont({
  src: "../fonts/Quicksand-Bold.ttf",
  variable: "--font-Quicksand-Bold",
  weight: "100 900",
});

const fontMedium = localFont({
  src: "../fonts/Quicksand-Medium.ttf",
  variable: "--font-Quicksand-Medium",
  weight: "100 900",
});

const fontRegular = localFont({
  src: "../fonts/Quicksand-Regular.ttf",
  variable: "--font-Quicksand-Regular",
  weight: "100 900",
});

const fontSemiBold = localFont({
  src: "../fonts/Quicksand-SemiBold.ttf",
  variable: "--font-Quicksand-SemiBold",
  weight: "100 900",
});

// Const metadata 
export const metadata: Metadata = {
  title: "AnchorEncrypt",
  description: "Website with server-side encryption.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontLight.variable} ${fontBold.variable} ${fontMedium.variable} ${fontRegular.variable} ${fontSemiBold.variable}`}>
        {children}
      </body>
    </html>
  );
}
