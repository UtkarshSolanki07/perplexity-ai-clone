import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { llmModel} from "@/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    llmModel,
  ],
});
