import { supabase } from "@/app/Supabase";
import { inngest } from "./client";

export const llmModel = inngest.createFunction(
  { id: "llm-model" },
  { event: "llm-model" },
  async ({ event, step }) => {
    const aiResp = await step.ai.infer("generate-ai-llm-model-call", {
      model: step.ai.models.gemini({
        model: "gemini-2.0-flash",
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Depends on user input sources, summarize and search about topic. Give a markdown text with proper formatting. User Input is: " +
                  event.data.searchInput,
              },
            ],
          },
        ],
      },
    });

    const saveToDb = await step.run("saveToDb", async () => {
      const { data, error } = await supabase
        .from("Chats")
        .update({ aiResp: aiResp?.candidates[0].content.parts[0].text })
        .eq("id", event.data.recordId)
        .select();

      return aiResp;
    });
  }
);

export const llmResearchModel = inngest.createFunction(
  { id: "llm-research-model" },
  { event: "llm-research-model" },
  async ({ event, step }) => {
    
    const { data: previousChats, error: fetchError } = await supabase
      .from("Chats")
      .select("userSearchInput, aiResp")
      .eq("libId", event.data.libId)
      .order("created_at", { ascending: true });

    if (fetchError) {
      console.error("Error fetching previous chats:", fetchError);
    }

    
    let conversationContext = "";
    if (previousChats && previousChats.length > 0) {
      conversationContext = previousChats
        .filter((chat) => chat.aiResp) 
        .map(
          (chat) => `User: ${chat.userSearchInput}\nAssistant: ${chat.aiResp}`
        )
        .join("\n\n");
      conversationContext += "\n\n";
    }

    const prompt =
      conversationContext +
      "Depends on user input sources, summarize and research about topic. Give a markdown text with proper formatting. User Input is: " +
      event.data.researchInput;

    const aiResp = await step.ai.infer("generate-ai-llm-research-model-call", {
      model: step.ai.models.gemini({
        model: "gemini-2.0-flash-exp",
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
    });

    const saveToDb = await step.run("saveToDb", async () => {
      const { data, error } = await supabase
        .from("Chats")
        .update({ aiResp: aiResp?.candidates[0].content.parts[0].text })
        .eq("id", event.data.recordId)
        .select();
      return aiResp;
    });
  }
);
