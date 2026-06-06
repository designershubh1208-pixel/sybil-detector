"use client";

import { Users, UserPlus } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <button className="px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent)] transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold">Active Members</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--background)] rounded-full flex items-center justify-center border border-[var(--border)]">
                  <Users className="w-5 h-5 text-[var(--secondary)]" />
                </div>
                <div>
                  <p className="font-medium">User {i}</p>
                  <p className="text-sm text-[var(--secondary)]">user{i}@example.com</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded-full text-xs font-medium">
                {i === 1 ? 'Owner' : 'Member'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
