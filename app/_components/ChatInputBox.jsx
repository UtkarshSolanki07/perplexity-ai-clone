"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AIModelsOption } from "@/services/Shared";
import { supabase } from "@/app/Supabase";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

// Constants
const PULSE_INTERVAL = 3000;
const PULSE_DURATION = 1000;
const MAX_INPUT_LENGTH = 500;
const DEBOUNCE_DELAY = 300;

// Utility functions
const sanitizeInput = (input) => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

const validateInput = (input) => {
  if (!input || input.length === 0) {
    return { isValid: false, error: "Please enter a search query" };
  }
  if (input.length > MAX_INPUT_LENGTH) {
    return { isValid: false, error: `Query must be less than ${MAX_INPUT_LENGTH} characters` };
  }
  return { isValid: true, error: null };
};

function ChatInputBox() {
  const [userSearchInput, setUserSearchInput] = useState("");
  const [searchType, setSearchType] = useState("search");
  const [selectedModel, setSelectedModel] = useState(AIModelsOption[0]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const inputRef = useRef(null);
  const pulseIntervalRef = useRef(null);

  // Debounced input handler
  const debouncedSetInput = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const sanitized = sanitizeInput(value);
          setUserSearchInput(sanitized);
          setError(null); // Clear error when user types
        }, DEBOUNCE_DELAY);
      };
    })(),
    []
  );

  // Pulse effect management
  useEffect(() => {
    if (!userSearchInput) {
      pulseIntervalRef.current = setInterval(() => {
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), PULSE_DURATION);
      }, PULSE_INTERVAL);
    } else {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
        pulseIntervalRef.current = null;
      }
    }

    return () => {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
    };
  }, [userSearchInput]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_INPUT_LENGTH) {
      debouncedSetInput(value);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userSearchInput.trim()) {
        onSearchQuery();
      }
    }
    if (e.key === 'Escape') {
      setUserSearchInput("");
      setError(null);
      inputRef.current?.blur();
    }
  };

  // Search query handler with error handling
  const onSearchQuery = async () => {
    try {
      // Validate input
      const validation = validateInput(userSearchInput);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      // Check authentication
      if (!user?.primaryEmailAddress?.emailAddress) {
        setError("Please sign in to continue");
        return;
      }

      setLoading(true);
      setError(null);

      const libId = uuidv4();
      const { data, error: supabaseError } = await supabase
        .from("Library")
        .insert([
          {
            searchInput: userSearchInput,
            userEmail: user.primaryEmailAddress.emailAddress,
            type: searchType,
            libId: libId,
            model: selectedModel.name,
            timestamp: new Date().toISOString(),
          },
        ])
        .select();

      if (supabaseError) {
        throw new Error(`Database error: ${supabaseError.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error("Failed to save search query");
      }

      // Navigate to search results
      router.push(`/search/${libId}`);
      
      // Clear input after successful search
      setUserSearchInput("");
      
    } catch (error) {
      console.error("Search failed:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle model selection
  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center px-4 relative">
      {/* Logo with animation */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          userSearchInput ? "opacity-50 scale-90" : "opacity-100 scale-100"
        }`}
        style={{
          transform: `translateY(${userSearchInput ? "-20px" : "0px"})`,
        }}
      >
        <Image
          src={"/logo.png"}
          alt="Perplexity AI Clone Logo"
          width={200}
          height={200}
          priority
          className="mx-auto"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="w-full max-w-2xl mt-4 border-red-200 bg-red-50" role="alert">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Input Container */}
      <div
        className={`p-2 w-full max-w-2xl border rounded-2xl mt-10 transition-all duration-300 
                    ${isHovering ? "shadow-lg" : "shadow-md"} 
                    ${userSearchInput ? "border-blue-400" : "border-gray-200"}
                    ${error ? "border-red-300" : ""}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        role="search"
        aria-label="Search interface"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <Tabs defaultValue="Search" className="w-full">
            <TabsContent value="Search">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask Anything"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                maxLength={MAX_INPUT_LENGTH}
                className="w-full p-4 outline-none transition-all duration-300 text-sm"
                aria-label="Search input field"
                aria-describedby="search-help"
                aria-invalid={error ? "true" : "false"}
                disabled={loading}
              />
            </TabsContent>
            <TabsContent value="Research">
              <input
                ref={inputRef}
                type="text"
                placeholder="Research Anything"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                maxLength={MAX_INPUT_LENGTH}
                className="w-full p-4 outline-none transition-all duration-300 text-sm"
                aria-label="Research input field"
                aria-describedby="research-help"
                aria-invalid={error ? "true" : "false"}
                disabled={loading}
              />
            </TabsContent>

            <TabsList className="mt-2 flex justify-start" role="tablist">
              <TabsTrigger
                value="Search"
                className="flex items-center gap-1 text-primary transition-transform duration-200 hover:scale-105"
                onClick={() => setSearchType("search")}
                aria-label="Switch to search mode"
              >
                <SearchCheck className="h-4 w-4" aria-hidden="true" />
                Search
              </TabsTrigger>
              <TabsTrigger
                value="Research"
                className="flex items-center gap-1 text-primary transition-transform duration-200 hover:scale-105"
                onClick={() => setSearchType("research")}
                aria-label="Switch to research mode"
              >
                <Atom className="h-4 w-4" aria-hidden="true" />
                Research
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
            {/* AI Model Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="transition-transform duration-200 hover:scale-110"
                  aria-label={`Current AI model: ${selectedModel.name}. Click to change model`}
                >
                  <Cpu className="text-gray-500 h-5 w-5 hover:text-blue-500" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="animate-in fade-in-50 zoom-in-95 duration-200">
                {AIModelsOption.map((model, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleModelSelect(model)}
                    aria-label={`Select ${model.name} model`}
                  >
                    <div className="mb-1">
                      <h2 className="text-xs font-medium">{model.name}</h2>
                      <p className="text-xs text-gray-600">{model.desc}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Additional Action Buttons */}
            <button
              className="text-gray-500 h-5 w-5 hover:text-blue-500 hover:scale-110 cursor-pointer transition-all duration-200"
              aria-label="Web search options"
              tabIndex={0}
            >
              <Globe aria-hidden="true" />
            </button>
            
            <button
              className="text-gray-500 h-5 w-5 hover:text-blue-500 hover:scale-110 cursor-pointer transition-all duration-200"
              aria-label="Attach file"
              tabIndex={0}
            >
              <Paperclip aria-hidden="true" />
            </button>
            
            <button
              className="text-gray-500 h-5 w-5 hover:text-blue-500 hover:scale-110 cursor-pointer transition-all duration-200"
              aria-label="Voice input"
              tabIndex={0}
            >
              <Mic aria-hidden="true" />
            </button>

            {/* Submit Button */}
            <Button
              onClick={onSearchQuery}
              disabled={loading || !userSearchInput.trim()}
              className={`transition-all duration-300 ease-in-out rounded-full 
                ${pulseEffect && !userSearchInput ? "animate-pulse" : ""} 
                ${loading ? "bg-blue-400" : ""}`}
              aria-label={
                loading 
                  ? "Searching..." 
                  : userSearchInput.trim() 
                    ? "Submit search" 
                    : "Enter a query to search"
              }
            >
              {!userSearchInput.trim() ? (
                <AudioLines
                  className={`text-white h-5 w-5 ${
                    pulseEffect ? "scale-110" : "scale-100"
                  } transition-transform duration-200`}
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight
                  className={`text-white h-5 w-5 ${
                    loading ? "animate-spin" : "animate-bounce"
                  }`}
                  aria-hidden="true"
                />
              )}
            </Button>
          </div>
        </div>

        {/* Character Count */}
        {userSearchInput && (
          <div className="text-xs text-gray-400 mt-2 text-right">
            {userSearchInput.length}/{MAX_INPUT_LENGTH}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div
        id="search-help"
        className={`mt-6 text-gray-400 text-sm transition-opacity duration-500 text-center ${
          userSearchInput ? "opacity-0" : "opacity-80"
        }`}
      >
        Start typing to search or research anything. Press Enter to submit, Escape to clear.
      </div>
    </div>
  );
}

export default ChatInputBox;