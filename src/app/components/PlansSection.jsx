"use client";

import { whatsappUrl, SITE_PHONE_DISPLAY } from "@/app/lib/siteContact";

/**
 * Services page: contact-focused section (no plan cards / pricing grid).
 */
export default function PlansSection() {
  return (
    <div className="w-full py-16 sm:py-24 bg-linear-to-b from-white via-slate-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-4xl font-black text-neutral-900 mb-6">
          Services &amp;{" "}
          <span className="bg-linear-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
            subscriptions
          </span>
        </h2>
        <p className="text-neutral-700 text-md max-w-3xl mx-auto font-medium">
          Learn about our research and subscription options. We&apos;ll help you pick what fits your goals.
        </p>
        <p className="mt-4 text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          We do not use an online payment gateway on this site. To subscribe or ask questions, message us on{" "}
          <span className="font-semibold text-neutral-800">WhatsApp {SITE_PHONE_DISPLAY}</span>.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl(
              "Hi, I'd like to know more about Good Investor services and subscriptions.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-500 hover:shadow-lg"
          >
            WhatsApp {SITE_PHONE_DISPLAY}
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-sky-100/70 via-white to-teal-100/70 border border-sky-200/70 rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
            Need help choosing?
          </h3>
          <p className="text-neutral-700 mb-8 max-w-2xl mx-auto text-lg">
            Our team can explain offerings and next steps based on your profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl(
                "Hi, I have a question about Good Investor services. Can you assist?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:bg-emerald-500 hover:shadow-xl"
            >
              WhatsApp {SITE_PHONE_DISPLAY}
            </a>
            <a
              href="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 border-2 border-sky-600 text-sky-700 font-bold rounded-lg transition-all duration-300 hover:bg-sky-50"
            >
              Contact form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
