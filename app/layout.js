import "./globals.css";
import Header from "@/components/Header";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { SearchProvider } from "@/context/SearchContext";
import OverlayButton from "@/components/OverlayButton";
import GoogleTranslate from "@/components/GoogleTranslate";


export const metadata = {
  metadataBase: new URL("https://protosadventures.com/"),
  title: {
    default: "PROTOS ADVENTURE SPORTS & SECURITY SUPPLIES PVT LTD",
    template: "%s | Protos Adventures",
  },
  description:
    `PROTOS ADVENTURE SPORTS & SECURITY SUPPLIES PVT LTD

With over 25 years of experience, we are trusted partners to adventure companies and outdoor professionals across the country.
We are authorized dealers of top international brands such as NRS, Camp, Wiley X, and Lafuma, providing high-performance gear for rafting, bungee jumping, camping, trekking, high-altitude expeditions, and more.

Recognized as a Great Place To Work® (2025), our company is built on innovation, integrity, and a passion for the outdoors. From water sports equipment and rescue gear to clothing, footwear, and expedition essentials, we deliver dependable solutions for every explorer.

“www.protosadventures.com (Website) ” is a registered trade mark.
PAN Number :- AADCP9394E1
GST Registration Number :- GSTIN: 05AADCP9394E1Z7
Working Hours : 9:30 - 18:30 pm

Call Us
Ph.: +91-135-2442822 | Mo.: 7669280002, 9897468886
E-mail........
For Sales: info@adventureaxis.in
For Support: Accounts@adventureaxis.in
For Official: Sales@adventureaxis.in

Corporate Address: 05 ,Lajpat Rai Marg, Rishikesh-249201 ( Uttarakhand)

Store Address: 162, Badrinath Road (Opp. Divine Lakshmi Ganga Hotel)
Tapovan Luxman Jhoola, RISHIKESH-249 192 (UK)`,
  keywords:
    "Adventure Sports Equipment Store, Safety & Rescue Equipment, Clothing & Footwear, Camping & Outdoor, Expedition GearRaft-Inflatables, india, India",
  icons: { apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Protos Adventures is an complete outdoor shop.",
    description:
      `PROTOS ADVENTURE SPORTS & SECURITY SUPPLIES PVT LTD

With over 25 years of experience, we are trusted partners to adventure companies and outdoor professionals across the country.
We are authorized dealers of top international brands such as NRS, Camp, Wiley X, and Lafuma, providing high-performance gear for rafting, bungee jumping, camping, trekking, high-altitude expeditions, and more.

Recognized as a Great Place To Work® (2025), our company is built on innovation, integrity, and a passion for the outdoors. From water sports equipment and rescue gear to clothing, footwear, and expedition essentials, we deliver dependable solutions for every explorer.

“www.protosadventures.com (Website) ” is a registered trade mark.
PAN Number :- AADCP9394E1
GST Registration Number :- GSTIN: 05AADCP9394E1Z7
Working Hours : 9:30 - 18:30 pm

Call Us
Ph.: +91-135-2442822 | Mo.: 7669280002, 9897468886
E-mail........
For Sales: info@adventureaxis.in
For Support: Accounts@adventureaxis.in
For Official: Sales@adventureaxis.in

Corporate Address: 05 ,Lajpat Rai Marg, Rishikesh-249201 ( Uttarakhand)

Store Address: 162, Badrinath Road (Opp. Divine Lakshmi Ganga Hotel)
Tapovan Luxman Jhoola, RISHIKESH-249 192 (UK)`,
    images: ["/logo.png"],
    url: "https://protosadventures.com/",
    site_name: "Protos Adventures",
  },
  twitter: {
    card: "summary_large_image",
    title: "Protos Adventures is an complete outdoor shop.",
    description: `PROTOS ADVENTURE SPORTS & SECURITY SUPPLIES PVT LTD

With over 25 years of experience, we are trusted partners to adventure companies and outdoor professionals across the country.
We are authorized dealers of top international brands such as NRS, Camp, Wiley X, and Lafuma, providing high-performance gear for rafting, bungee jumping, camping, trekking, high-altitude expeditions, and more.

Recognized as a Great Place To Work® (2025), our company is built on innovation, integrity, and a passion for the outdoors. From water sports equipment and rescue gear to clothing, footwear, and expedition essentials, we deliver dependable solutions for every explorer.

“www.protosadventures.com (Website) ” is a registered trade mark.
PAN Number :- AADCP9394E1
GST Registration Number :- GSTIN: 05AADCP9394E1Z7
Working Hours : 9:30 - 18:30 pm

Call Us
Ph.: +91-135-2442822 | Mo.: 7669280002, 9897468886
E-mail........
For Sales: info@adventureaxis.in
For Support: Accounts@adventureaxis.in
For Official: Sales@adventureaxis.in

Corporate Address: 05 ,Lajpat Rai Marg, Rishikesh-249201 ( Uttarakhand)

Store Address: 162, Badrinath Road (Opp. Divine Lakshmi Ganga Hotel)
Tapovan Luxman Jhoola, RISHIKESH-249 192 (UK)`,
    images: ["/logo.png"],
  },
  other: {
    "author": "Protos Adventures",
    "robots": "index, follow",
    "viewport": "width=device-width, initial-scale=1",
  },
};

import { CartProvider } from "../context/CartContext";
// import CartSyncOnLogin from "../context/CartSyncOnLogin";

export default function RootLayout({ children }) {
  const isPaid = process.env.NEXT_PUBLIC_IS_PAID === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-gilda`}>
        {isPaid ? (
          <CartProvider>
            <NextTopLoader color="#006eff" height={3} showSpinner={false} zIndex={1600} />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2500, style: { fontFamily: "var(--font-GildaDisplay)" } }} />
            <SessionWrapper>
              {/* <CartSyncOnLogin /> */}
              <SearchProvider>
                <Header />
                <GoogleTranslate />
                <main>
                  <OverlayButton />
                  {children}
                </main>
                <Footer />
              </SearchProvider>
            </SessionWrapper>
          </CartProvider>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-black text-center">
              Payment Pending. Please Contact Admin.
            </h1>
          </div>
        )}
      </body>
    </html>
  );
}
