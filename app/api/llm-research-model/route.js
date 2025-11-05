import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { researchInput, researchResult, recordId, previousContext } =
    await req.json();

  const inngestRunId = await inngest.send({
    name: "llm-research-model",
    data: {
      researchInput: researchInput,
      researchResult: researchResult,
      recordId: recordId,
    },
  });

  return NextResponse.json(inngestRunId.ids[0]);
}
