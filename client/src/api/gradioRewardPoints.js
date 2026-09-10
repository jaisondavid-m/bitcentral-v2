import api from "@/api/axios.js";
import { Client } from "@gradio/client";

// Read token from environment variable if provided
const HF_AUTH_TOKEN = import.meta.env?.VITE_HF_TOKEN || "";

// Cache client connection promise as fallback
let clientInstance = null;
async function getGradioClient() {
  if (!clientInstance) {
    const connectOptions = HF_AUTH_TOKEN ? { token: HF_AUTH_TOKEN } : {};
    clientInstance = await Client.connect("PraneshJs/RewardPointsSite", connectOptions);
  }
  return clientInstance;
}

export function parseInternalMarksSummary(text) {
  if (!text || typeof text !== "string") {
    return {
      title: "Innovative Practice (IP) Summary",
      subjects: [],
      overall: {
        totalRewardPoints: null,
        totalInternalMarks: null,
        totalSubjects: null,
        breakdown: [],
      },
      raw: text || "",
    };
  }

  const result = {
    title: "Innovative Practice (IP) Summary",
    subjects: [],
    overall: {
      totalRewardPoints: null,
      totalInternalMarks: null,
      totalSubjects: null,
      breakdown: [],
    },
    raw: text,
  };

  const lines = text.split("\n").map((l) => l.trim());
  let currentSubject = null;
  let inOverall = false;

  for (const line of lines) {
    if (!line) continue;

    if (line.includes("OVERALL SUMMARY")) {
      inOverall = true;
      if (currentSubject) {
        result.subjects.push(currentSubject);
        currentSubject = null;
      }
      continue;
    }

    if (!inOverall) {
      // Subject detection: e.g. "🔹 22CS301" or "22CS301"
      if (line.startsWith("🔹") || /^[0-9]{2}[A-Z]{2,4}[0-9]{3}/i.test(line)) {
        if (currentSubject) {
          result.subjects.push(currentSubject);
        }
        const code = line.replace(/^[🔹\s]+/, "").trim();
        currentSubject = {
          code,
          rewardPoints: {},
          internalMarks: {},
          rewardPointsText: "",
          internalMarksText: "",
        };
        continue;
      }

      if (currentSubject) {
        if (line.toLowerCase().startsWith("reward points:")) {
          currentSubject.rewardPointsText = line.replace(/^reward points:\s*/i, "");
          currentSubject.rewardPointsText.split("|").forEach((p) => {
            const [k, v] = p.split(":").map((s) => s.trim());
            if (k && v) currentSubject.rewardPoints[k] = v;
          });
        } else if (line.toLowerCase().startsWith("internal marks:")) {
          currentSubject.internalMarksText = line.replace(/^internal marks:\s*/i, "");
          currentSubject.internalMarksText.split("|").forEach((p) => {
            const [k, v] = p.split(":").map((s) => s.trim());
            if (k && v) currentSubject.internalMarks[k] = v;
          });
        }
      }
    } else {
      if (line.includes("TOTAL REWARD POINTS:")) {
        result.overall.totalRewardPoints = line.split("TOTAL REWARD POINTS:")[1]?.trim() || "";
      } else if (line.includes("TOTAL INTERNAL MARKS:")) {
        result.overall.totalInternalMarks = line.split("TOTAL INTERNAL MARKS:")[1]?.trim() || "";
      } else if (line.includes("TOTAL SUBJECTS:")) {
        result.overall.totalSubjects = line.split("TOTAL SUBJECTS:")[1]?.trim() || "";
      } else if (line.startsWith("➤") || line.startsWith("•") || line.startsWith("-")) {
        result.overall.breakdown.push(line.replace(/^[➤•\-\s]+/, "").trim());
      }
    }
  }

  if (currentSubject) {
    result.subjects.push(currentSubject);
  }

  return result;
}

export async function fetchInternalMarkConversion(rollNo) {
  if (!rollNo) {
    throw new Error("Roll number is required");
  }

  const cleanRollNo = String(rollNo).trim();

  // 1. First, fetch through the server backend with 24-hour cache
  try {
    const res = await api.get(`/internal-marks/conversion?roll_no=${encodeURIComponent(cleanRollNo)}`);
    if (res.data?.success && res.data?.raw) {
      return parseInternalMarksSummary(res.data.raw);
    }
  } catch (err) {
    console.warn("Backend internal marks cache route failed, falling back to direct Gradio client:", err);
  }

  // 2. Resilient fallback to direct Gradio client
  const client = await getGradioClient();
  const result = await client.predict("/extract_subjects_and_marks_for_gradio", {
    roll_no: cleanRollNo,
  });

  const rawData = Array.isArray(result?.data) ? result.data[0] : result?.data;
  return parseInternalMarksSummary(rawData);
}
