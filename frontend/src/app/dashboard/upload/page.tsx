"use client";

import { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, AlertCircle, Play } from "lucide-react";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"csv" | "manual">("csv");
  const [textInput, setTextInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // CSV State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvWallets, setCsvWallets] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // Simple CSV parsing: split by newlines/commas and find anything looking like an ETH address
        const extracted = text.split(/[\s,;\n]+/).filter(w => w.trim().startsWith("0x") && w.trim().length >= 40);
        setCsvWallets(extracted);
      }
    };
    reader.readAsText(file);
  };

  const handleStartAnalysis = async () => {
    setIsUploading(true);
    // Parse wallets
    let wallets: string[] = [];
    if (method === "manual") {
      wallets = textInput.split(/[\s,]+/).filter(w => w.startsWith("0x"));
    } else {
      wallets = csvWallets;
    }

    if (wallets.length === 0) {
      alert("No valid wallet addresses found!");
      setIsUploading(false);
      return;
    }

    try {
      // Simulate API call to backend
      const res = await axios.post("/analysis/upload", {
        workspaceId: "workspace-1", // stub
        name: method === "csv" && csvFile ? csvFile.name : "Manual Upload Analysis",
        wallets
      });
      router.push("/dashboard/history");
    } catch (error) {
      console.error("Error starting analysis", error);
      alert("Failed to start analysis. Ensure backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">New Sybil Analysis</h1>
        <p className="text-[var(--secondary)]">Upload a list of wallets to begin the Sybil detection pipeline.</p>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-[var(--border)] flex gap-2 w-max">
        <button 
          onClick={() => setMethod("csv")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${method === "csv" ? "bg-[var(--background)] text-[var(--primary)] shadow-sm" : "text-[var(--secondary)] hover:text-[var(--primary)]"}`}
        >
          CSV Upload
        </button>
        <button 
          onClick={() => setMethod("manual")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${method === "manual" ? "bg-[var(--background)] text-[var(--primary)] shadow-sm" : "text-[var(--secondary)] hover:text-[var(--primary)]"}`}
        >
          Manual Entry
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[var(--border)] p-8 shadow-sm">
        {method === "csv" ? (
          <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-16 flex flex-col items-center justify-center text-center hover:bg-[var(--background)] transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              accept=".csv,.txt" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            {csvFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <FileIcon className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{csvFile.name}</h3>
                <p className="text-[var(--secondary)] mb-2 text-sm max-w-sm">
                  Parsed {csvWallets.length} valid wallet addresses.
                </p>
                <button className="px-6 py-3 mt-4 bg-gray-100 text-[var(--foreground)] text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors" onClick={(e) => { e.stopPropagation(); setCsvFile(null); setCsvWallets([]); }}>
                  Remove File
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Drag and drop your CSV</h3>
                <p className="text-[var(--secondary)] mb-6 text-sm max-w-sm">
                  Upload a file containing wallet addresses. We support Ethereum, Base, Arbitrum, Optimism, and Polygon formats.
                </p>
                <button className="px-6 py-3 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent)] transition-colors">
                  Browse Files
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">Paste Wallet Addresses</h3>
            <textarea 
              className="w-full flex-1 min-h-[300px] p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none font-mono text-sm"
              placeholder="0x...\n0x..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
        )}

        <div className="mt-8 flex justify-between items-center pt-6 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
            <AlertCircle className="w-4 h-4" />
            Max 100,000 wallets per upload on Enterprise plan.
          </div>
          <button 
            onClick={handleStartAnalysis}
            disabled={isUploading || (method === "manual" && textInput.trim().length === 0) || (method === "csv" && !csvFile)}
            className="px-8 py-3 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--accent)] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Starting..." : "Start Analysis Engine"}
            {!isUploading && <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
