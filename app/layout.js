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
    default: "Protos Adventures is an complete outdoor shop.",
    template: "%s | Protos Adventures",
  },
  description:
    "Protos Adventures is an complete outdoor shop.Adventure Sports Equipment Store 👉 Water Sports Equipment 👉 Safety & Rescue Equipment 👉 Clothing & Footwear 👉 Camping & Outdoor 👉 Expedition GearRaft-Inflatables👉 Apparel, Dry Bag-Boxes, Life Jackets, Frame-Oars, Helmets, Raft Repair – Accessosries, Pumps, Gloves, Dry Wear, Kayaks-Accessories, Paddles, Base Layer, Fleece, Insulation, Leg Wear Safety-Rescue 👉 Rescue Devices, Retractable fall arresters, Ropes & Cords, Carabiner, Traction, Rope Tools, Harness, Harnesses accessories, Pulleys, Rope fall arresters, Protective Visors, Helmets Tactical Eye Wear 👉 Brand Footwear 👉 Clothing 👉 Camping & Outdoor Regd. Or Branch Office: Badrinath Road, Tapovan, Laxmanjhula, Uttarakhand Text : 0766-928-0002, 989-7468-886 Email:info@protosadventures.com Accounts@protosadventures.com Sales@protosadventures.com",
  keywords:
    "Adventure Sports Equipment Store, Safety & Rescue Equipment, Clothing & Footwear, Camping & Outdoor, Expedition GearRaft-Inflatables, india, India",
  icons: { apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Protos Adventures is an complete outdoor shop.",
    description:
      "Protos Adventures is an complete outdoor shop.",
    images: ["/logo.png"],
    url: "https://protosadventures.com/",
    site_name: "Protos Adventures",
  },
  twitter: {
    card: "summary_large_image",
    title: "Protos Adventures is an complete outdoor shop.",
    description:"Protos Adventures is an complete outdoor shop.Adventure Sports Equipment Store 👉 Water Sports Equipment 👉 Safety & Rescue Equipment 👉 Clothing & Footwear 👉 Camping & Outdoor 👉 Expedition GearRaft-Inflatables👉 Apparel, Dry Bag-Boxes, Life Jackets, Frame-Oars, Helmets, Raft Repair – Accessosries, Pumps, Gloves, Dry Wear, Kayaks-Accessories, Paddles, Base Layer, Fleece, Insulation, Leg Wear Safety-Rescue 👉 Rescue Devices, Retractable fall arresters, Ropes & Cords, Carabiner, Traction, Rope Tools",
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
