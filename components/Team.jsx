"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const Team = () => {
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
    <div className="w-full min-h-screen bg-white">
      {/* Banner */}
      <div className="relative w-full h-[100px] md:h-[250px] flex items-center justify-center">
        <Image
          src="/bg1.jpg"
          alt="Team Banner"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-80"
          priority
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">Our Associate Partner</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-inner md:p-20 px-5 py-2">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 mb-10 items-start">
            {/* Left: Heading and Paragraph */}
            <div className="w-full lg:w-[57%]">
              <h2 className="text-xl md:text-4xl font-semibold mb-4 text-gray-800 leading-tight">Leadership That Goes Beyond Gear</h2>
              <p className="text-md text-justify md:text-xl text-gray-700 mb-4">
                At PROTOS ADVENTURES, we believe that delivering high-quality gear is only part of the mission. What comes next—service, support, and strategy—is where our leadership truly stands apart. Our leaders are seasoned professionals who not only understand the needs of the adventure community but also help shape the future of the industry through vision, collaboration, and innovation.
                <br />

                From supplying premium equipment to offering industry-best practices, we’re more than just an outdoor shop—we’re your long-term partner in adventure.
              </p>
            </div>
            {/* Right: Two Images in a row (first two team members) */}
            <div className=" hidden md:flex w-full lg:w-[43%] flex-row gap-8 items-start justify-center">
              {loading ? (
                <div>Loading Associate Partner...</div>
              ) : teamMembers.length > 0 ? (
                teamMembers.slice(0, 2).map((member, idx) => (
                  <div key={member._id || idx} className="flex flex-col items-center">
                    <div className={`relative w-72 h-72 rounded-2xl overflow-hidden shadow-lg ${idx === 0 ? "bg-[#f6e9da]" : "bg-[#d6f0fa]"} flex items-center justify-center`}>
                      <Image src={member.image?.url || "/placeholder.jpeg"} alt={member.title} width={224} height={224} className="object-cover w-full h-full" />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="font-bold text-lg">{member.title}</div>
                      <div className="text-xs text-gray-600">{member.designation}</div>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div>

          {/* Team Grid (remaining team members) */}
          <div className="hidden md:flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8 mb-10">
            {loading ? (
              <div>Loading...</div>
            ) : teamMembers.length > 2 ? (
              teamMembers.slice(2).map((member, idx) => (
                <div key={member._id || idx} className="flex flex-col items-center">
                  <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-lg bg-[#d6f0fa] flex items-center justify-center">
                    <Image src={member.image?.url || "/placeholder.jpeg"} alt={member.title} width={224} height={224} className="object-cover w-full h-full" />
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-bold text-lg">{member.title}</div>
                    <div className="text-xs text-gray-600">{member.designation}</div>
                  </div>
                </div>
              ))
            ) : null}
          </div>

          {/* Team Grid (remaining team members for mobile) */}
          <div className="md:hidden grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 md:gap-8 gap-4 mb-10">
            {loading ? (
              <div>Loading Associate Partner...</div>
            ) : teamMembers.length > 0 ? (
              teamMembers.map((member, idx) => (
                <div key={member._id || idx} className="flex flex-col items-center">
                  <div className="md:w-72 w-full h-full md:h-72 rounded-2xl overflow-hidden shadow-lg bg-[#d6f0fa] flex items-center justify-center">
                    <Image src={member.image?.url || "/placeholder.jpeg"} alt={member.title} width={224} height={224} className="object-cover w-full h-full" />
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-bold text-md">{member.title}</div>
                    <div className="text-xs text-gray-600">{member.designation}</div>
                  </div>
                </div>
              ))
            ) : null}
          </div>
          {/* 
          <div className="mb-10 text-base text-gray-700">
            These individuals have not only mastered their craft but have also played a pivotal role in shaping the future of local artisans. Through years of dedication, they have created opportunities, launched training initiatives, and set new benchmarks in quality and innovation. Their deep understanding of cultural artistry, sustainable practices, and market trends ensures that every product we offer meets the highest standards while staying true to its roots.
          </div> */}

          {/* Contributions Section */}
          <div className="rounded-xl p-4 md:p-8 border border-gray-400">
            <h2 className="text-xl md:text-3xl font-bold mb-4 text-gray-800">Our Associate Partner’s Contributions Include:</h2>
            <ul className="list-decimal pl-6 text-sm md:text-lg text-gray-700 space-y-2">
              <li><span className="font-bold">Product Expertise & Guidance:</span> Recommending the most suitable gear for diverse terrains, climates, and expedition needs — from water sports to high-altitude adventures.
              </li>
              <li><span className="font-bold">Expedition Planning Support : </span> Assisting clients in selecting complete equipment kits tailored to specific challenges such as Himalayan treks, rescue missions, or survival training.
              </li>
              <li><span className="font-bold">Technical Knowledge & Safety Assurance :</span> Providing insights into the safe use of gear, compliance with global safety standards, and training support where needed .</li>
              <li><span className="font-bold">Field-Tested Innovation:</span> Testing products in real-world conditions to ensure durability, functionality, and performance before they reach our customers.
              </li>
              <li><span className="font-bold">Customer Service & After-Sales Support : </span> Delivering responsive, personalized service that builds long-term trust with adventure companies, guides, and individual explorers.
              </li>
              <li><span className="font-bold">Community Engagement & Local Upliftment : </span> Collaborating with local suppliers, trainers, and eco-tourism partners to strengthen grassroots businesses and promote sustainable practices
              </li>
              <li><span className="font-bold">Operations & Logistics Management : </span>  Ensuring timely delivery, inventory control, and seamless coordination — from warehouse to wilderness.
              </li>
              <li><span className="font-bold">Leadership & Training Development :  </span> Empowering new team members and clients through mentorship, internal training sessions, and a culture of shared growth.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;