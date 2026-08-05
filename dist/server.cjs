var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
var MODELS = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview",
  "gemini-2.5-flash"
];
function getGeminiClient(customApiKey) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api/health", (req, res) => {
  const hasEnvKey = !!process.env.GEMINI_API_KEY;
  res.json({ status: "ok", hasEnvKey });
});
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { prompt, model, systemInstruction, responseMimeType, customApiKey } = req.body;
    const clientKey = req.headers["x-gemini-api-key"] || customApiKey;
    const ai = getGeminiClient(clientKey);
    if (!ai) {
      res.status(401).json({
        error: "Ch\u01B0a c\u1EA5u h\xECnh API Key. Vui l\xF2ng nh\u1EADp API Key trong ph\u1EA7n C\xE0i \u0111\u1EB7t ho\u1EB7c thi\u1EBFt l\u1EADp bi\u1EBFn GEMINI_API_KEY."
      });
      return;
    }
    if (!prompt) {
      res.status(400).json({ error: "Prompt kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng" });
      return;
    }
    let selectedModel = model || "gemini-3.6-flash";
    let modelIndex = MODELS.indexOf(selectedModel);
    if (modelIndex === -1) modelIndex = 0;
    let lastError = null;
    for (let i = modelIndex; i < MODELS.length; i++) {
      const currentModel = MODELS[i];
      try {
        const config = {};
        if (systemInstruction) config.systemInstruction = systemInstruction;
        if (responseMimeType) config.responseMimeType = responseMimeType;
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: prompt,
          config
        });
        const textOutput = response.text || "";
        res.json({
          text: textOutput,
          usedModel: currentModel
        });
        return;
      } catch (err) {
        console.error(`Error with model ${currentModel}:`, err?.message || err);
        lastError = err;
        if (err?.status === 401 || err?.status === 403 || err?.message?.includes("401") || err?.message?.includes("403")) {
          res.status(401).json({ error: "API Key kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp." });
          return;
        }
      }
    }
    res.status(500).json({
      error: lastError?.message || "L\u1ED7i x\u1EED l\xFD AI v\u1EDBi t\u1EA5t c\u1EA3 c\xE1c models kh\u1EA3 d\u1EE5ng."
    });
  } catch (error) {
    console.error("Server API Gemini error:", error);
    res.status(500).json({ error: error?.message || "L\u1ED7i h\u1EC7 th\u1ED1ng m\xE1y ch\u1EE7 AI" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
