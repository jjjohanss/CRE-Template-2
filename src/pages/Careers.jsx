import React from "react";
import { Mail, Briefcase } from "lucide-react";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";

export default function Careers() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Page Header */}
      <div className="px-6 pt-32 pb-12 bg-[#F5F5F7]">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
            Opportunities
          </span>
          <h1 className="text-neutral-900 text-4xl md:text-5xl font-bold mt-2">
            Careers
          </h1>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-3" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 py-16">
        {/* Join Our Team */}
        <section className="mb-16">
          <h2 className="text-[#0A1628] text-2xl font-bold tracking-tight mb-6">
            JOIN OUR TEAM
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you're ready to join an organization committed to your success, consider a role with Faris Lee Investments. We are a high level organization with opportunities in Retail Commercial Real Estate brokerage, advisory services, financial analysis, real estate underwriting, and capital strategies. We offer an exciting place to begin or further your career, backed by our reputation as a top notch leadership firm that can accelerate your success.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Please forward your resume or employment inquiry to{" "}
            <a href="mailto:careers@farislee.com" className="text-[#C8102E] font-medium hover:underline">
              careers@farislee.com
            </a>
            .
          </p>
        </section>

        {/* We Are Hiring */}
        <section className="mb-16 bg-white border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-[#C8102E]" />
            <h2 className="text-[#0A1628] text-xl font-bold tracking-tight uppercase">
              We Are Hiring
            </h2>
          </div>
          <p className="text-gray-700 font-medium mb-2">
            Junior, Mid-Level, and Senior Retail Investment Sales Broker
          </p>
          <p className="text-gray-600 text-sm">
            Send your resume at{" "}
            <a href="mailto:careers@farislee.com" className="text-[#C8102E] font-medium hover:underline">
              Careers@farislee.com
            </a>
          </p>
        </section>

        {/* Entry / Mid-Level Role */}
        <section className="mb-16">
          <h2 className="text-[#0A1628] text-xl font-bold tracking-tight uppercase mb-6 pb-2 border-b border-gray-200">
            Entry Level and Mid-Level Retail Investment Sales Agent – Job Description
          </h2>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Company Overview
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Company is a nationally recognized investment brokerage and capital markets firm specializing in retail real estate. The firm has unmatched insight and real-time, street-level knowledge of market conditions, buyer pools, capital markets, and a forward-looking perspective on value and pricing. For these reasons, the company is engaged by private and institutional investors, owner/operators, developers, family offices and private equity firms throughout the nation. The firm is known for implementing creative strategies that maximize value.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Great opportunities have arisen for an entry level and mid-level Retail Investment Sales Agents at Faris Lee Investments. As a member of the team, you will be a part of a talented and driven team that thrives on working together in a fast-paced environment and using initiative to create opportunities. We are seeking a natural relationship-builder to form close working relationships and deliver the highest standards of service to clients.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Objectives of this Role
            </h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li>Be responsible for the end-to-end management of deals for the sale of retail properties, ensuring a positive client experience</li>
              <li>Act as the main point of contact between property owners and prospective buyers to ensure a fair dealing for all parties</li>
              <li>Assist sellers in promoting their properties for sale, and offer advice to interested buyers</li>
              <li>Negotiate and prepare relevant paperwork (contracts, deeds, leases, etc.) prior to the sale of a property</li>
              <li>Perform comparative market analysis to accurately value retail properties</li>
              <li>Conduct research on the local market and stay up-to-date on industry trends</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Daily and Monthly Responsibilities
            </h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li>Advise clients in the development and execution of their individualized real estate investment strategies</li>
              <li>Formulate thoughtful analyses of clients' properties, including broker opinions of value (BOV), market comparables, and research</li>
              <li>Prepare marketing materials for exclusive property listings and promote to qualified buyers</li>
              <li>Prospect new client relationships, and network with other industry professionals</li>
              <li>Negotiate exclusive listing agreements, and purchase and sales agreements</li>
              <li>Prepare and manage documentation and internal databases to ensure most up-to-date property and client information is on record</li>
              <li>Participate in best-in-class training and ongoing skills-development workshops</li>
              <li>Partner closely with other members of staff to ensure knowledge sharing and cross-team collaboration</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Skills and Qualifications
            </h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li>A self-motivated and ambitious real estate professional</li>
              <li>Well-developed communication and relationship-building skills</li>
              <li>Excellent multitasker and enjoy working in a fast-paced environment</li>
              <li>A high level of personal responsibility, honesty, and empathy</li>
              <li>Goal-oriented with a focus on personal development</li>
              <li>Ability to bounce back from rejection, and solve problems creatively</li>
              <li>Good knowledge of the local property market</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Preferred Qualifications
            </h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li>Bachelor's degree in a relevant field (BA/BS)</li>
              <li>California Real Estate License</li>
            </ul>
          </div>

          <p className="text-gray-500 text-sm italic">
            Note: This is a commission based independent contractor position.
          </p>
        </section>

        {/* Senior Role */}
        <section className="mb-16">
          <h2 className="text-[#0A1628] text-xl font-bold tracking-tight uppercase mb-6 pb-2 border-b border-gray-200">
            Senior Retail Investment Sales Agent – Job Description
          </h2>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-gray-600 leading-relaxed">
              The role of the Seasoned Retail Investment Sales Agent entails business development and execution, with a focus on creating new relationships, as well as expanding existing relationships with investors, developers, owner/users, family offices, regional operators and select institutions nationally. This includes infiltrating and influencing decision-makers at the highest levels within the defined client profiles and leveraging these relationships into revenue generating opportunities. The role of the Seasoned Retail Investment Sales Agent is strategic and is an integral part of the business group's succession planning.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Key Responsibilities
            </h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li><span className="font-medium text-[#0A1628]">Business Development</span></li>
              <li>Create awareness and build relationships with key industry executives.</li>
              <li>Assist the team with qualifying and winning opportunities.</li>
              <li>Develop as well as pursue leads and opportunities.</li>
              <li>Develop as well as execute business development initiatives.</li>
              <li>Report on progress as directed.</li>
              <li>Work closely with other team members to drive business development. This will require teamwork, fostering of relationships, and developing consensus.</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Requirements
            </h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li>Successful track record of selling services to family offices, regional operators, institutions and other similar owners of retail assets.</li>
              <li>Successful business relationships with clients/executives within the targeted industry segment.</li>
              <li>Strong presentation skills.</li>
              <li>Strong real estate and investment/finance knowledge</li>
              <li>Ability to influence decision-makers at the highest levels.</li>
              <li>Consistent track record in driving revenue in this environment.</li>
              <li>Strong interpersonal skills including rapport building, listening, social versatility, courtesy and concern.</li>
              <li>Solid sales skills with proper preparation disciplines. Must possess solid communication skills including the ability to present an accurate and compelling overview.</li>
              <li>High level business acumen including the business environment, market forces, the client's retail real estate portfolio, markets, customers and competitors.</li>
              <li>Capacity to drive the business development strategy with an opportunity plan that includes specific objectives, appropriate strategies, and detailed tactics.</li>
              <li>Ability to project and anticipate the strategies employed by each competitor and the skill to craft successful, proactive strategies for winning business.</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-2">
              Education / Experience
            </h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li>Undergraduate degree required; Advanced degree(s) preferred.</li>
              <li>California Real Estate License</li>
              <li>Commercial Real Estate experience of 3+ years; retail preferred.</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-white border border-gray-100 shadow-sm p-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            If you are interested in one of the opportunities, please email your resume at{" "}
            <a href="mailto:careers@farislee.com" className="text-[#C8102E] font-medium hover:underline">
              careers@farislee.com
            </a>
          </p>
          <a
            href="mailto:careers@farislee.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#a00d24] transition-colors duration-200"
          >
            <Mail className="w-4 h-4" />
            Apply Now
          </a>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}