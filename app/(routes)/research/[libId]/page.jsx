"use client";
import { supabase } from "@/app/Supabase";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import DisplayResult from "./_components/DisplayResult";

const ResearchQueryResult = () => {
  const { libId } = useParams();
  const [researchInputRecord, setResearchInputRecord] = useState(null);

  useEffect(() => {
    if (libId) {
      GetResearchQueryRecord();
    }
  }, [libId]);

  const GetResearchQueryRecord = async () => {
    let { data: Library, error } = await supabase
      .from("Library")
      .select("*,Chats(*)")
      .eq("libId", libId)
      .order("id", { foreignTable: "Chats", ascending: true });

    if (error) {
      console.error("Error fetching research records:", error);
      setResearchInputRecord(null);
      return;
    }

    if (!Library || !Array.isArray(Library) || Library.length === 0) {
      console.error("No library data returned");
      setResearchInputRecord(null);
      return;
    }

    setResearchInputRecord(Library[0]);
  };
  return (
    <div>
      <Header researchInputRecord={researchInputRecord} />
      <div className="px-10 md:px-20 lg:px-36 xl:px-56 mt-20">
        {researchInputRecord === null ? (
          <div className="text-center mt-10">
            <h2 className="text-2xl font-bold text-gray-600">
              No Research Found
            </h2>
            <p className="text-gray-500 mt-2">
              The research record you're looking for doesn't exist.
            </p>
          </div>
        ) : (
          <DisplayResult researchInputRecord={researchInputRecord} />
        )}
      </div>
    </div>
  );
};

export default ResearchQueryResult;
