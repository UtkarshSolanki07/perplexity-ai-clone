"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Atom,
  AudioLines,
  Cpu,
  Globe,
  Mic,
  Paperclip,
  SearchCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIModelsOption } from "@/services/Shared";
import { supabase } from "@/app/Supabase";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

function ChatInputBox() {
  const [userSearchInput, setUserSearchInput] = useState("");
  const [searchType, setSearchType] = useState("search");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!userSearchInput) {
      const interval = setInterval(() => {
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [userSearchInput]);

  const onSearchQuery = async () => {
    setLoading(true);
    const libId = uuidv4();
    const insertData = {
      searchInput: userSearchInput,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      type: searchType,
      libId: libId,
    };
    const { data, error } = await supabase
      .from("Library")
      .insert([insertData])
      .select();
    if (error) {
      console.error("Error inserting library record:", error);
      setLoading(false);
      alert("Failed to create search record. Please try again.");
      return;
    }
    setLoading(false);
    if (searchType === "research") {
      router.push(`/research/${libId}`);
    } else {
      router.push(`/search/${libId}`);
    }
    console.log(data?.[0]);
  };

  // Letters for "BotZilla" to render reliably without wrapping.
  const heroLetters = ["B", "o", "t", "Z", "i", "l", "l", "a"];

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center px-4 relative bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* HERO */}
      <div
        className={`transition-all duration-700 ease-in-out flex flex-col items-center justify-center`}
        style={{
          transform: `translateY(${userSearchInput ? "-20px" : "0px"})`,
        }}
      >
        {/* Hero container keeps text on one line and centered */}
        <div className="relative mx-auto w-full max-w-[720px] flex items-center justify-center py-6">
          {/* Glowing orbs behind text - lowered, smaller, and more subtle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="absolute rounded-full opacity-28 blur-2xl"
              style={{
                width: "420px", // reduced size
                height: "420px",
                bottom: "-30px", // lowered position (sits under the text)
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(20,184,166,0.18) 40%, rgba(6,182,212,0.12) 80%, transparent 100%)",
                animation: "rotate-slow 40s linear infinite", // slower rotation
                transform: "translateY(30px)",
              }}
            />
            <div
              className="absolute rounded-full opacity-20 blur-xl"
              style={{
                width: "360px", // second orb smaller
                height: "360px",
                bottom: "-60px", // slightly lower
                right: "8%",
                background:
                  "radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(16,185,129,0.15) 60%, transparent 100%)",
                animation: "rotate-slower 50s linear infinite reverse",
                transform: "translateY(20px)",
              }}
            />
          </div>

          {/* Main text container */}
          <div className="relative">
            {/* Decorative sparkles (subtle) */}
            <Sparkles
              className="absolute -top-6 -right-8 text-teal-400 opacity-60"
              size={28}
              style={{ animation: "float 4s ease-in-out infinite", opacity: 0.6 }}
            />
            <Zap
              className="absolute -bottom-2 -left-6 text-cyan-400 opacity-55"
              size={22}
              style={{ animation: "float 5s ease-in-out infinite 0.6s", opacity: 0.55 }}
            />
            <Sparkles
              className="absolute top-1/2 -right-10 text-emerald-400 opacity-50"
              size={20}
              style={{ animation: "float 4.5s ease-in-out infinite 1s", opacity: 0.5 }}
            />

            {/* BotZilla Text */}
            <h1 className="relative text-[6.5rem] sm:text-[7rem] md:text-[8rem] leading-none font-extrabold tracking-tight select-none">
              {heroLetters.map((ch, i) => (
                <span
                  key={i}
                  className="inline-block relative"
                  style={{
                    animation: isLoaded
                      ? `letterPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
                      : "none",
                    animationDelay: `${i * 0.08}s`,
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? "none" : "scale(0) rotateY(180deg)",
                  }}
                >
                  {/* Multiple gradient layers for depth */}
                  <span
                    className="relative inline-block"
                    style={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #14B8A6 25%, #06B6D4 50%, #0891B2 75%, #0D9488 100%)",
                      backgroundSize: "200% 200%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      animation: "gradientShift 8s ease infinite",
                      filter:
                        "drop-shadow(0 0 18px rgba(20,184,166,0.18)) drop-shadow(0 0 40px rgba(6,182,212,0.12))",
                    }}
                  >
                    {ch}
                  </span>

                  {/* Animated underline accent for certain letters (subtle) */}
                  {(ch === "Z" || ch === "B") && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-1.5 rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(16,185,129,0.75), rgba(6,182,212,0.75))",
                        animation: "shimmer 2.4s ease-in-out infinite",
                        transformOrigin: "center",
                        opacity: 0.9,
                      }}
                    />
                  )}
                </span>
              ))}
            </h1>

            {/* Soft glowing outline (more subtle) */}
            <div
              className="absolute inset-0 opacity-12 blur-lg pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(6,182,212,0.12))",
                animation: "pulse 6s ease-in-out infinite",
              }}
            />
          </div>

          {/* Floating particles: fewer, smaller, and constrained in vertical placement */}
          {[...Array(6)].map((_, i) => {
            const size = Math.round(Math.random() * 6 + 3); // 3-9px
            const topPos = 30 + Math.random() * 30; // 30% - 60% (lowered)
            const leftPos = Math.random() * 100;
            const dur = (Math.random() * 3 + 4).toFixed(2); // 4-7s
            const delay = (Math.random() * 2).toFixed(2);
            const colors = [
              "rgba(16,185,129,0.35)",
              "rgba(20,184,166,0.30)",
              "rgba(6,182,212,0.28)",
              "rgba(8,145,178,0.26)",
              "rgba(13,148,136,0.26)",
            ];
            return (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: colors[i % colors.length],
                  top: `${topPos}%`,
                  left: `${leftPos}%`,
                  animation: `floatParticle ${dur}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  filter: "blur(0.6px)",
                  opacity: 0.55,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* INPUT CARD */}
      <div
        className={`p-2 w-full max-w-2xl border rounded-2xl mt-6 transition-all duration-300 
                    ${isHovering ? "shadow-lg" : "shadow-md"} 
                    ${
                      userSearchInput ? "border-blue-400" : "border-gray-200"
                    } bg-white`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <Tabs defaultValue="Search" className="w-full">
            <TabsContent value="Search">
              <input
                type="text"
                placeholder="Ask Anything"
                onChange={(e) => setUserSearchInput(e.target.value)}
                className="w-full p-4 outline-none transition-all duration-300 text-sm"
                aria-label="Search input"
              />
            </TabsContent>
            <TabsContent value="Research">
              <input
                type="text"
                placeholder="Research Anything"
                onChange={(e) => setUserSearchInput(e.target.value)}
                className="w-full p-4 outline-none transition-all duration-300 text-sm"
                aria-label="Research input"
              />
            </TabsContent>

            <TabsList className="mt-2 flex justify-start">
              <TabsTrigger
                value="Search"
                className="flex items-center gap-1 text-primary transition-transform duration-200 hover:scale-105"
                onClick={() => setSearchType("search")}
              >
                <SearchCheck className="h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger
                value="Research"
                className="flex items-center gap-1 text-primary transition-transform duration-200 hover:scale-105"
                onClick={() => setSearchType("research")}
              >
                <Atom className="h-4 w-4" />
                Research
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  className="transition-transform duration-200 hover:scale-110"
                  aria-label="Model options"
                >
                  <Cpu className="text-gray-500 h-5 w-5 hover:text-blue-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="animate-in fade-in-50 zoom-in-95 duration-200">
                {AIModelsOption.map((model, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="mb-1">
                      <h2 className="text-xs">{model.name}</h2>
                      <p className="text-xs">{model.desc}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Globe className="text-gray-500 h-5 w-5 hover:text-blue-500 hover:scale-110 cursor-pointer" />
            <Paperclip className="text-gray-500 h-5 w-5 hover:text-blue-500 hover:scale-110 cursor-pointer" />
            <Mic className="text-gray-500 h-5 w-5 hover:text-blue-500 hover:scale-110 cursor-pointer" />

            <Button
              onClick={() => {
                userSearchInput ? onSearchQuery() : null;
              }}
              disabled={loading}
              className={`transition-all duration-300 ease-in-out rounded-full 
      ${pulseEffect && !userSearchInput ? "animate-pulse" : ""} 
      ${loading ? "bg-blue-400" : ""}`}
              aria-label="Submit search"
            >
              {!userSearchInput ? (
                <AudioLines
                  className={`text-white h-5 w-5 ${
                    pulseEffect ? "scale-110" : "scale-100"
                  }`}
                />
              ) : (
                <ArrowRight
                  className={`text-white h-5 w-5 ${
                    loading ? "animate-spin" : "animate-bounce"
                  }`}
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`mt-6 text-gray-400 text-sm transition-opacity duration-500 text-center ${
          userSearchInput ? "opacity-0" : "opacity-80"
        }`}
      >
        Start typing to search or research anything
      </div>

      {/* Inline keyframe styles */}
      <style jsx>{`
        @keyframes botScale {
          0% {
            transform: scale(0.1) translateY(20px);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) translateY(-5px);
            opacity: 0.85;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotate-slower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px); /* reduced float amplitude */
          }
        }

        @keyframes letterPop {
          0% {
            transform: scale(0) rotateY(180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.12) rotateY(90deg);
            opacity: 0.85;
          }
          100% {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% {
            transform: scaleX(0);
            opacity: 0;
          }
        }

        @keyframes floatParticle {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-8px) translateX(6px);
          }
          50% {
            transform: translateY(-6px) translateX(-6px);
          }
          75% {
            transform: translateY(-10px) translateX(4px);
          }
        }

        /* respect user preference for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatInputBox;
