import ServicesHero from "../components/ServicesHero";
import IndexOptionsPro from "../components/IndexOptionsPro";
import EquityPro from "../components/EquityPro";
import PlansSection from "../components/PlansSection";

export const metadata = {
  title: "Services - Good Investor",
  description:
    "Good Investor services and subscriptions: contact us on WhatsApp. No on-site payment gateway; arrangements are made with our team.",
};

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* <ServicesHero /> */}
      <PlansSection />
      {/* <IndexOptionsPro />
      <EquityPro /> */}
    </div>
  );
}
