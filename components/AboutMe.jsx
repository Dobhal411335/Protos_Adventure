"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const accordionData = [
  {
    title: "1:- Recognized for Excellence",
    content: `In 2025, PROTOS ADVENTURE was awarded the Great Place To Work® Certification, a prestigious recognition reflecting our high-trust culture and commitment to building a supportive, empowering, and ethical workplace.`
  },
  {
    title: "2:-  What We Offer – Gear Categories at a Glance",
    content: `Rope Tools, Traction Systems:
Carabiners
Retractable Fall Arresters
Rope Fall Arresters
Protective Visors
Safety Helmets

👉 Clothing & Footwear
Tactical Eyewear
Fleece, Base Layers, Insulation
Legwear
Brand Outdoor Footwear
Professional-Grade Adventure Clothing

👉 Camping & Outdoor Gear
Tents & Sleeping Systems
Cooking & Utility Tools
Lighting & Portable Storage

👉 Expedition Gear
High-Altitude Gear
Technical Mountaineering Equipment
Survival Kits & AccessoriesWe prioritize natural, locally sourced materials and environmentally conscious production techniques that minimize waste and reduce our carbon footprint.`
  },
  {
    title: "3:- More Than a Store – Your Adventure Partner",
    content: `At PROTOS ADVENTURES, we don't just supply gear—we provide innovative and practical solutions that help businesses in the equipment industry streamline operations and stay ahead of the curve. Our leadership team combines deep field expertise with visionary strategies, helping adventure-based organizations grow with confidence.
We’re committed to being the most trusted partner in your outdoor journey—from preparation to performance and beyond.`
  },

];
const AboutMe = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team");
        if (!res.ok) throw new Error("Failed to fetch team data");
        const data = await res.json();
        setTeamMembers(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);
  return (
    <div className="w-full min-h-screen bg-[#fcf7f1]">
      {/* Banner */}
      <div className="relative w-full h-[150px] md:h-[250px] flex items-center justify-center bg-secondary overlay-black-light">
        <Image
          src="/bg1.jpg"
          alt="About Banner"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-80"
          priority
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-xl md:text-5xl font-bold mb-2 drop-shadow-lg">Your Trusted Partner in Outdoor Excellence</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-inner md:p-10 p-4 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-5 md:gap-10 items-stretch">
            {/* Left: Text and Accordion */}
            <div className="lg:w-1/2 flex flex-col justify-start overflow-y-auto py-5">
              <div className="mb-8">
                <h2 className="text-xl md:text-4xl font-bold mb-6 text-gray-800">“PROTOS ADVENTURES”</h2>
                <p className="text-md text-gray-700 text-justify leading-relaxed mb-6">
                  India’s Premier Outdoor & Adventure Equipment Store
                  <br />
                  is a complete one-stop shop for high-performance outdoor gear and equipment. Corporate office and store in Tapovan, Badrinath Highway, Rishikesh—India’s leading hub for adventure activities—we have proudly served countless adventure companies nationwide, supplying essential gear for rafting, camping, bungee jumping, trekking, and expeditions.
                  <br />
                  With over 25 years of trusted industry experience, PROTOS ADVENTURE has become synonymous with quality, reliability, and innovation in the adventure equipment industry. We are authorized dealers for world-class international brands, including NRS, Camp, Wiley X, and Lafuma, offering globally trusted equipment to elevate every expedition.<br /><br />
                </p>
              </div>

              {/* Accordion */}
              <div className="w-full max-w-2xl mx-auto mb-8">
                {accordionData.map((item, idx) => {
                  // Create a ref for each accordion item
                  const contentRef = React.useRef(null);
                  // Calculate maxHeight for transition
                  const isOpen = openIndex === idx;
                  const [height, setHeight] = React.useState(0);

                  React.useEffect(() => {
                    if (isOpen && contentRef.current) {
                      setHeight(contentRef.current.scrollHeight);
                    } else {
                      setHeight(0);
                    }
                  }, [isOpen]);

                  return (
                    <div key={idx} className="mb-2 border border-gray-200 rounded-lg bg-white shadow-sm">
                      <button
                        className={`w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-lg transition focus:outline-none ${isOpen ? 'text-amber-700' : 'text-gray-800'}`}
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm md:text-xl">{item.title}</span>
                        <span className="text-3xl">{isOpen ? '-' : '+'}</span>
                      </button>
                      <div
                        ref={contentRef}
                        style={{
                          maxHeight: isOpen ? height : 0,
                          opacity: isOpen ? 1 : 0,
                          overflow: 'hidden',
                          transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
                        }}
                        className="px-6 py-2"
                      >
                        <p className="text-gray-700 text-base whitespace-pre-line">{item.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Images Grid */}
            <div className="lg:w-1/2 min-h-[600px] h-full flex">
              <div className="grid grid-cols-5 gap-4 w-full ">
                <div className="col-span-3">
                  <Image src="/A1.jpg" alt="A1" width={900} height={400} className="rounded-lg shadow-lg object-cover w-full h-full" />
                </div>
                <div className="col-span-2">
                  <Image src="/A2.jpg" alt="A2" width={300} height={400} className="rounded-lg shadow-lg object-cover w-full h-full" />
                </div>

                <div className="col-span-5 row-span-2">
                  <Image src="/A3.jpg" alt="A3" width={800} height={300} className="rounded-lg shadow-lg object-cover w-full h-auto" />
                </div>
                <div className="col-span-5 row-span-2">
                  <Image src="/A4.jpg" alt="A4" width={400} height={300} className="rounded-lg shadow-lg object-cover w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="w-full bg-black py-5 text-white flex flex-col md:flex-row items-center justify-between  md:px-24 gap-6 ">
        <div className="md:mb-6 md:mb-0 md:px-3">
          <h3 className="text-xl md:text-3xl font-bold gap-2 text-center md:text-start">Questions?
            <br className="md:hidden" />
            <span className="text-sm md:text-lg font-normal px-2">Our experts will help find the gear that’s right for you</span>
          </h3>
        </div>
        <Link href="/contact" className="btn bg-white text-black font-bold px-8 py-3 rounded-lg shadow transition">Get In Touch</Link>
      </section>
    </div>
  );
};

export default AboutMe;