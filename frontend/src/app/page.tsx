"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Shader, ChromaFlow, FilmGrain, FlutedGlass, Swirl } from 'shaders/react';
import { Clock, Menu, X, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const HoverButton = ({ text, className, iconCircleClass, iconClass, href = "#", onClick }: { text: string, className: string, iconCircleClass: string, iconClass: string, href?: string, onClick?: () => void }) => {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`group flex items-center gap-3 transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${className}`}>
        <span className="relative flex-col overflow-hidden h-[20px] flex">
          <span className="flex flex-col transform group-hover:-translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
            <span className="h-[20px] flex items-center">{text}</span>
            <span className="h-[20px] flex items-center">{text}</span>
          </span>
        </span>
        <div className={`flex items-center justify-center rounded-full transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${iconCircleClass}`}>
          <ArrowRight className={`transform group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${iconClass}`} />
        </div>
      </button>
    );
  }

  return (
    <Link href={href} className={`group flex items-center gap-3 transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${className}`}>
      <span className="relative flex-col overflow-hidden h-[20px] flex">
        <span className="flex flex-col transform group-hover:-translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
          <span className="h-[20px] flex items-center">{text}</span>
          <span className="h-[20px] flex items-center">{text}</span>
        </span>
      </span>
      <div className={`flex items-center justify-center rounded-full transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${iconCircleClass}`}>
        <ArrowRight className={`transform group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${iconClass}`} />
      </div>
    </Link>
  );
};

export default function LandingPage() {
  const [time, setTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setTime(formatter.format(new Date()));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#EFEFEF]"
          >
            <Loader text="Initializing Platform" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full bg-[#EFEFEF] min-h-screen text-gray-900 font-sans">
      
      {/* SECTION 1: HERO */}
      <section className="relative w-full h-screen flex flex-col justify-between overflow-hidden bg-[#EFEFEF]">
        
        {/* Shaders Background */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Shader>
            <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
            <ChromaFlow baseColor="#ffffff" downColor="#ff5f03" leftColor="#ff5f03" rightColor="#ff5f03" upColor="#ff5f03" momentum={13} radius={3.5} />
            <FlutedGlass aberration={0.61} angle={31} frequency={8} highlight={0.12} highlightSoftness={0} lightAngle={-90} refraction={4} shape="rounded" softness={1} speed={0.15} />
            <FilmGrain strength={0.05} />
          </Shader>
        </div>

        {/* Navigation */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3 mt-4">
          <nav className="bg-white rounded-full p-[5px] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] leading-[11px] font-bold tracking-tight">BN</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                {["Dashboard", "Platform", "API", "Pricing"].map(link => (
                  <Link key={link} href={link === "Dashboard" ? "/dashboard" : `#${link.toLowerCase()}`} className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300">
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-5">
              <span className="text-[13px] text-gray-600 hidden lg:block">Securing Web3 protocols</span>
              <div className="flex items-center gap-1.5 px-2">
                <Clock className="w-[14px] h-[14px] text-gray-600" />
                <span className="text-[13px] text-gray-600">{time} in India</span>
              </div>
              {!loading && user ? (
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-medium text-gray-900">{user.displayName}</span>
                  <HoverButton 
                    text="Dashboard" 
                    href="/dashboard"
                    className="bg-gray-900 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2"
                    iconCircleClass="w-6 h-6 bg-white text-gray-900"
                    iconClass="w-3.5 h-3.5"
                  />
                  <button type="button" onClick={handleSignOut} className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Sign Out
                  </button>
                </div>
              ) : (
                <HoverButton 
                  text="Sign In" 
                  onClick={handleSignIn}
                  className="bg-gray-900 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2"
                  iconCircleClass="w-6 h-6 bg-white text-gray-900"
                  iconClass="w-3.5 h-3.5"
                />
              )}
            </div>

            <button 
              type="button"
              className="md:hidden w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white shrink-0 ml-auto mr-1"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-50 transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-2xl mx-3 mb-3 p-6 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5">
                <Clock className="w-[14px] h-[14px] text-gray-600" />
                <span className="text-[13px] text-gray-600">{time} in India</span>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-gray-900" />
              </button>
            </div>
            <div className="flex flex-col gap-4 mb-8">
              {["Dashboard", "Platform", "API", "Pricing"].map(link => (
                <Link key={link} href={link === "Dashboard" ? "/dashboard" : `#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-[28px] leading-[32px] font-medium text-gray-900">
                  {link}
                </Link>
              ))}
            </div>
            {!loading && user ? (
              <div className="flex flex-col gap-4">
                <span className="text-[15px] font-medium text-gray-900">Signed in as: {user.displayName}</span>
                <HoverButton 
                  text="Dashboard" 
                  href="/dashboard"
                  className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[15px] font-medium rounded-full pl-6 pr-2 py-3 w-full justify-between"
                  iconCircleClass="w-10 h-10 bg-white text-[#F26522]"
                  iconClass="w-5 h-5"
                />
                <button type="button" onClick={handleSignOut} className="text-left text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors mt-2">
                  Sign Out
                </button>
              </div>
            ) : (
              <HoverButton 
                text="Sign In" 
                onClick={handleSignIn}
                className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[15px] font-medium rounded-full pl-6 pr-2 py-3 w-full justify-between"
                iconCircleClass="w-10 h-10 bg-white text-[#F26522]"
                iconClass="w-5 h-5"
              />
            )}
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex-1" />
        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          <div className="text-[13px] leading-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8 font-medium">
            Beacon Platform
          </div>
          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
            Beacon: The Palantir <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            of Web3 Wallet Trust.
          </h1>
          
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
            <HoverButton 
              text="Start Analysis" 
              href="/dashboard"
              className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] leading-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2"
              iconCircleClass="w-7 h-7 sm:w-8 sm:h-8 bg-white text-[#F26522]"
              iconClass="w-4 h-4"
            />
            
            <div className="bg-white rounded-[4px] px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-[#E8704E]" />
              <span className="text-[13px] leading-[14px] font-medium text-gray-900">Enterprise Ready</span>
              <span className="text-[10px] leading-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] leading-[12px] font-semibold flex items-center justify-center">
              1
            </div>
            <div className="text-[12px] leading-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
              Introducing Beacon
            </div>
          </div>

          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28">
            AI-powered detection, delivering <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            accuracy in sybil analysis.
          </h2>

          {/* Responsive Layout */}
          <div className="block lg:hidden space-y-8">
            <div className="flex flex-col gap-6 items-start">
              <p className="text-[15px] leading-[1.6] font-medium text-gray-900 max-w-lg">
                Through advanced graph clustering and behavioral ML, we help protocols identify sybil networks in minutes.
              </p>
              <HoverButton 
                text="View our engine" 
                href="/dashboard"
                className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] leading-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2"
                iconCircleClass="w-7 h-7 sm:w-8 sm:h-8 bg-white text-[#F26522]"
                iconClass="w-4 h-4"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
              <img 
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85" 
                alt="Beacon Engine"
                className="w-full sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl object-cover"
              />
              <img 
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85" 
                alt="Sybil Graph"
                className="w-full sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl object-cover"
              />
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
            <div className="self-end">
              <img 
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85" 
                alt="Beacon Engine"
                className="w-full aspect-[438/346] rounded-2xl object-cover"
              />
            </div>
            <div className="self-start flex flex-col justify-end items-start gap-8 h-full pb-8">
              <p className="text-[16px] leading-[1.65] font-medium text-gray-900 whitespace-nowrap">
                Through advanced graph clustering<br/>and behavioral ML, we help protocols<br/>identify sybil networks in minutes.
              </p>
              <HoverButton 
                text="View our engine" 
                href="/dashboard"
                className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] leading-[14px] font-medium rounded-full pl-6 pr-2 py-2"
                iconCircleClass="w-8 h-8 bg-white text-[#F26522]"
                iconClass="w-4 h-4"
              />
            </div>
            <div className="self-end">
              <img 
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85" 
                alt="Sybil Graph"
                className="w-full aspect-[3/2] rounded-2xl object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: CASE STUDIES */}
      <section className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] leading-[12px] font-semibold flex items-center justify-center">
              2
            </div>
            <div className="text-[12px] leading-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
              Recent Reports
            </div>
          </div>

          <h2 className="px-5 sm:px-8 lg:px-12 text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
            Detection activity
          </h2>

          <div className="px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
            
            {/* Card 1: Arbitrum Airdrop */}
            <div>
              <div className="aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] relative group cursor-pointer">
                <video 
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4" 
                  autoPlay muted loop playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white rounded-full h-9 w-9 group-hover:w-[148px] flex items-center transition-all duration-300 ease-in-out overflow-hidden shadow-lg pl-[10px]">
                  <svg className="w-[14px] h-[14px] shrink-0 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span className="text-[13px] font-medium text-gray-900 whitespace-nowrap ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    View clusters
                  </span>
                </div>
              </div>
              <p className="text-[13px] leading-[14px] text-gray-600 mt-4 leading-relaxed font-medium">
                Analysis of 1M+ wallets. Identified over 40,000 highly coordinated Sybil actors.
              </p>
              <h3 className="text-[14px] leading-[15px] font-semibold text-gray-900 mt-1">
                Arbitrum Snapshot
              </h3>
            </div>

            {/* Card 2: ZK Sync */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] relative group cursor-pointer">
                <video 
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4" 
                  autoPlay muted loop playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-gray-900 rounded-full h-9 w-9 group-hover:w-[168px] flex items-center transition-all duration-300 ease-in-out overflow-hidden shadow-lg pl-[10px]">
                  <ArrowRight className="w-[14px] h-[14px] shrink-0 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-white" />
                  <span className="text-[13px] font-medium text-white whitespace-nowrap ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    View report
                  </span>
                </div>
              </div>
              <p className="text-[13px] leading-[14px] text-gray-600 mt-4 leading-relaxed font-medium">
                Deep-dive into network-level similarities uncovering massive farming operations.
              </p>
              <h3 className="text-[14px] leading-[15px] font-semibold text-gray-900 mt-1">
                ZKSync Ecosystem
              </h3>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] leading-[11px] font-bold tracking-tight">BN</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 tracking-tight">Beacon Platform</span>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {["Dashboard", "Platform", "API", "Pricing", "Privacy", "Terms"].map(link => (
                <Link key={link} href={link === "Dashboard" ? "/dashboard" : `#${link.toLowerCase()}`} className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300">
                  {link}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4">
            <p className="text-[13px] text-gray-500">
              © {new Date().getFullYear()} Beacon Platform Inc. All rights reserved.
            </p>
            <p className="text-[13px] text-gray-500">
              Securing the future of Web3
            </p>
          </div>
        </div>
      </footer>

    </div>
    </>
  );
}
