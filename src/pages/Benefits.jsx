import React from "react";
import { FaChartLine, FaUsers } from "react-icons/fa";
import Footer from "./Footer";

export default function Benefits() {
  const tiers = [
    {
      level: "Starter",
      friends: "3 Active Friend Stores",
      friendFunds: "$200 Total Friend Store Funds",
      yourFunds: "$100 Your Store Funds",
      commission: "$30 Commission",
      salary: "$5 Weekly Salary",
    },
    {
      level: "Growth",
      friends: "10 Active Friend Stores",
      friendFunds: "$1,000 Total Friend Store Funds",
      yourFunds: "$300 Your Store Funds",
      commission: "$100 Commission",
      salary: "$20 Weekly Salary",
    },
    {
      level: "Expansion",
      friends: "20 Active Friend Stores",
      friendFunds: "$3,000 Total Friend Store Funds",
      yourFunds: "$500 Your Store Funds",
      commission: "$300 Commission",
      salary: "$50 Weekly Salary",
    },
    {
      level: "Elite",
      friends: "30 Active Friend Stores",
      friendFunds: "$5,000 Total Friend Store Funds",
      yourFunds: "$700 Your Store Funds",
      commission: "$400 Commission",
      salary: "$70 Weekly Salary",
    },
    {
      level: "Master",
      friends: "40 Active Friend Stores",
      friendFunds: "$7,500 Total Friend Store Funds",
      yourFunds: "$800 Your Store Funds",
      commission: "$500 Commission",
      salary: "$100 Weekly Salary",
    },
    {
      level: "Premium",
      friends: "70 Active Friend Stores",
      friendFunds: "$10,000 Total Friend Store Funds",
      yourFunds: "$1,000 Your Store Funds",
      commission: "$750 Commission",
      salary: "$125 Weekly Salary",
    },
    {
      level: "Diamond",
      friends: "100 Active Friend Stores",
      friendFunds: "$12,500 Total Friend Store Funds",
      yourFunds: "$1,250 Your Store Funds",
      commission: "$1,000 Commission",
      salary: "$200 Weekly Salary",
    },
  ];

  const kpis = [
    "Number of Active Friend Stores",
    "Total Friend Store Funds",
    "Your Store Funds",
    "Commission Earned",
    "Weekly Salary",
  ];

  const incentives = [
    "Grow your network of friend stores",
    "Increase funds in your friend stores",
    "Develop your own store's performance",
    "Earn commission and weekly salary through strategic growth",
  ];

  return (
    <>
      <div className="min-h-screen text-white">
        {/* Hero Section */}
        <section className="text-center py-16 px-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Commission Benefits & Growth Structure
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto">
            Explore how you can earn more as your network grows. Every tier
            brings you closer to higher rewards and weekly benefits.
          </p>
        </section>

        {/* Commission Tiers */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-green-400 text-center mb-10">
            Commission Levels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="bg-white text-gray-900 rounded-2xl p-6 shadow-lg border border-green-300 hover:border-green-500 hover:shadow-2xl transition-all"
              >
                <h3 className="text-2xl font-semibold text-green-600 mb-4 text-center">
                  {tier.level}
                </h3>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• {tier.friends}</li>
                  <li>• {tier.friendFunds}</li>
                  <li>• {tier.yourFunds}</li>
                  <li>• {tier.commission}</li>
                  <li>• {tier.salary}</li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* KPIs Section */}
        <section className="bg-gray-100 text-gray-900 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
              <FaChartLine className="text-green-600" /> Key Performance
              Indicators (KPIs)
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              {kpis.map((kpi, index) => (
                <li key={index}>{kpi}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Incentives Section */}
        <section className="py-12 px-6 bg-white text-gray-900">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.jpg?s=612x612&w=0&k=20&c=buXwOYjA_tjt2O3-kcSKqkTp2lxKWJJ_Ttx2PhYe3VM="
                alt="Team"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <FaUsers className="text-green-500" /> This Structure
                Incentivizes You To:
              </h2>
              <ul className="list-disc list-inside space-y-2 font-bold text-gray-700">
                {incentives.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
