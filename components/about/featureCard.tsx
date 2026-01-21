"use client";
import { Feature } from "@/lib/constant";

const FeatureCard = ({ icon: Icon, title, description }: Feature) => (
  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow duration-300">
    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
      <Icon className="h-5 w-5 text-blue-600" />
      {title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard;
