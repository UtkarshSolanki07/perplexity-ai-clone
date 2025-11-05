import React, { useEffect, useState } from "react";
import {
  Loader2Icon,
  LucideImage,
  LucideList,
  LucideSparkles,
  Send,
} from "lucide-react";
import AnswerDisplay from "./AnswerDisplay";
import axios from "axios";
import { supabase } from "@/app/Supabase";
import { useParams } from "next/navigation";
import ImageListTab from "./ImageListTab";
import SourceListTab from "./SourceListTab";
import { Button } from "@/components/ui/button";

const DisplayResult = ({ researchInputRecord }) => {
  const tabs = [
    { label: "Answer", icon: LucideSparkles },
    { label: "Images", icon: LucideImage },
    { label: "Sources", icon: LucideList, badge: 10 },
  ];

  const [activeTab, setActiveTab] = useState("Answer");
  const [researchResults, setResearchResults] = useState([researchInputRecord]);
  const { libId } = useParams();
  const [loadingResearch, setLoadingResearch] = useState(false);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (!researchInputRecord) return;
    const hasChats =
      Array.isArray(researchInputRecord.Chats) &&
      researchInputRecord.Chats.length > 0;
    hasChats ? GetResearchRecords() : getResearchApiResult();
    setResearchResults(researchInputRecord);
    console.log("Research Input Record:", researchInputRecord);
  }, [researchInputRecord]);

  const getResearchApiResult = async () => {
    if (!userInput && !researchInputRecord?.searchInput) return;

    setLoadingResearch(true);

    try {
      const result = await axios.post("/api/google-search-api", {
        searchInput: userInput || researchInputRecord.searchInput,
        searchType: "Research",
      });

      if (result.data.error) {
        console.error("API Error:", result.data.error);
        setLoadingResearch(false);
        return;
      }

      const formattedResearchResp = result.data
        .slice(0, 5)
        .map((item, index) => ({
          title: item.title,
          url: item.link,
          snippet: item.snippet,
          index: index + 1,
          thumbnail:
            item?.pagemap?.cse_thumbnail?.[0]?.src ||
            item?.pagemap?.cse_image?.[0]?.src ||
            "",
        }));

      setResearchResults(formattedResearchResp);
      console.log("Formatted Research Results:", formattedResearchResp);

      const { data, error } = await supabase
        .from("Chats")
        .insert([
          {
            libId: libId,
            searchResult: formattedResearchResp,
            userSearchInput: userInput || researchInputRecord?.searchInput,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        setLoadingResearch(false);
        return;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("No data returned from insert");
        setLoadingResearch(false);
        return;
      }

      console.log("Inserted record ID:", data[0].id);
      await GetResearchRecords();
      setLoadingResearch(false);
      await GenerateAIResp(formattedResearchResp, data[0].id);
      setUserInput("");
    } catch (error) {
      console.error("Error in getResearchApiResult:", error);
      setLoadingResearch(false);
    }
  };

  const GenerateAIResp = async (formattedResearchResp, recordId) => {
    const result = await axios.post("/api/llm-research-model", {
      researchInput: userInput || researchInputRecord?.searchInput,
      researchResult: formattedResearchResp,
      recordId: recordId,
    });

    const runId = result.data;
    console.log("Run ID:", runId);

    const interval = setInterval(async () => {
      const runResp = await axios.post("/api/get-inngest-status", {
        runId: runId,
      });

      if (runResp?.data?.data?.[0]?.status === "Completed") {
        console.log("COMPLETED");
        await GetResearchRecords();
        clearInterval(interval);
      }
    }, 1000);
  };

  const GetResearchRecords = async () => {
    // Fetch Library record with Chats relation
    let { data: Library, error: libError } = await supabase
      .from("Library")
      .select("*,Chats(*)")
      .eq("libId", libId);

    if (libError) {
      console.error("Error fetching library record:", libError);
      return;
    }

    if (!Library || Library.length === 0) {
      console.error("No library record found");
      return;
    }

    const record = Library[0];
    setResearchResults(record);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && userInput.trim()) {
      getResearchApiResult();
    }
  };

  return (
    <div className="mt-7">
      {researchResults?.Chats?.map((research, index) => (
        <div key={index} className="mt-7">
          <h2 className="font-bold text-4xl text-gray-600 ">
            {research?.userSearchInput}
          </h2>
          <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
            {tabs.map(({ label, icon: Icon, badge }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${
                  activeTab === label ? "text-black" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {badge && (
                  <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {badge}
                  </span>
                )}
                {activeTab === label && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
                )}
              </button>
            ))}
            <div className="ml-auto text-sm text-gray-500">
              1 task <span className="ml-1">↗</span>
            </div>
          </div>

          <div>
            {activeTab == "Answer" ? (
              <AnswerDisplay
                research={research}
                loadingResearch={loadingResearch}
              />
            ) : activeTab == "Images" ? (
              <ImageListTab research={research} />
            ) : activeTab == "Sources" ? (
              <SourceListTab researches={research} />
            ) : null}
          </div>
          <hr className="my-5" />
        </div>
      ))}
      <div className="bg-white w-full border rounded-lg shadow-md p-3 px-5 flex justify-between fixed bottom-6 max-w-md lg:max-w-xl xl:max-w-3xl">
        <input
          placeholder="Type Anything..."
          className="outline-none w-full mr-2"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={getResearchApiResult}
          disabled={loadingResearch || !userInput.trim()}
          className={!userInput.trim() ? "opacity-50 cursor-not-allowed" : ""}
        >
          {loadingResearch ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Send />
          )}
        </Button>
      </div>
    </div>
  );
};

export default DisplayResult;
