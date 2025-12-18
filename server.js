// server.js
// Minimal Opal custom tool server (endpoints only, no business logic)
// - GET  /discovery  -> returns valid "functions" manifest
// - POST /tools/allocate_influencer_budget -> echoes parameters back

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check (optional but handy)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

/**
 * DISCOVERY ENDPOINT
 * Optimizely Opal expects: { functions: [ ... ] }
 */
app.get("/discovery", (req, res) => {
  res.json({
    functions: [
      {
        name: "allocate_influencer_budget",
        description: "Allocates budget across influencers given a campaign brief and candidates CSV text.",
        parameters: [
          {
            name: "campaign_brief_json",
            type: "string",
            description: "Normalized campaign brief as a JSON string.",
            required: true
          },
          {
            name: "candidates_csv_text",
            type: "string",
            description: "CSV text with header row containing influencer candidates.",
            required: true
          },
          {
            name: "mode",
            type: "string",
            description: "Optimization mode (e.g. binary_selection).",
            required: false
          }
        ],
        endpoint: "/tools/allocate_influencer_budget",
        auth_requirements: [],
        http_method: "POST"
      }
    ]
  });
});

/**
 * TOOL EXECUTION ENDPOINT
 * Opal sends tool calls shaped like: { "parameters": { ... } }
 * This stub just echoes parameters back so you can verify wiring.
 */
app.post("/tools/allocate_influencer_budget", (req, res) => {
  const params = req.body?.parameters || {};

  // Minimal validation
  if (!params.campaign_brief_json || !params.candidates_csv_text) {
    return res.status(400).json({
      status: "error",
      error_message: "Missing required parameters: campaign_brief_json, candidates_csv_text"
    });
  }

  // Echo back (replace with real logic later)
  return res.json({
    status: "ok",
    received: {
      campaign_brief_json: params.campaign_brief_json,
      candidates_csv_text: params.candidates_csv_text,
      mode: params.mode || "binary_selection"
    }
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Opal tool server running at http://localhost:${PORT}`);
  console.log(`Discovery endpoint: http://localhost:${PORT}/discovery`);
});

