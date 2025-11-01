"use client";
import MetricCard from "./MetricCard";
import { FaUsers, FaRupeeSign } from "react-icons/fa";
import { GiFamilyHouse } from "react-icons/gi";
import { MdOutlineWoman } from "react-icons/md";

interface MetricsGridProps {
  summary: any;
  metricLabels: Record<string, string>;
}

export default function MetricsGrid({ summary, metricLabels }: MetricsGridProps) {
  if (!summary) return null;

  // 🧠 Helper for safe number formatting
  const formatNum = (num?: number) =>
    typeof num === "number" && !isNaN(num) ? num.toLocaleString() : "—";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
      <MetricCard
        label="Approved Labour Budget"
        value={`₹${formatNum(summary.approvedLabourBudget)}`}
        icon={<FaRupeeSign />}
      />
      <MetricCard
        label="Total Expenditure"
        value={`₹${formatNum(summary.totalExpenditure)}`}
        icon={<FaRupeeSign />}
      />
      <MetricCard
        label="Average Wage Rate"
        value={`₹${formatNum(summary.averageWageRate)}/day`}
        icon={<FaRupeeSign />}
      />
      <MetricCard
        label="Households Worked"
        value={formatNum(summary.totalHouseholdsWorked)}
        icon={<GiFamilyHouse />}
      />
      <MetricCard
        label="Individuals Worked"
        value={formatNum(summary.totalIndividualsWorked)}
        icon={<FaUsers />}
      />
      <MetricCard
        label="Women Persondays"
        value={formatNum(summary.womenPersondays)}
        icon={<MdOutlineWoman />}
      />
      <MetricCard
        label="SC Persondays"
        value={formatNum(summary.scPersondays)}
        icon={<FaUsers />}
      />
      <MetricCard
        label="ST Persondays"
        value={formatNum(summary.stPersondays)}
        icon={<FaUsers />}
      />
      <MetricCard
        label="Avg Days Employment"
        value={formatNum(summary.averageDaysEmployment)}
        icon={<GiFamilyHouse />}
      />
    </div>
  );
}
