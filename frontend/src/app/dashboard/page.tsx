"use client";

import { motion } from "framer-motion";
import { Search, ArrowUpRight, ArrowDownRight, ShieldAlert, Activity, Users, Network } from "lucide-react";
import Link from "next/link";
import { RiskDistributionChart, SybilBehaviorPieChart } from "@/components/SybilCharts";
import { NetworkGraph } from "@/components/NetworkGraph";

const STATS = [
  { label: "Wallets Analyzed", value: "124,592", trend: "+12.5%", isPositive: true, icon: Users },
  { label: "Sybil Clusters Found", value: "842", trend: "+5.2%", isPositive: true, icon: Network },
  { label: "High Risk Flags", value: "3,104", trend: "-2.1%", isPositive: false, icon: ShieldAlert },
  { label: "Detection Accuracy", value: "98.4%", trend: "+0.1%", isPositive: true, icon: Activity },
];

export default function DashboardPage() {

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <Link href="/dashboard/upload" className="px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent)] transition-colors">
          New Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[var(--background)] text-[var(--secondary)] rounded-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-[var(--secondary)]">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Risk Distribution</h2>
            <RiskDistributionChart />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Sybil Network Mapping</h2>
            <NetworkGraph />
          </motion.div>
        </div>
        
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Sybil Behaviors Found</h2>
            <SybilBehaviorPieChart />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm min-h-[400px]"
          >
            <h2 className="text-xl font-semibold mb-6">Recent Reports</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item, i) => (
                <motion.div 
                  key={item} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex items-center justify-between p-3 hover:bg-[var(--background)] rounded-xl transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-medium">Airdrop Snapshot {item}</div>
                    <div className="text-xs text-[var(--secondary)] mt-1">Found 12 clusters • 2 hrs ago</div>
                  </div>
                  <div className="text-sm font-medium text-[var(--accent)] bg-green-50 px-3 py-1 rounded-full">
                    Completed
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
