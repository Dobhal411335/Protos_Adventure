"use client"
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronDown, LogOutIcon, Mail, Phone, Truck, User2Icon } from "lucide-react"
import Link from "next/link"
import MenuBar from "./MenuBar"
import { Button } from "./ui/button"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import LanguageSelector from "./LanguageSelector"
import SearchBar from "./SearchBar"
import Cart from "./Cart";
import { ShoppingCart, Heart, User } from "lucide-react"
import { useCart } from "../context/CartContext";
import { ArrowDown, Menu, X } from "lucide-react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
const Header = () => {
  const authDropdownRef = React.useRef(null);
  const profileMenuRef = React.useRef(null);
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [initialCartTab, setInitialCartTab] = useState('cart');
  const { data: session, status } = useSession();
  const { cart = [], wishlist = [] } = useCart();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openFixedMenu, setOpenFixedMenu] = useState(null);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close auth dropdown if open and click is outside
      if (isAuthDropdownOpen && authDropdownRef.current && !authDropdownRef.current.contains(e.target)) {
        // Check if the click is not on the profile menu
        if (!profileMenuRef.current || !profileMenuRef.current.contains(e.target)) {
          setIsAuthDropdownOpen(false);
        }
      }

      // Close profile menu if open and click is outside
      if (isProfileOpen && profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        // Check if the click is not on the auth dropdown
        if (!authDropdownRef.current || !authDropdownRef.current.contains(e.target)) {
          setIsProfileOpen(false);
        }
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isAuthDropdownOpen, isProfileOpen]);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/getAllMenuItems")
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowHeader(true);
      } else if (window.scrollY > lastScrollY) {
        setShowHeader(false); // scrolling down
      } else {
        setShowHeader(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Only render header after mount to avoid hydration mismatch
  if (!isMounted) return null;

  const isUser = session && !session.user.isAdmin;

  return (
    <header
      className={`print:hidden ${pathName.includes("admin") ||
        // pathName.includes("category") ||
        pathName.includes("page") ||
        // pathName.includes("about-us") ||
        // pathName.includes("contact") ||
        // pathName.includes("privacy-policy") ||
        // pathName.includes("refund-cancellation") ||
        // pathName.includes("terms-condition") ||
        // pathName.includes("shipping-policy") ||
        // pathName.includes("product") ||
        // pathName.includes("artisan") ||
        // pathName.includes("cartDetails") ||
        // pathName.includes("checkout") ||
        // pathName.includes("search") ||
        pathName.includes("sign-up") ||
        pathName.includes("sign-in") ||
        pathName.includes("customEnquiry")
        ? "hidden"
        : "block"
        } bg-white text-black border-b sticky top-0 left-0 right-0 transition-all duration-300 font-barlow tracking-wider ease-in-out z-50 mx-auto w-full py-2
         ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="md:flex hidden items-center justify-between gap-8 border-b py-2 border-gray-400 md:px-8 ">
        <p className="text-md">Equipping Every Adventure, Empowering Every Explorer.</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Mail size={20} />
            <Link href={"mailto:nitin.rksh@gmail.com"}>
              <p className="text-sm font-semibold hover:underline">nitin.rksh@gmail.com</p>
            </Link> <Link href={"mailto:info@protosadventures.com"}>
              <p className="text-sm font-semibold hover:underline">info@protosadventures.com</p>
            </Link>
          </div>

          <div className="h-4 w-0.2 bg-white rounded-full"></div>

          <div className="flex items-center gap-2">
            <Phone size={20} />
            <Link href={"tel:+911352442822"}>
              <p className="text-sm font-semibold tracking-widest hover:underline">+91-135-2442822</p>
            </Link>
            <Link href={"tel:+917669280002"}>
              <p className="text-sm font-semibold tracking-widest hover:underline">7669280002</p>
            </Link>
            <Link href={"tel:+919897468886"}>
              <p className="text-sm font-semibold tracking-widest hover:underline">9897468886</p>
            </Link>
          </div>
          
        </div>

      </div>
      <div className="lg:flex hidden items-center z-50 justify-center md:justify-between py-1 md:px-4 ">
        <Link href={"/"}>
          <img className="w-44 object-contain drop-shadow-xl" src="/HeaderLogo.png" alt="Rishikesh Handmade" />
        </Link>

        <div className="relative flex items-center">
          {/* <MenuBar menuItems={menuItems.filter(item => item.active)} /> */}
          <MenuBar menuItems={menuItems} />
        </div>

        <SearchBar />


      </div>
      <div className="lg:hidden flex items-center z-50 justify-between md:justify-between py-1 px-2">
        <div className="relative flex items-center">
          {/* <MenuBar menuItems={menuItems.filter(item => item.active)} /> */}
          <MenuBar menuItems={menuItems} />
        </div>
        <Link href={"/"}>
          <img className="w-[150px] object-contain drop-shadow-xl" src="/HeaderLogo.png" alt="Rishikesh Handmade" />
        </Link>
        <div className="flex flex-col items-start justify-start">
          <LanguageSelector size={15} />
          <span className="text-xs font-medium">Language</span>
        </div>
      </div>
    </header>
  )
}

export default Header
