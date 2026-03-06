"use client";

import React, { useState } from "react";

export default function ServiceAgreement({
  clientName = "Client Name",
  clientPan = "PAN000000000",
  signedDate = new Date().toLocaleDateString("en-IN"),
}) {
  const [showTOC, setShowTOC] = useState(false);

  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "definitions", title: "1. Definitions" },
    { id: "eligibility", title: "2. User Eligibility and Registration Terms" },
    { id: "scope", title: "3. Agreement Scope" },
    { id: "user-decl", title: "4. User Declarations" },
    { id: "provider-decl", title: "5. Service Provider Declarations" },
    {
      id: "services",
      title: "6. Scope of Services",
    },
    { id: "obligations", title: "7. User Obligations" },
    { id: "risks", title: "8. Risk Disclosures" },
    { id: "disclaimers", title: "9. Disclaimers" },
    { id: "grievance", title: "10. Grievance Redressal" },
    { id: "force-majeure", title: "11. Force Majeure Clause" },
    { id: "severability", title: "12. Severability & Final Terms" },
    { id: "annexure", title: "ANNEXURE - I" },
    { id: "mitc", title: "Most Important Terms and Conditions (MITC)" },
    { id: "signature", title: "Signature Section" },
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      {/* COLLAPSIBLE TABLE OF CONTENTS BUTTON */}
      <div className="w-full bg-linear-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-8 py-3">
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition"
          >
            📋 {showTOC ? "Hide" : "Show"} Table of Contents
          </button>
        </div>
      </div>

      {/* TABLE OF CONTENTS - COLLAPSIBLE */}
      {showTOC && (
        <div className="w-full bg-linear-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
          <div className="max-w-4xl mx-auto px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    const element = document.getElementById(section.id);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
                >
                  → {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="w-full bg-white p-8 agreement-text">
        <div
          className="max-w-4xl mx-auto text-gray-900 font-sans"
          style={{ fontSize: "11px", lineHeight: "1.6" }}
        >
          {/* PAGE 1 - HEADER */}
          <div className="text-center font-bold text-2xl mb-6 pb-4 border-b-4 border-black">
            SERVICE AGREEMENT
          </div>

          {/* CLIENT INFO BOX - HIGHLIGHTED */}
          <div className="mb-6 p-4 bg-yellow-300 border-4 border-yellow-500 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4 text-sm font-bold">
              <div>
                <p className="text-gray-700">Date of Agreement:</p>
                <p className="text-lg font-bold text-red-700">{signedDate}</p>
              </div>
              <div>
                <p className="text-gray-700">Client Name:</p>
                <p className="text-base font-bold">{clientName}</p>
              </div>
              <div>
                <p className="text-gray-700">Client PAN:</p>
                <p className="text-base font-bold">{clientPan}</p>
              </div>
              <div></div>
            </div>
          </div>

          {/* Introduction Section */}
          <div id="intro" className="mb-6 text-sm leading-relaxed">
            <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
              INTRODUCTION
            </h3>
            <p className="mb-3">
              This Service Agreement ("Agreement") is made and entered into as
              of <span className="font-bold">{signedDate}</span> (the "Signing
              Date") by and between:
            </p>

            <p className="mb-3">
              This Service Agreement ("Agreement") is made between{" "}
              <span className="font-bold">Sasikumar Peyyala</span>, having
              registered office at 1-2/4, 29/4, Kummaripalem center, Near DSM
              High School, Vidyadharapuram, Krishna (hereinafter referred to as
              "Service Provider" or "RA"); and{" "}
              <span className="font-bold">{clientName}</span> with PAN Number:{" "}
              <span className="font-bold">{clientPan}</span> (hereinafter
              referred to as "User").
            </p>

            <p>
              The Services Provider and the User are hereinafter individually
              referred to as a "Party" and collectively referred to as the
              "Parties".
            </p>
          </div>

          {/* Section 1: DEFINITIONS */}
          <div id="definitions" className="mb-6 text-sm">
            <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
              1. DEFINITIONS
            </h3>
            <ul className="space-y-1 ml-4">
              <li>
                <span className="font-bold">a. "User":</span> Any individual who
                avails services after consenting to this agreement.
              </li>
              <li>
                <span className="font-bold">b. "Service Provider":</span> A
                SEBI-registered Research Analyst (RA) with Number : INH000019327
                and BSE Enlistment Number : 6469
              </li>
              <li>
                <span className="font-bold">c. "Trademilaan":</span> refers to
                the Brand owned by the Service Provider which is used for
                managing facilitation of user KYC, digital signing of agreements
                and record keeping.
              </li>
            </ul>
          </div>

          {/* Section 2: USER ELIGIBILITY AND REGISTRATION TERMS */}
          <div id="eligibility" className="mb-6 text-sm">
            <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
              2. USER ELIGIBILITY AND REGISTRATION TERMS
            </h3>
            <ul className="space-y-1 ml-4">
              <li>
                <span className="font-bold">a. Legal Competency:</span> Only
                individuals who are legally competent to contract under
                applicable law may register.
              </li>
              <li>
                <span className="font-bold">
                  b. Minimum Age & KYC Compliance:
                </span>{" "}
                The User affirms they are at least 18 years of age and that all
                submitted details for KYC are current and accurate.
              </li>
              <li>
                <span className="font-bold">c. Registration Requirements:</span>{" "}
                Registration requires accurate information, completion of KYC,
                and agreement to these terms.
              </li>
            </ul>
          </div>

          {/* Section 3: AGREEMENT SCOPE */}
          <div id="scope" className="mb-6 text-sm">
            <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
              3. AGREEMENT SCOPE
            </h3>
            <ul className="space-y-1 ml-4">
              <li>
                <span className="font-bold">a. Nature of Services:</span> The
                User desires to access non-exclusive, non-binding
                recommendations from the Service Provider
              </li>
              <li>
                <span className="font-bold">b. Regulatory Compliance:</span> The
                The Service Provider holds a valid SEBI registration:
                SEBI:INH000019327 with registration date 07-January-2025.
              </li>
              <li>
                <span className="font-bold">c. Use and Risk Disclosure:</span>{" "}
                Recommendations are for the User’s personal investment decisions
                and subject to market risks.
              </li>
            </ul>
          </div>

          {/* Section 4: USER DECLARATIONS */}
          <div id="user-decl" className="mb-6 text-sm">
            <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
              4. USER DECLARATIONS
            </h3>
            <ul className="space-y-1 ml-4">
              <li>
                <span className="font-bold">a.</span> The User understands
                risks, makes investment decisions independently, and will not
                hold the Service Provider or Signalz liable for financial loss.
              </li>
              <li>
                <span className="font-bold">b.</span> Any investment made based
                on recommendations in research reports are subject to market
                risks, and recommendations do not provide any assurance of
                returns.
              </li>
              <li>
                <span className="font-bold">c.</span> There is no recourse to
                claim any losses incurred on the investments made based on the
                recommendations in the research report.
              </li>
              <li>
                <span className="font-bold">d.</span>Any reliance placed on the
                research report provided by the Service Provider shall be as per
                the user’s own judgement and assessment of the conclusions
                contained in the research report.
              </li>
              <li>
                <span className="font-bold">e.</span> The User agrees to
                maintain updated contact details and not to share confidential
                Research content or login credentials.
              </li>
              <li>
                <span className="font-bold">f.</span> In the event of RA
                suspension or SEBI action, prepaid fees will be refunded
                proportionately
              </li>
              <li>
                <span className="font-bold">g.</span> The User shall comply with
                all applicable laws
              </li>
              <li>
                <span className="font-bold">h.</span> User agrees to inform
                service provider information related to family members who have
                sought or are currently seeking services from services provider
                in the given financial year.
              </li>
              <li>
                <span className="font-bold">i.</span> The Service Provider shall
                never ask for the User's login credentials, OTPs, or access to
                Trading, Demat, or Bank accounts. The User shall never share
                such information with the Service Provider or authorize the
                Service Provider to execute trades on their behalf.
              </li>
              <li>
                <span className="font-bold">j.</span> User understands that in
                case of pre-mature termination of the RA services by either the
                User or the Service Provider, the User shall be entitled to seek
                refund of proportionate fees only for unexpired period, after
                deducting all the expenses Service Provider incurred to procure
                the user and all statutory liabilities
              </li>
              <li>
                <span className="font-bold">k.</span> User understands that the
                SEBI registration, Enlistment with RAASB, and NISM certification
                do not guarantee the performance of the Service Provider or
                assure any returns to the user.
              </li>
            </ul>
          </div>

          {/* PAGE 2 */}
          <div className="mt-12 pt-8 border-t-4 border-gray-800">
            {/* Section 5: SERVICE PROVIDER DECLARATIONS */}
            <div id="provider-decl" className="mb-6 text-sm">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
                5. SERVICE PROVIDER DECLARATIONS
              </h3>
              <ul className="space-y-1 ml-4">
                <li>
                  <span className="font-bold">a.Registration info:</span> It is
                  duly registered with SEBI as an Research Analyst pursuant to
                  the SEBI (Research Analysts) Regulations, 2014 and its
                  registration details are:
                  <ul className="space-y-1 ml-4 mt-1">
                    <li>Registration Number: INH000019327</li>
                    <p className="text-lg font-bold text-red-700">
                      {signedDate}
                    </p>
                    <li>
                      This registration is valid and subsisting as of the date
                      of execution of this Agreement.
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-bold">
                    b. Research-Based Signals Without Return Guarantee:
                  </span>{" "}
                  Recommendations are based on analysis but do not assure
                  returns
                </li>
                <li>
                  <span className="font-bold">
                    c. Fee Compliance and Advance Collection:
                  </span>
                  Fee charged by Service Provider to the User will be subject to
                  the maximum of amount prescribed by SEBI/ Research Analyst
                  Administration and Supervisory Body (RAASB).
                </li>
                <li>
                  <span className="font-bold">d.</span> Service Provider is
                  charging fees in advance as agreed by the User. This advance
                  does not exceed the period stipulated by SEBI; and in the
                  event of premature termination, refunds will be issued
                  proportionately after necessary deductions.
                </li>
                <li>
                  <span className="font-bold">e.</span> Service Provider cannot
                  execute/carry out any trade (purchase/sell transaction) on
                  behalf of the User.
                </li>
                <li>
                  <span className="font-bold">f.</span> Fees to Service Provider
                  is paid by the User through any of the specified modes like
                  cheque, online bank transfer, UPI, etc. Cash payment is not
                  allowed.
                </li>
                <li>
                  <span className="font-bold">g.</span> Abide by the applicable
                  regulations/ circulars/ directions specified by SEBI and RAASB
                  from time to time in relation to disclosure and mitigation of
                  any actual or potential conflict of interest. The Service
                  Provider will endeavor to promptly inform the User of any
                  conflict of interest that may affect the services being
                  rendered to the User
                </li>
                <li>
                  <span className="font-bold">h.</span> Any
                  assured/guaranteed/fixed returns schemes or any other schemes
                  of similar nature are prohibited by law. Hence, no scheme of
                  this nature is being offered to the User by the Service
                  Provider.
                </li>
              </ul>
            </div>

            {/* Section 6: SCOPE OF SERVICES */}
            <div id="services" className="mb-6 text-sm">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
                6. SCOPE OF SERVICES
              </h3>
              <ul className="space-y-1 ml-4">
                <li>
                  <span className="font-bold">a. Access to Services:</span>{" "}
                  Research services and Recommendations will be provided only to
                  registered Users for duration as per subscription terms
                  through the Signalz platform.
                </li>
                <li>
                  <span className="font-bold">b. Binding Terms:</span> Users
                  availing services are bound by the Terms of Service provided
                  on the official website
                </li>
                <li>
                  <span className="font-bold">c. Binding Terms:</span> The
                  latest Terms of Service can be accessed at
                  https://www.trademilaan.in/tnc
                </li>
              </ul>
            </div>

            {/* Section 7: USER OBLIGATIONS */}
            <div id="obligations" className="mb-6 text-sm">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
                7. USER OBLIGATIONS
              </h3>
              <ul className="space-y-1 ml-4">
                <li>
                  <span className="font-bold">a. Sole Discretion in Use:</span>{" "}
                  User may choose to act on recommendations at their sole
                  discretion.
                </li>
                <li>
                  <span className="font-bold">b. Compliance Obligations:</span>{" "}
                  The User shall furnish information as requested for
                  compliance.
                </li>
                <li>
                  <span className="font-bold">
                    c. Restriction on Redistribution:
                  </span>{" "}
                  User shall not distribute service content through any medium
                  without authorization.
                </li>
                <li>
                  <span className="font-bold">
                    d. Intellectual Property Rights:
                  </span>{" "}
                  Research Service and content is protected and must not be
                  reused without any prior permission or applicable laws
                </li>
              </ul>
            </div>

            {/* Section 8: RISK DISCLOSURES */}
            <div id="risks" className="mb-6 text-sm">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
                8. RISK DISCLOSURES
              </h3>
              <ul className="space-y-1 ml-4">
                <li>
                  <span className="font-bold">i) Market Risks Warning:</span>{" "}
                  "Investment in securities market are subject to market risks.
                  Read all the related documents carefully before investing."
                </li>
                <li>
                  <span className="font-bold">ii) Loss Possibility:</span>{" "}
                  Market risks may result in partial or permanent loss of
                  investments under certain market conditions.
                </li>
                <li>
                  <span className="font-bold">iii) SEBI Registration:</span>{" "}
                  Registration granted by SEBI and certification from NISM do
                  not guarantee the performance of the intermediary nor assure
                  returns to investors.
                </li>
                <li>
                  <span className="font-bold">iv) Past Performance:</span> Past
                  performance is not indicative of future results.
                </li>
                <li>
                  <span className="font-bold">
                    v) Risk Associated with Open Positions:
                  </span>{" "}
                  Our recommendations may be open; we may not provide any
                  stop-loss or target price in securities recommendations. This
                  will cause a huge loss on your portfolio in adverse market
                  conditions, company events or any event that may impact market
                  movement.
                </li>
                <li>
                  <span className="font-bold">vi) Technical Risk:</span>{" "}
                  Algorithmic trading systems depend on technology, including
                  internet connectivity, server uptime, broker APIs, and
                  third-party software. Any failure, delay, or malfunction in
                  these components may result in unintended trades or losses.
                </li>
                <li>
                  <span className="font-bold">vii) Operational Risk:</span>{" "}
                  There is a risk that the algorithm may not function as
                  intended due to bugs, logic errors, incorrect parameter
                  settings, or misinterpretation of market data. Manual
                  intervention may be required at times, especially in extreme
                  conditions.
                </li>
                <li>
                  <span className="font-bold">
                    viii) Regulatory and Broker Compliance:
                  </span>{" "}
                  All users must ensure that their algorithmic activities comply
                  with SEBI rules, exchange guidelines, and broker requirements.
                  Unauthorised access, misuse of systems, or violation of margin
                  norms can result in penalties or suspension.
                </li>
                <li>
                  <span className="font-bold">
                    ix) Discretion and Responsibility:
                  </span>{" "}
                  Users must understand that executing trades based on signals
                  or algorithms is at their own discretion. It is your
                  responsibility to assess suitability based on your financial
                  condition, risk tolerance, and trading knowledge.
                </li>
                <li>
                  <span className="font-bold">x) No Fiduciary Duty:</span> The
                  service provider does not act as a portfolio manager or
                  fiduciary. The role is limited to providing tools,
                  infrastructure, or signals, not managing client funds in any
                  case.
                </li>
              </ul>
            </div>
          </div>

          {/* PAGE 3 */}
          <div className="mt-12 pt-8 border-t-4 border-gray-800">
            {/* Section 9: DISCLAIMERS */}
            <div id="disclaimers" className="mb-6 text-sm">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
                9. DISCLAIMERS
              </h3>
              <ul className="space-y-1 ml-4">
                <li>
                  <span className="font-bold">a.</span> Neither the Service
                  Provider nor Algotest guarantees returns.
                </li>
                <li>
                  <span className="font-bold">b.</span> Algotest is not
                  responsible for accuracy of the content provided by Service
                  Provider or the advices given outside of Algotest platform.
                </li>
              </ul>
            </div>

            {/* Section 10: GRIEVANCE REDRESSAL */}
            <div id="grievance" className="mb-6 text-sm">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
                10. GRIEVANCE REDRESSAL
              </h3>
              <ul className="space-y-1 ml-4">
                <li>
                  <span className="font-bold">a. Step 1:</span> Email initial
                  complaints to spkumar.researchanalyst@gmail.com
                </li>
                <li>
                  <span className="font-bold">b. Step 2:</span> Escalate
                  unresolved issues to spkumar.researchanalyst@gmail.com.
                </li>
                <li>
                  <span className="font-bold">c. Step 3:</span> If unresolved,
                  lodge with SEBI via SCORES (www.scores.sebi.gov.in) or Smart
                  ODR (https://smartodr.in).
                </li>
                <li>
                  <span className="font-bold">d.</span> All grievances will be
                  addressed within 21 (twenty-one) business days or as per
                  latest SEBI RA Regulations.
                </li>
              </ul>
            </div>

            {/* Section 11: FORCE MAJEURE CLAUSE */}
            <div id="force-majeure" className="mb-6 text-sm">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
                11. KYC & Force Majeure
              </h3>
              <ul className="space-y-1 ml-4">
                <li>
                  <span className="font-bold">a.</span> If the User's KYC (Know
                  Your Customer) details are not available or registered with a
                  KYC Registration Agency (KRA) at the time of subscribing to a
                  Service Provider, the User will not be able to avail the
                  services until the KYC is registered/approved by KRA agency.
                </li>
                <li>
                  <span className="font-bold">b.</span> KYC verification with
                  the relevant KRA is mandatory before subscribing to any
                  service
                </li>
                <li>
                  <span className="font-bold">c.</span> Users must ensure their
                  KYC is successfully registered with a KRA before proceeding
                  with any subscription.
                </li>
                <li>
                  <span className="font-bold">d.</span> Neither Service Provider
                  nor Algotest will be liable for service disruptions due to
                  force majeure events.
                </li>
                <li>
                  <span className="font-bold">e.</span> The Service provider
                  including its principals, partners, employees, affiliates,
                  agents, representatives, and subcontractors, shall not be
                  liable for losses or damages caused by or resulting from any
                  event of force majeure beyond its control including, but not
                  limited to, acts of civil or military authority, national
                  emergencies, fire, flood, catastrophe, act of God, explosion,
                  war, riot, theft, accident, nationalization, expropriation,
                  currency restrictions, pandemic, lock-down imposed by
                  governmental authorities, other measures taken by any
                  government or agency of any country, state or territory in the
                  world, actions taken by any regulatory authority regulating
                  asset managers, amendments to Applicable Laws, industrial
                  action or labour disturbances of any nature amongst employees
                  of Service provider or of its agents or of any third parties,
                  boycotts, work stoppages, power failures or breakdowns in
                  communication links or equipment (including, but not limited
                  to, loss of electronic data), international conflicts, violent
                  or armed actions, acts of terrorism, insurrection, revolution,
                  or failure or disruption of any relevant stock exchange,
                  clearinghouse, clearing or settlement systems or market.
                </li>
                <li>
                  <span className="font-bold">f.</span> In the event of
                  equipment breakdowns beyond Service provider's and Algotest's
                  control, the Service provider shall take reasonable steps to
                  minimize service interruptions but shall have no liability
                  with respect thereto.
                </li>
                <li>
                  <span className="font-bold">g.</span> The Service provider
                  also disclaim any liability for future consequences arising
                  under the Prevention of Money Laundering Act, 2002, or any
                  analogous legislation, regulations, or rules.
                </li>
              </ul>
            </div>

            {/* Section 12: SEVERABILITY & FINAL TERMS */}
            <div id="severability" className="mb-6 text-sm">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-400">
                12. SEVERABILITY & FINAL TERMS
              </h3>
              <ul className="space-y-1 ml-4">
                <li>
                  <span className="font-bold">a.</span> If any part of the
                  Agreement is held unenforceable, the remaining provisions will
                  remain in effect.
                </li>
                <li>
                  <span className="font-bold">b.</span> Key terms regarding
                  tenure, jurisdiction, termination, and arbitration are defined
                  in Appendix 1.
                </li>
                <li>
                  <span className="font-bold">c.</span> The User acknowledges
                  that they have reviewed and understood these description as
                  provided by the Service provider of subscription.
                </li>
              </ul>
            </div>
          </div>

          {/* PAGE 4 - ANNEXURE-I */}
          <div id="annexure" className="mt-12 pt-8 border-t-4 border-gray-800">
            <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-gray-400">
              ANNEXURE - I
            </h3>

            <div className="mb-4 text-sm">
              <p className="mb-2">
                This Agreement shall be effective as of{" "}
                <span className="font-bold">{signedDate}</span> (the "Effective
                Date").
              </p>

              <div className="mb-3">
                <p className="font-bold mb-1">a) Acceptance</p>
                <p>
                  This Agreement shall be deemed accepted by the User upon
                  acknowledgement or signature. However, the Agreement shall not
                  become operational until the User has completed both the
                  payment and KYC (Know Your Customer) process.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">b) Pre-Service Period</p>
                <p>
                  If the User accepts this Agreement but does not complete the
                  subscription purchase (including payment and KYC), the
                  Agreement shall remain valid for a period of thirty (30)
                  calendar days from the date of acceptance and User fulfill the
                  payment and KYC requirements within this period, the Agreement
                  shall be activated and the start and end dates of the services
                  will be communicated to the User via email or other written
                  communication.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">c) Service Activation</p>
                <p>
                  The service period will commence only upon successful
                  completion of payment and KYC. The activation date shall be
                  the date on which both conditions are fulfilled. The end date
                  of the services will be calculated based on the agreed service
                  duration from the activation date. These dates shall be
                  officially communicated to the User and shall form an integral
                  part of this Agreement.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">d) Expiry</p>
                <p>
                  If the payment and KYC are not completed within the thirty
                  (30) day window, the Agreement shall automatically expire, and
                  neither party shall hold any rights or obligations under this
                  Agreement unless a new agreement is executed.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">e) Fees</p>
                <p>
                  The User agrees to pay the Service Provider the applicable
                  fees for the services, including any statutory taxes or
                  levies. The payments shall be made through the designated
                  payment gateways or processors as specified by Algotest. The
                  Research Analyst (RA) shall collect the total fee from the
                  User. The fee will be processed through Algotest's configured
                  payment gateway, which will split the payment—allocating the
                  advisory fee to the RA and the facilitation/delivery charges
                  to Algotest.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">f) Arbitration</p>
                <p>
                  The Parties agree to act in good faith to resolve any disputes
                  or differences arising under or related to this Agreement
                  through mutual discussion.
                </p>
                <p>
                  If disputes remain unresolved, they shall be submitted to
                  arbitration per SEBI's grievance redressal mechanism, if
                  applicable. In cases beyond SEBI's jurisdiction, arbitration
                  will be conducted as per the Arbitration and Conciliation Act,
                  1996, including amendments thereto.
                </p>
              </div>
            </div>
          </div>

          {/* PAGE 5 - ANNEXURE-I continuation */}
          <div className="mt-8 text-sm">
            <div className="mb-4 text-sm">
              <div className="mb-3">
                <p className="font-bold mb-1">
                  g) Governing Law and Jurisdiction
                </p>
                <p>
                  This Agreement shall be governed and interpreted in accordance
                  with the laws of India. The Parties agree to submit to the
                  exclusive jurisdiction of the courts of Andhra Pradesh for any
                  legal proceedings.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">h) Service Identification</p>
                <p>
                  This Agreement specifically pertains to the service titled
                  "Service Name" as displayed on Algotest, hereinafter referred
                  to as "the Service".
                </p>
                <p className="mt-2">
                  The Service is being provided by Sasikumar Peyyala
                  (hereinafter referred to as "the Service Provider") and
                  purchased by the User. This clause ensures clarity by
                  explicitly stating that the Agreement applies only to the
                  above-mentioned service among the various offerings by the
                  Service Provider.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">
                  i) Termination Process and Refund Timeline
                </p>
                <p>
                  The User shall be eligible for a pro-rata refund as per the
                  refund clause. Any eligible refund shall be processed by the
                  Service Provider within 15 business days from the date of
                  confirmation of termination. Access to subscription services
                  shall cease at the end of the notice period. Refunds will be
                  applicable only to the advisory fee component; delivery and
                  facilitation charges are non-refundable, being costs already
                  incurred for service activation.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">j) Subscription Description</p>
                <p>
                  The subscription availed by the User is governed by the
                  description and scope provided by the Service Provider. This
                  includes features, limitations, and specific deliverables
                  associated with the subscription and is hereby incorporated
                  into this Agreement by reference.
                </p>
                <p className="mt-2">
                  The Service Provider reserves the right to revise or update
                  the subscription description due to changes in scope,
                  structure, or regulatory compliance. Users will be notified of
                  such changes via their registered email. Continued use of the
                  services for more than 7 days post-notification shall be
                  considered acceptance of the new terms. If the User disagrees,
                  they may opt to discontinue and seek a proportionate refund in
                  line with the refund policy.
                </p>
              </div>

              <div className="mb-3">
                <p className="font-bold mb-1">
                  k) Subscription Details and Service Selection
                </p>
                <p>
                  The final combination of services, mentorship arrangements,
                  and related subscription specifics shall be selected by the
                  User at the time of payment, not at the time of executing the
                  Most Important Terms and Conditions (MITC).
                </p>
                <p className="mt-2">
                  MITC execution is done at the subscription level and does not
                  imply finalization of service combinations. The exact
                  subscription start and end dates will be confirmed and
                  communicated via email upon activation and shall be considered
                  a binding part of this Agreement.
                </p>
              </div>
            </div>
          </div>

          {/* PAGE 6-7 - MOST IMPORTANT TERMS AND CONDITIONS */}
          <div id="mitc" className="mt-12 pt-8 border-t-4 border-gray-800">
            <div className="mb-6 text-sm bg-yellow-50 p-4 border-l-8 border-yellow-600 rounded">
              <p className="font-bold mb-2">
                MOST IMPORTANT TERMS AND CONDITIONS (MITC)
              </p>
              <p className="text-xs italic mb-3">
                [Forming part of the Terms and Conditions for providing research
                services]
              </p>

              <ol className="space-y-2 ml-4">
                <li>
                  <span className="font-bold">1.</span> These terms and
                  conditions, and consent thereon, are for the research services
                  provided by the Research Analyst (RA) and RA cannot
                  execute/carry out any trade (purchase/sell transaction) on
                  behalf of, the client. Thus, the clients are advised not to
                  permit RA to execute any trade on their behalf.
                </li>
                <li>
                  <span className="font-bold">2.</span> The fee charged by RA to
                  the client will be subject to the maximum of amount prescribed
                  by SEBI/ Research Analyst Administration and Supervisory Body
                  (RAASB) from time to time (applicable only for Individual and
                  HUF Clients).
                  <ul className="space-y-1 ml-4 mt-1">
                    <li>
                      a. The current fee limit is Rs 1,51,000/- per annum per
                      family of client for all research services of the RA.
                    </li>
                    <li>
                      b. The fee limit does not include statutory charges.
                    </li>
                    <li>
                      c. The fee limits do not apply to a non-individual client
                      / accredited investor.
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-bold">3.</span> RA may charge fees in
                  advance if agreed by the client. Such advance shall not exceed
                  the period stipulated by SEBI; presently it is one quarter. In
                  case of pre-mature termination of the RA services by either
                  the client or the RA, the client shall be entitled to seek
                  refund of proportionate fees only for unexpired period.
                </li>
                <li>
                  <span className="font-bold">4.</span> Fees to RA may be paid
                  by the client through any of the specified modes like cheque,
                  online bank transfer, UPI, etc. Cash payment is not allowed.
                  Optionally the client can make payments through Centralized
                  Fee Collection Mechanism (CeFCoM) managed by BSE Limited (i.e.
                  currently recognized RAASB).
                </li>
                <li>
                  <span className="font-bold">5.</span> The RA is required to
                  abide by the applicable regulations/ circulars/ directions
                  specified by SEBI and RAASB from time to time in relation to
                  disclosure and mitigation of any actual or potential conflict
                  of interest. The RA will endeavor to promptly inform the
                  client of any conflict of interest that may affect the
                  services being rendered to the client.
                </li>
                <li>
                  <span className="font-bold">6.</span> Any
                  assured/guaranteed/fixed returns schemes or any other schemes
                  of similar nature are prohibited by law. No scheme of this
                  nature shall be offered to the client by the RA.
                </li>
                <li>
                  <span className="font-bold">7.</span> The RA cannot guarantee
                  returns, profits, accuracy, or risk-free investments from the
                  use of the RA's research services. All opinions, projections,
                  estimates of the RA are based on the analysis of available
                  data under certain assumptions as of the date of
                  preparation/publication of research report.
                </li>
                <li>
                  <span className="font-bold">8.</span> Any investment made
                  based on recommendations in research reports are subject to
                  market risks, and recommendations do not provide any assurance
                  of returns. There is no recourse to claim any losses incurred
                  on the investments made based on the recommendations in the
                  research report. Any reliance placed on the research report
                  provided by the RA shall be as per the client's own judgement
                  and assessment of the conclusions contained in the research
                  report.
                </li>
                <li>
                  <span className="font-bold">9.</span> The SEBI registration,
                  Enlistment with RAASB, and NISM certification do not guarantee
                  the performance of the RA or assure any returns to the client.
                </li>
                <li>
                  <span className="font-bold">10.</span> For any grievances:
                  <ul className="space-y-1 ml-4 mt-1">
                    <li>
                      Step 1: the client should first contact the RA using the
                      details on its website or following contact details: (RA
                      to provide details as per "Grievance Redressal /
                      Escalation Matrix")
                    </li>
                    <li>
                      Step 2: If the resolution is unsatisfactory, the client
                      can also lodge grievances through SEBI's SCORES platform
                      at www.scores.sebi.gov.in
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-bold">11.</span> Clients are required to
                  keep contact details, including email id and mobile number/s
                  updated with the RA at all times.
                </li>
                <li>
                  <span className="font-bold">12.</span> The RA shall never ask
                  for the client's login credentials and OTPs for the client's
                  Trading Account, Demat Account and Bank Account. Never share
                  such information with anyone including RA.
                </li>
              </ol>

              <div className="mt-6 pt-4 border-t-2 border-yellow-400">
                <p className="font-bold mb-2">Investor Charter</p>
                <p>
                  For investor charter please visit:
                  www.trademilaan.in/investor-charter
                </p>
              </div>
            </div>
          </div>

          {/* PAGE 8 - SIGNATURE SECTION */}
          <div id="signature" className="mt-12 pt-8 border-t-4 border-gray-800">
            <h3 className="font-bold text-lg mb-6 pb-2 border-b-2 border-gray-400">
              SIGNATURE SECTION
            </h3>

            {/* Signature Table - Two Columns */}
            <div className="border-2 border-gray-900 mb-6">
              {/* Header Row */}
              <div className="grid grid-cols-2 border-b-2 border-gray-900">
                <div className="p-4 border-r-2 border-gray-900 font-bold text-center text-sm">
                  SIGNED AND DELIVERED
                  <br />
                  <span className="text-xs font-normal">
                    By the within named "Service Provider"
                  </span>
                </div>
                <div className="p-4 font-bold text-center text-sm">
                  SIGNED AND DELIVERED
                  <br />
                  <span className="text-xs font-normal">
                    By the within named "User"
                  </span>
                </div>
              </div>

              {/* Name Row */}
              <div className="grid grid-cols-2 border-b-2 border-gray-900">
                <div className="p-4 border-r-2 border-gray-900">
                  <p className="font-bold text-sm">Name: Sasikumar Peyyala</p>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm">Name: {clientName}</p>
                </div>
              </div>

              {/* Signature Row */}
              <div className="grid grid-cols-2 border-b-2 border-gray-900">
                <div className="p-8 border-r-2 border-gray-900">
                  <p className="border-b-2 border-black mt-4 h-16"></p>
                  <p className="text-xs font-bold text-center mt-1">
                    Signature
                  </p>
                </div>
                <div className="p-8">
                  <p className="border-b-2 border-black mt-4 h-16"></p>
                  <p className="text-xs font-bold text-center mt-1">
                    Signature
                  </p>
                </div>
              </div>

              {/* Details Row */}
              <div className="grid grid-cols-2">
                <div className="p-4 border-r-2 border-gray-900 text-xs">
                  <p className="font-bold">SEBI RA Number: INH000019327</p>
                  <p>Registration Date: 07-January-2025</p>
                  <p className="mt-2">Date: _________________</p>
                </div>
                <div className="p-4 text-xs">
                  <p className="font-bold">PAN: {clientPan}</p>
                  <p>Signed by: {clientName}</p>
                  <p className="mt-2">Date: {signedDate}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-600 mt-8 pt-4 border-t-2 border-gray-400">
              <p className="font-bold mb-2">DIGITAL CERTIFICATE</p>
              <p>[Electronic Signature Verified]</p>
              <p className="mt-3">
                This is an electronically generated document and does not
                require a physical signature.
              </p>
              <p>This document has been digitally signed and certified.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
