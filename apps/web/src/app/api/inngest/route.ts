import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { computeWeeklyCharts } from "@/lib/private/charts/computeCharts";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    computeWeeklyCharts
  ],
});
