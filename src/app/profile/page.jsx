"use client";

import { useRouter } from "next/navigation";
import Protected from "../components/Protected";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  // State for form fields
  const [riskForm, setRiskForm] = useState({
    years: "",
    job: "",
    savings: "",
    support: "",
    annual: "",
    objective: "",
    understanding: "",
    strategy: "",
    volatility: "",
    riskiest: "",
    reaction: "",
    taker: "",
  });
  const [formStatus, setFormStatus] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState(null);

  // Restore navigation handlers
  const goHome = () => router.push("/");
  const goToAdminDashboard = () => router.push("/admin-dashboard");

  // Handler for radio change
  const handleRiskFormChange = (key, value) => {
    setRiskForm((prev) => ({ ...prev, [key]: value }));
  };

  // Handle form submit (save to MongoDB via API)
  const handleRiskFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("Saving...");
    try {
      const res = await fetch("/api/risk-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, riskForm }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormStatus("Your responses have been stored successfully!");
        setSubmittedAnswers(riskForm);
      } else {
        setFormStatus(data.error || "Failed to save");
        setSubmittedAnswers(null);
      }
    } catch (err) {
      setFormStatus("Error: " + err.message);
      setSubmittedAnswers(null);
    }
  };

  return (
    <Protected>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-lime-50/40 px-4 py-24 md:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-neutral-200/70 bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-neutral-500">
                Signed in as
              </p>
              <h1 className="text-2xl font-bold text-neutral-900 leading-tight">
                {user?.username || "User"}
              </h1>
              <p className="text-sm text-neutral-600">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === "admin" && (
                <button
                  onClick={goToAdminDashboard}
                  className="hidden sm:inline-flex rounded-full bg-lime-500 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-600 transition"
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={goHome}
                className="hidden sm:inline-flex rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition"
              >
                Back to home
              </button>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Name
              </p>
              <p className="text-base font-semibold text-neutral-900">
                {user?.username || "Not set"}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Email
              </p>
              <p className="text-base font-semibold text-neutral-900">
                {user?.email || "Not set"}
              </p>
            </div>
          </div>

          {/* Risk Profile Form */}
          <form className="mt-10" onSubmit={handleRiskFormSubmit}>
            <h2 className="text-lg font-bold text-neutral-900 mb-2">
              Risk Capacity
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">
                  The number of years you have until retirement is:
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Less than 5 years/ retired/ not applicable",
                    "About 5 - 15 years",
                    "About 15 - 25 years",
                    "More than 25 years",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="years"
                        value={option}
                        checked={riskForm.years === option}
                        onChange={() => handleRiskFormChange("years", option)}
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  Your present job or business is:
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Less secure/ Not Applicable",
                    "Relatively secure",
                    "Secure",
                    "Doesn’t matter as you can easily find a good new job/ career",
                    "Doesn’t matter as you already have enough wealth",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="job"
                        value={option}
                        checked={riskForm.job === option}
                        onChange={() => handleRiskFormChange("job", option)}
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  If your current source of income were to stop today, for how
                  long will your present savings support you?
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Less than 3 months",
                    "3 - 6 months",
                    "6 months to 1 year",
                    "More than 1 year",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="savings"
                        value={option}
                        checked={riskForm.savings === option}
                        onChange={() => handleRiskFormChange("savings", option)}
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  You have to financially support:
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Only myself",
                    "Two people including myself",
                    "3 - 4 people other than myself",
                    "More than 4 people other than myself",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="support"
                        value={option}
                        checked={riskForm.support === option}
                        onChange={() => handleRiskFormChange("support", option)}
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  Your current annual family savings (income less expenses) are:
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Under ₹2,00,000",
                    "Between ₹2,00,000 and ₹5,00,000",
                    "Between ₹5,00,000 and ₹10,00,000",
                    "Over ₹10,00,000",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="annual"
                        value={option}
                        checked={riskForm.annual === option}
                        onChange={() => handleRiskFormChange("annual", option)}
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  Which of these objectives is the most important to you from an
                  investment perspective?
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Preserving wealth",
                    "Generating regular income to meet current requirements",
                    "Balance current income and long-term growth",
                    "Long-term growth",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="objective"
                        value={option}
                        checked={riskForm.objective === option}
                        onChange={() =>
                          handleRiskFormChange("objective", option)
                        }
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-neutral-900 mb-2 mt-10">
              Risk Tolerance
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">
                  Which of the following best describes your understanding of
                  the investment market?
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "An experienced investor, constantly keeps up to date with the investment market. Have exposure to various asset classes and fully aware of the risks involved to gain high returns",
                    "Awareness of the financial market is limited to information passed on by broker or financial planner. Rely on professionals to keep me updated",
                    "Little awareness of the investment market. However, want to build my knowledge and understanding",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="understanding"
                        value={option}
                        checked={riskForm.understanding === option}
                        onChange={() =>
                          handleRiskFormChange("understanding", option)
                        }
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  Your preferred strategy for managing investment risk is:
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Do not want to reduce it as investment risk leads to higher returns over the long-term",
                    "To have a diversified investment portfolio across a range of asset classes to minimize risk.",
                    "To invest mainly in capital stable investments.",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="strategy"
                        value={option}
                        checked={riskForm.strategy === option}
                        onChange={() =>
                          handleRiskFormChange("strategy", option)
                        }
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  An investment portfolio with high exposure to growth assets
                  tends to generate higher returns, albeit with some volatility
                  (fluctuations in value). To what extent are you willing to
                  experience shorter-term losses/ volatility to generate higher
                  returns?
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Very comfortable. I understand higher returns may come with risk or fluctuation in the short term. However, over the long-term, there is a low risk of capital loss",
                    "Somewhat comfortable, assuming there is a limit to the volatility",
                    "Little uncomfortable seeing my investments fluctuate",
                    "More comfortable with investments that have minimal volatility",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="volatility"
                        value={option}
                        checked={riskForm.volatility === option}
                        onChange={() =>
                          handleRiskFormChange("volatility", option)
                        }
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  Given below is a listing of investment choices from least
                  risky to most risky. Which is the riskiest option you have
                  invested in?
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Savings Account, Fixed Deposit or Money Market Funds",
                    "Bonds or Debt Mutual Funds",
                    "Equity Mutual Funds",
                    "Real Estate Funds/ Commodity linked Products",
                    "Equity Shares/ Structured Products",
                    "Private Equity/ Venture Capital Funds",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="riskiest"
                        value={option}
                        checked={riskForm.riskiest === option}
                        onChange={() =>
                          handleRiskFormChange("riskiest", option)
                        }
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  Over a three-month period, an investment you owned lost 20%
                  and the overall stock market lost 20%. With the economic
                  climate ambiguous, it could plummet further or bounce right
                  back up, how would you react?
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Sell all of my investments. (The preservation of capital is extremely important to me and I would rather not take the risk)",
                    "Sell some of the investment. (The climate is risky, and I would rather transfer my funds into more secure investments)",
                    "Do nothing with the investment. (This was a calculated risk, and I will leave the investments in place, expecting performance to improve)",
                    "Buy more of the investment. (I am a long-term investor and consider this sudden market correction as an opportunity to purchase additional shares at a lower cost basis)",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="reaction"
                        value={option}
                        checked={riskForm.reaction === option}
                        onChange={() =>
                          handleRiskFormChange("reaction", option)
                        }
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  How would you describe yourself as a risk-taker?
                </p>
                <div className="flex flex-col gap-2 ml-6">
                  {[
                    "Willing to take risks for higher return",
                    "Can take calculated risks",
                    "Low risk taking capability",
                    "Extremely averse to risk",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="taker"
                        value={option}
                        checked={riskForm.taker === option}
                        onChange={() => handleRiskFormChange("taker", option)}
                        className="accent-lime-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 px-6 py-2 rounded-full bg-lime-600 text-white font-semibold hover:bg-lime-700 transition"
            >
              Submit
            </button>
            {formStatus && (
              <p className="mt-2 text-sm text-lime-700 font-semibold">
                {formStatus}
              </p>
            )}
            {submittedAnswers && (
              <div className="mt-6 p-4 bg-lime-50 border border-lime-200 rounded-xl">
                <h3 className="font-bold mb-2 text-lime-800">
                  Your submitted responses:
                </h3>
                <ul className="text-sm text-lime-900 space-y-1">
                  {Object.entries(submittedAnswers).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-semibold capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      : {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </Protected>
  );
}
