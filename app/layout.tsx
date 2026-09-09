import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";





const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://medimind-nu-eight.vercel.app/"),

  title: {
    default: "MediMind — AI-Powered Clinical Case Analysis",
    template: "%s | MediMind",
  },

  description:
    "MediMind helps medical students and healthcare professionals organize clinical cases and explore AI-assisted clinical analysis and differential diagnoses.",

  keywords: [
    "AI medical case analysis",
    "clinical case analysis",
    "medical AI",
    "differential diagnosis",
    "clinical decision support",
    "medical case management",
  ],

  applicationName: "MediMind",

  authors: [
    {
      name: "MediMind",
    },
  ],

  openGraph: {
    type: "website",
    siteName: "MediMind",
    title: "MediMind — AI-Powered Clinical Case Analysis",
    description:
      "Organize clinical cases and explore AI-assisted medical analysis with MediMind.",
    url: "https://medimind-nu-eight.vercel.app/",
    images: [
      {
        url: "/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgzizTTXNpDmtxF6rfnZE_tJBh_7Av-ynf0qUqET_i3DeV_dZESBICpFAb&s=10",
        width: 1200,
        height: 630,
        alt: "MediMind — AI-Powered Clinical Case Analysis",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MediMind — AI-Powered Clinical Case Analysis",
    description:
      "AI-assisted clinical case analysis for medical learning and research.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
