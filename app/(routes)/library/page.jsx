"use client";
import { supabase } from "@/app/Supabase";
import { useUser } from "@clerk/nextjs";
import {
  SquareArrowOutUpRight,
  Search,
  Atom,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Library = () => {
  const { user } = useUser();

  const [libraryHistory, setLibraryHistory] = useState();

  const router = useRouter();

  useEffect(() => {
    user && GetLibraryHistory();
  }, [user]);

  const GetLibraryHistory = async () => {
    let { data: Library, error } = await supabase
      .from("Library")
      .select("*")
      .eq("userEmail", user?.primaryEmailAddress?.emailAddress)
      .order("id", { ascending: false });
    console.log("Library Data:", Library);
    setLibraryHistory(Library);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="mt-20 px-10 md:px-20 lg:px-36 xl:px-56">
        {/* Enhanced Header */}
        <div className="relative mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-3xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Your Library
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {libraryHistory?.length || 0} saved searches
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 opacity-20">
            <Sparkles className="h-12 w-12 text-teal-500" />
          </div>
        </div>

        {/* Library Items */}
        <div className="space-y-4">
          {libraryHistory?.length > 0 ? (
            libraryHistory.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-teal-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() =>
                  router.push(
                    item.type === "research"
                      ? `/research/${item.libId}`
                      : `/search/${item.libId}`
                  )
                }
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    {/* Type indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`p-2 rounded-lg ${
                          item.type === "research"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {item.type === "research" ? (
                          <Atom className="h-4 w-4" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.type === "research"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {item.type === "research" ? "Research" : "Search"}
                      </span>
                    </div>

                    {/* Search input */}
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                      {item.searchInput}
                    </h3>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{moment(item.created_at).fromNow()}</span>
                    </div>
                  </div>

                  {/* Arrow icon */}
                  <div className="ml-4 p-2 rounded-full bg-gray-50 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all duration-300">
                    <SquareArrowOutUpRight className="h-5 w-5" />
                  </div>
                </div>

                {/* Subtle bottom border */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>
            ))
          ) : (
            /* Empty state */
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No searches yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring to build your library of knowledge
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Search className="h-4 w-4" />
                Start Searching
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
