"use client";
import Image from "next/image";
import Link from "next/link";

const VisionMission = () => {
  return (
    <section className="w-full bg-white min-h-screen">
      <div className="w-full">
        <div className="relative w-full h-[100px] md:h-[250px] flex items-center justify-center bg-white overlay-black-light">
          <Image
            src="/bg1.jpg"
            alt="About Banner"
            layout="fill"
            objectFit="cover"
            className="z-0 opacity-80"
            priority
          />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">Our Vision & Mission</h1>
          </div>
        </div>
        <div className="w-full container mx-auto flex gap-5 md:gap-10 items-center mt-10 px-5 md:px-20">
          {/* Left: Intro & Image */}
          <div className="w-full flex flex-col items-start">
            <h2 className="text-xl md:text-4xl font-bold mb-6 text-gray-800 text-start lg:text-start">“Equipping Every Adventure, Empowering Every Explorer.”</h2>
            <p className="text-md md:text-lg text-gray-700 leading-relaxed mb-6 text-start lg:text-justify">
              At PROTOS ADVENTURE, our journey is fueled by a passion for exploration and a commitment to excellence. As a leading force in the adventure equipment industry, we believe that every expedition begins with trust—in your gear, your team, and your purpose. Our vision and mission reflect our unwavering dedication to equipping explorers with the tools they need, and empowering businesses with solutions that go beyond products. Together, we aim to build a safer, stronger, and more inspired outdoor community.
            </p>
          </div>

        </div> {/* Right: Vision & Mission */}
        <div className="container mx-auto w-full flex flex-col md:flex-row gap-8 px-5 md:px-20">
          <div className="w-full md:w-2/3 flex justify-center mb-6 ">
            <Image src="/Vision.jpg" alt="Vision" width={300} height={300} className="rounded-xl shadow-lg object-cover w-fit h-auto " />
          </div>
          {/* Vision */}
          <div className="w-full md:w-1/2 flex-col mb-4">
            <div className="rounded-xl  p-6 mb-4 border border-gray-400">
              <h3 className="text-2xl font-bold mb-2 text-amber-700">Our Vision</h3>
              <p className="text-gray-700 text-base">
                To be the most trusted and innovative leader in outdoor adventure equipment, empowering individuals and organizations to explore the world safely, sustainably, and with confidence.
                <br />

                At PROTOS ADVENTURE, our vision is to inspire and support a global community of adventurers by delivering gear that meets the highest standards of safety, durability, and performance. We envision a world where outdoor exploration is accessible, responsible, and transformative—powered by reliable equipment and a deep respect for nature.
              </p>
            </div>
            {/* Mission */}
            <div className=" rounded-xl  p-6 border border-gray-400">
              <h3 className="text-2xl font-bold mb-2 text-amber-700">Our Mission</h3>
              <ul className="list-disc pl-6 text-gray-700 text-base space-y-2">
                <li>To provide world-class adventure equipment and solutions through global brand partnerships, expert guidance, and customer-first service—helping adventurers and businesses achieve excellence in every expedition.
                </li>
                <li>Our mission is to equip outdoor enthusiasts, professionals, and organizations with the finest gear available—while offering practical, innovative solutions that elevate their experience. With over 25 years of industry expertise, a commitment to sustainable practices, and a team driven by passion, we strive to be more than just a supplier—we’re your trusted adventure partner at every step of the journey.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>

  );
};

export default VisionMission;