"use client";

import { useEffect, useState } from "react";
import { Activity, Bell, CheckCircle, ShieldAlert } from "lucide-react";
import axios from "axios";

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkspaceAndAlerts() {
      try {
        // Stub active workspace for now
        const activeOrg = "workspace-1";
        
        setWorkspaceId(activeOrg);
        const res = await axios.get(`http://localhost:3001/api/alerts/${activeOrg}`);
        setAlerts(res.data);
      } catch (error) {
        console.error("Error fetching alerts", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkspaceAndAlerts();

    // Poll for new alerts every 10 seconds to simulate "Live Webhook" feed
    const interval = setInterval(fetchWorkspaceAndAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (alertId: string) => {
    try {
      await axios.post(`http://localhost:3001/api/alerts/${alertId}/read`);
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, isRead: true } : a));
    } catch (error) {
      console.error("Error marking alert as read", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Real-Time Monitoring</h1>
        <p className="text-[var(--secondary)]">
          Live stream of high-risk network events, new Sybil clusters, and protocol threats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Alerts Feed */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Activity Feed</h2>
            <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Live Connection
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[var(--secondary)] bg-white rounded-2xl border border-[var(--border)] shadow-sm">
              Loading alerts stream...
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-12 text-center text-[var(--secondary)] bg-white rounded-2xl border border-[var(--border)] shadow-sm flex flex-col items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">All Clear</h3>
              <p>No active threats or alerts detected in your workspace.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`bg-white p-6 rounded-2xl border ${!alert.isRead ? 'border-red-300 shadow-md bg-red-50' : 'border-[var(--border)] shadow-sm'} transition-all`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${alert.type === 'NEW_CLUSTER' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {alert.type === 'NEW_CLUSTER' ? <ShieldAlert className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-3 font-mono">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.isRead && (
                    <button 
                      onClick={() => markAsRead(alert.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded-full"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-[var(--secondary)]">
              <Bell className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="font-medium">Notification Settings</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Configure Webhooks and Email notifications for high-priority alerts.
            </p>
            <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg text-sm transition-colors cursor-not-allowed opacity-50">
              Configure Webhooks (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
