import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// ─── Hardcoded System Instructions (C2: Prompt Injection Prevention) ─────────
// These MUST NOT be sent from the client. Server selects based on `mode` field.

const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  assistant: `คุณเป็น AI ผู้ช่วยนายช่างโยธา และผู้ควบคุมงานก่อสร้างของหน่วยงานราชการไทย
มีหน้าที่วิเคราะห์และสร้างข้อมูลรายงานผลการปฏิบัติงานผู้ควบคุมงานก่อสร้างประจำสัปดาห์ (V2)

ถ้าผู้ใช้ขอให้สร้างหรืออัปเดตรายงาน ให้ส่งคืนผลลัพธ์ในรูปแบบ JSON โครงสร้างนี้ในบล็อก \`\`\`json:
{
  "thisWeekPercent": 20,
  "weightPercent": 100,
  "dailyNarrative": [
    "ผู้รับจ้างเข้าดำเนินการ...",
    "เข้าดำเนินการ...",
    "...",
    "...",
    "...",
    "...",
    "หยุดพักประจำสัปดาห์ / ตรวจความเรียบร้อย"
  ],
  "weatherMorning": ["แจ่มใส", "แจ่มใส", "แจ่มใส", "แจ่มใส", "แจ่มใส", "แจ่มใส", "แจ่มใส"],
  "weatherAfternoon": ["แจ่มใส", "แดดจัด", "แจ่มใส", "แจ่มใส", "แจ่มใส", "แจ่มใส", "แจ่มใส"],
  "laborRows": [
    { "category": "หัวหน้าคนงาน/ช่าง", "counts": [1, 1, 1, 1, 1, 1, 0] },
    { "category": "กรรมกร", "counts": [4, 5, 5, 5, 5, 4, 1] }
  ]
}
\`\`\`
และเขียนข้อความอธิบายสรุปเป็นภาษาไทยทางการที่กระชับและสุภาพ`,

  scanner: `คุณเป็นระบบ AI ผู้เชี่ยวชาญด้านการวิเคราะห์เอกสารสัญญาจ้างก่อสร้างและคำสั่งแต่งตั้งของหน่วยงานราชการไทย
มีหน้าที่สกัดข้อมูลสำคัญจากเอกสารสัญญาจ้าง (PDF หรือ รูปภาพ) เพื่อนำไปจัดทำรายงานผู้ควบคุมงานก่อสร้าง (ContractScan AI V2)

ให้สกัดข้อมูลและส่งคืนผลลัพธ์เป็น JSON ภายในบล็อก \`\`\`json เท่านั้น:
{
  "projectName": "ชื่อโครงการก่อสร้าง...",
  "location": "สถานที่ก่อสร้าง (หมู่ที่ ตำบล อำเภอ จังหวัด)...",
  "quantity": "ปริมาณงาน (กว้าง x ยาว x หนา ตารางเมตร ถมไหล่ทาง)...",
  "contractNo": "เลขที่สัญญา (เช่น ๓๐/๒๕๖๙ หรือ 30/2569)...",
  "contractDate": "วันที่ลงนามสัญญา (เช่น ๒๙ มิถุนายน ๒๕๖๙)...",
  "wsDate": "วันที่เริ่มต้นสัญญา/วันเริ่มงาน (เช่น ๓๐ มิถุนายน ๒๕๖๙)...",
  "contractEndDate": "วันที่แล้วเสร็จตามสัญญา (เช่น ๒๘ สิงหาคม ๒๕๖๙)...",
  "startDate": "วันที่เริ่มต้นสัญญา (เช่น ๓๐ มิถุนายน ๒๕๖๙)...",
  "totalDays": "จำนวนวันตามสัญญา (เช่น ๖๐ หรือ 60)...",
  "constructionCost": "ค่าก่อสร้างตามสัญญา (เช่น ๒๗๗,๐๐๐.๐๐ หรือ 277,000.00)...",
  "budgetAmount": "วงเงินงบประมาณ (ให้ใช้ตัวเลขเดียวกับค่าก่อสร้าง)...",
  "finePerDay": "ค่าปรับรายวัน (เช่น ๖๙๓.๐๐ หรือ 693.00)...",
  "contractorName": "ชื่อผู้รับจ้าง / ห้างหุ้นส่วนจำกัด...",
  "contractorAddress": "ที่อยู่สำนักงานใหญ่ของผู้รับจ้าง...",
  "rep1Name": "ชื่อผู้แทนผู้รับจ้าง/ผู้มีอำนาจลงนามฝ่ายผู้รับจ้าง (เช่น นายพรหมมินทร์ ปะระมา)...",
  "rep2Name": "ชื่อผู้แทนผู้รับจ้าง คนที่ 2 (ถ้ามี หรือใส่ -)...",
  "supervisorName": "ชื่อช่างผู้ควบคุมงาน (นาย/นาง)...",
  "supervisorPos": "ตำแหน่งผู้ควบคุมงาน...",
  "committeeChairName": "ชื่อประธานกรรมการตรวจรับพัสดุ...",
  "committeeChairPos": "ตำแหน่งประธานกรรมการ...",
  "committee1Name": "ชื่อกรรมการตรวจรับพัสดุ คนที่ 1...",
  "committee1Pos": "ตำแหน่งกรรมการ คนที่ 1...",
  "committee2Name": "ชื่อกรรมการตรวจรับพัสดุ คนที่ 2...",
  "committee2Pos": "ตำแหน่งกรรมการ คนที่ 2..."
}`,
};

// ─── Allowed Gemini Models (Input Validation) ─────────────────────────────────
const ALLOWED_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash"];
const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_PROMPT_LENGTH = 50_000; // 50 KB max prompt text

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3001", 10);

  // ─── C3: Security Headers (helmet) ──────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow fonts & images from CDN
    })
  );

  app.use(express.json({ limit: "10mb" }));

  // ─── 4.8: Health Check Endpoint ─────────────────────────────────────────────
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
    });
  });

  // ─── C1: Rate Limiting for Gemini API Proxy ─────────────────────────────────
  const geminiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 20, // 20 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "คำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง (Rate limit: 20 req/min)",
    },
  });

  // ─── Gemini API Proxy (with C2 + 2.3 hardening) ────────────────────────────
  app.post("/api/gemini/generate", geminiLimiter, async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server." });
      }

      const { prompt, contents, mode, model } = req.body;

      // ─── 2.3: Input Validation ────────────────────────────────────────────
      if (!prompt && !contents) {
        return res.status(400).json({ error: "Prompt or contents is required." });
      }

      // Validate prompt length
      if (typeof prompt === "string" && prompt.length > MAX_PROMPT_LENGTH) {
        return res.status(400).json({ error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters.` });
      }

      // Validate model against whitelist
      const chosenModel = ALLOWED_MODELS.includes(model) ? model : DEFAULT_MODEL;

      // ─── C2: Server-side system instruction selection ─────────────────────
      // Client sends `mode` ("assistant" | "scanner"), server picks the instruction.
      // Client-sent `systemInstruction` is IGNORED for security.
      const systemInstruction = SYSTEM_INSTRUCTIONS[mode as string] || undefined;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const payloadContents = contents || prompt;

      let response;
      try {
        response = await ai.models.generateContent({
          model: chosenModel,
          contents: payloadContents,
          config: systemInstruction
            ? { systemInstruction }
            : undefined,
        });
      } catch (firstErr: any) {
        const fallbackModel = chosenModel === "gemini-2.5-flash" ? "gemini-2.5-pro" : "gemini-2.5-flash";
        console.warn(`Primary model ${chosenModel} failed (${firstErr?.message || 'Error'}), trying fallback model ${fallbackModel}...`);
        try {
          response = await ai.models.generateContent({
            model: fallbackModel,
            contents: payloadContents,
            config: systemInstruction
              ? { systemInstruction }
              : undefined,
          });
        } catch {
          throw firstErr;
        }
      }

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API Error:", err?.message || err);
      return res.status(500).json({
        error: err?.message || "ระบบ AI กำลังมีผู้ใช้งานหนาแน่น กรุณาลองใหม่อีกครั้งในอีกสักครู่"
      });
    }
  });

  // ─── Vite development middleware / Static production serving ────────────────
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));
  const isProduction = process.env.NODE_ENV === "production" || (hasDist && process.env.NODE_ENV !== "development");

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${isProduction ? "production" : "development"}]`);
  });
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
