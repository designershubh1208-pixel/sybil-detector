"use client";

import { useEffect, useState } from "react";
import { Search, FolderKanban, Plus, Tag } from "lucide-react";
import axios from "@/lib/axios";
import useSWR from "swr";

export default function IntelligenceClient() {
  const workspaceId = "workspace-1"; // Stub
  const { data: investigations = [], isLoading: loading } = useSWR(
    `/investigations/${workspaceId}`, 
    (url) => axios.get(url).then(res => res.data)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-[var(--accent)]" />
            Intelligence Workspace
          </h1>
          <p className="text-[var(--secondary)]">
            Your centralized command center for tracking, tagging, and saving specific forensic investigations.
          </p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent)] transition-colors">
          <Plus className="w-4 h-4" />
          New Case File
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search saved cases, wallet addresses, or tags..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <button type="button" className="px-4 py-2 bg-white border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--secondary)] hover:text-[var(--primary)] transition-colors">
          Filter by Tag
        </button>
      </div>

      {/* Investigations Grid */}
      {loading ? (
        <div className="p-12 text-center text-[var(--secondary)] bg-white rounded-2xl border border-[var(--border)] shadow-sm">
          Loading case files...
        </div>
      ) : investigations.length === 0 ? (
        <div className="p-12 text-center text-[var(--secondary)] bg-white rounded-2xl border border-[var(--border)] shadow-sm flex flex-col items-center">
          <FolderKanban className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Investigations</h3>
          <p>You have not saved any clusters or wallets to your intelligence workspace yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investigations.map(inv => (
            <div key={inv.id} className="bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                  {inv.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1">
                {inv.notes || "No case notes added."}
              </p>
              
              <div className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {inv.tags.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--background)] text-[var(--secondary)] border border-[var(--border)]">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {inv.tags.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No tags</span>
                  )}
                </div>
                
                <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center text-xs text-gray-500">
                  <span>Created {new Date(inv.createdAt).toLocaleDateString()}</span>
                  {inv.clusterId && (
                    <span className="text-[var(--accent)] font-medium">Linked to Cluster</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
