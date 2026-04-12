import HomeHero from "./components/HomeHero";
import TextPara from "./components/TextPara";
import Cards from "./components/Cards";
import ScrollAuthGate from "./components/ScrollAuthGate";
import { RevealBento } from "./components/Blocks";

export const metadata = {
  title: {
    absolute: "Good Investor - AI-Powered Market Insights",
  },
  description:
    "Empowering traders with AI-driven market insights. SEBI-registered research analyst providing expert trading strategies for equity, options, and commodities.",
};

export default function Home() {
  return (
    <ScrollAuthGate>
      <div className="relative isolate min-h-0 bg-[#0A192F]">
        <HomeHero />
        <TextPara />
        <Cards />
        <RevealBento />
      </div>
    </ScrollAuthGate>
  );
}
