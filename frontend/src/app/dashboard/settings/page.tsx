"use client";

import { Settings as SettingsIcon, CreditCard, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl font-medium flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 text-[var(--secondary)]" />
            General
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-[var(--background)] rounded-xl font-medium flex items-center gap-3 text-[var(--secondary)] hover:text-gray-900 transition-colors">
            <CreditCard className="w-5 h-5" />
            Billing & Plans
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-[var(--background)] rounded-xl font-medium flex items-center gap-3 text-[var(--secondary)] hover:text-gray-900 transition-colors">
            <Key className="w-5 h-5" />
            API Keys
          </button>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Workspace Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  defaultValue="Beacon Default Workspace"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Notifications</label>
                <select className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all">
                  <option>All notifications</option>
                  <option>Important alerts only</option>
                  <option>None</option>
                </select>
              </div>
              <button className="px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent)] transition-colors mt-2">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
