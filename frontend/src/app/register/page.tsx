"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-[var(--border)] via-transparent to-transparent opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-dark bg-white rounded-3xl p-8 border border-[var(--border)] shadow-xl">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-[var(--background)] rounded-full flex items-center justify-center border border-[var(--border)]">
              <UserPlus className="w-6 h-6 text-[var(--accent)]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">Create an Account</h2>
          <p className="text-[var(--secondary)] text-center mb-8 text-sm">Join Beacon to uncover hidden Sybil networks</p>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                placeholder="investigator@crypto.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--accent)] transition-colors flex justify-center items-center gap-2 group mt-6">
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-[var(--secondary)]">
            Already have an account? <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
