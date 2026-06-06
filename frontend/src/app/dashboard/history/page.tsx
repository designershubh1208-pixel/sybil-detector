"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Clock, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const res = await axios.get("http://localhost:3001/api/analysis?workspaceId=workspace-1");
        setAnalyses(res.data);
      } catch (error) {
        console.error("Error fetching analyses", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalyses();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-12 shadow-sm text-center">
          <p className="text-[var(--secondary)]">Loading analyses...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-12 shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[var(--background)] rounded-full flex items-center justify-center border border-[var(--border)]">
              <Clock className="w-8 h-8 text-[var(--secondary)]" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">No past analyses</h2>
          <p className="text-[var(--secondary)] max-w-sm mx-auto">
            You haven't run any Sybil detection tasks yet. Once you do, your reports will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--background)] border-b border-[var(--border)] text-[var(--secondary)]">
              <tr>
                <th className="px-6 py-4 font-medium">Analysis Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Wallets Processed</th>
                <th className="px-6 py-4 font-medium">Clusters Found</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {analyses.map((a) => (
                <tr key={a.id} className="hover:bg-[var(--background)] transition-colors">
                  <td className="px-6 py-4 font-medium">{a.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {a.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                       a.status === 'FAILED' ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                       <Activity className="w-4 h-4 text-[var(--accent)] animate-pulse" />}
                      <span className="capitalize">{a.status.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{a.totalWallets}</td>
                  <td className="px-6 py-4">{a._count?.clusters || 0}</td>
                  <td className="px-6 py-4 text-[var(--secondary)]">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/analysis/${a.id}`} className="text-[var(--primary)] font-medium hover:underline">
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
