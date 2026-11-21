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
        maxMarks: 0,
        percentage: 0,
        breakdown: [],
        rewardPointsBreakdown: { category: "", periods: {} },
        internalMarksBreakdown: { category: "", periods: {} },
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
      maxMarks: 0,
      percentage: 0,
      breakdown: [],
      rewardPointsBreakdown: { category: "", periods: {} },
      internalMarksBreakdown: { category: "", periods: {} },
    },
    raw: text,
  };

  const lines = text.split("\n").map((l) => l.trim());
  let currentSubject = null;
  let currentCategory = "Theory Subjects";
  let inOverall = false;
  let currentBreakdownContext = null; // 'reward' | 'internal' | null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
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
      // Category header: e.g. "📚 THEORY SUBJECTS (5 subjects)"
      if (/SUBJECTS\s*\(/i.test(line) || /^[📚📖🔬🧪]?\s*[A-Z\s]+SUBJECTS/i.test(line)) {
        const cleanCat = line
          .replace(/^[📚📖🔬🧪\s]+/, "")
          .replace(/\s*\([0-9]+\s*subjects?\)/i, "")
          .trim();
        if (cleanCat && !cleanCat.includes("===") && !cleanCat.includes("---")) {
          currentCategory = cleanCat;
        }
        continue;
      }

      // Subject detection: e.g. "🔹 22CS301" or "22CS301"
      if (line.startsWith("🔹") || /^[0-9]{2}[A-Z]{2,4}[0-9]{3}/i.test(line)) {
        if (currentSubject) {
          result.subjects.push(currentSubject);
        }
        const code = line.replace(/^[🔹\s]+/, "").trim();
        currentSubject = {
          code,
          category: currentCategory,
          rewardPoints: {},
          internalMarks: {},
          rewardPointsText: "",
          internalMarksText: "",
          ip1Points: 0,
          ip2Points: 0,
          totalPoints: 0,
          ip1Marks: 0,
          ip2Marks: 0,
          totalMarks: 0,
          maxMarks: 30,
        };
        continue;
      }

      if (currentSubject) {
        if (line.toLowerCase().startsWith("reward points:")) {
          currentSubject.rewardPointsText = line.replace(/^reward points:\s*/i, "");
          currentSubject.rewardPointsText.split("|").forEach((p) => {
            const [k, v] = p.split(":").map((s) => s.trim());
            if (k && v) {
              currentSubject.rewardPoints[k] = v;
              const numericVal = parseFloat(v.replace(/[^0-9.]/g, "")) || 0;
              const keyUpper = k.toUpperCase().replace(/\s+/g, "");
              if (keyUpper.includes("IP-1") || keyUpper.includes("IP1")) {
                currentSubject.ip1Points = numericVal;
              } else if (keyUpper.includes("IP-2") || keyUpper.includes("IP2")) {
                currentSubject.ip2Points = numericVal;
              } else if (keyUpper.includes("TOTAL")) {
                currentSubject.totalPoints = numericVal;
              }
            }
          });
        } else if (line.toLowerCase().startsWith("internal marks:")) {
          currentSubject.internalMarksText = line.replace(/^internal marks:\s*/i, "");
          currentSubject.internalMarksText.split("|").forEach((p) => {
            const [k, v] = p.split(":").map((s) => s.trim());
            if (k && v) {
              currentSubject.internalMarks[k] = v;
              const numericVal = parseFloat(v.replace(/[^0-9.]/g, "")) || 0;
              const keyUpper = k.toUpperCase().replace(/\s+/g, "");
              if (keyUpper.includes("IP-1") || keyUpper.includes("IP1")) {
                currentSubject.ip1Marks = numericVal;
              } else if (keyUpper.includes("IP-2") || keyUpper.includes("IP2")) {
                currentSubject.ip2Marks = numericVal;
              } else if (keyUpper.includes("TOTAL")) {
                currentSubject.totalMarks = numericVal;
              }
            }
          });
        }
      }
    } else {
      // Inside OVERALL SUMMARY
      if (/REWARD\s+POINTS\s+BREAKDOWN/i.test(line)) {
        currentBreakdownContext = "reward";
        continue;
      } else if (/INTERNAL\s+MARKS\s+BREAKDOWN/i.test(line)) {
        currentBreakdownContext = "internal";
        continue;
      }

      // Check category summaries like "Theory Subjects: 6420.00 points" or "Theory Subjects: 150.00 marks"
      if (/points$/i.test(line) && currentBreakdownContext === "reward") {
        result.overall.rewardPointsBreakdown.category = line;
        continue;
      }
      if (/marks$/i.test(line) && currentBreakdownContext === "internal") {
        result.overall.internalMarksBreakdown.category = line;
        continue;
      }

      // Check bullet items: ➤ IP-1: 3360.00
      if (line.startsWith("➤") || line.startsWith("•") || line.startsWith("-")) {
        const cleanBullet = line.replace(/^[➤•\-\s]+/, "").trim();
        result.overall.breakdown.push(cleanBullet);

        const [periodKey, periodVal] = cleanBullet.split(":").map((s) => s.trim());
        if (periodKey && periodVal) {
          if (currentBreakdownContext === "reward") {
            result.overall.rewardPointsBreakdown.periods[periodKey] = periodVal;
          } else if (currentBreakdownContext === "internal") {
            result.overall.internalMarksBreakdown.periods[periodKey] = periodVal;
          }
        }
        continue;
      }

      // Handle total fields (robust to multiline splits like "🎯 TOTAL REWARD \n\n: 6420.00")
      if (/TOTAL\s+REWARD/i.test(line)) {
        currentBreakdownContext = null;
        let val = "";
        if (line.includes(":")) {
          val = line.split(":")[1]?.trim() || "";
        }
        if (!val) {
          for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
            const nextL = lines[j];
            if (!nextL) continue;
            if (nextL.startsWith(":")) {
              val = nextL.replace(/^:\s*/, "").trim();
              i = j;
              break;
            } else if (/^[0-9.,]+$/.test(nextL)) {
              val = nextL.trim();
              i = j;
              break;
            }
          }
        }
        result.overall.totalRewardPoints = val;
      } else if (line.includes("TOTAL INTERNAL MARKS:")) {
        currentBreakdownContext = null;
        result.overall.totalInternalMarks = line.split("TOTAL INTERNAL MARKS:")[1]?.trim() || "";
      } else if (line.includes("TOTAL SUBJECTS:")) {
        currentBreakdownContext = null;
        result.overall.totalSubjects = line.split("TOTAL SUBJECTS:")[1]?.trim() || "";
      }
    }
  }

  if (currentSubject) {
    result.subjects.push(currentSubject);
  }

  // Fallback regex if overall totals were missed due to unusual line splits
  if (!result.overall.totalRewardPoints) {
    const match = text.match(/TOTAL\s+REWARD(?:[^\n:]*)\s*:\s*([0-9.,]+)/i);
    if (match) result.overall.totalRewardPoints = match[1].trim();
  }
  if (!result.overall.totalInternalMarks) {
    const match = text.match(/TOTAL\s+INTERNAL\s+MARKS\s*:\s*([0-9.,]+)/i);
    if (match) result.overall.totalInternalMarks = match[1].trim();
  }
  if (!result.overall.totalSubjects) {
    const match = text.match(/TOTAL\s+SUBJECTS\s*:\s*([0-9]+)/i);
    if (match) {
      result.overall.totalSubjects = match[1].trim();
    } else if (result.subjects.length > 0) {
      result.overall.totalSubjects = String(result.subjects.length);
    }
  }

  // Calculate overall completion and percentages
  const numSubjects = parseInt(result.overall.totalSubjects, 10) || result.subjects.length || 0;
  result.overall.maxMarks = numSubjects * 30;
  const earnedMarks = parseFloat(result.overall.totalInternalMarks) || 0;
  result.overall.percentage =
    result.overall.maxMarks > 0
      ? Math.round((earnedMarks / result.overall.maxMarks) * 100 * 10) / 10
      : 0;

  return result;
}

const CLIENT_CACHE_PREFIX = "bitcentral_im_cache_";
const CLIENT_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours client-side cache
const CLIENT_MIN_REFRESH_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes debounce for manual refresh

function getLocalCachedData(rollNo) {
  try {
    const raw = localStorage.getItem(`${CLIENT_CACHE_PREFIX}${rollNo}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.raw || !parsed.timestamp) return null;
    if (Date.now() - parsed.timestamp > CLIENT_CACHE_TTL_MS) {
      localStorage.removeItem(`${CLIENT_CACHE_PREFIX}${rollNo}`);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function setLocalCachedData(rollNo, rawData) {
  try {
    if (!rollNo || !rawData) return;
    localStorage.setItem(
      `${CLIENT_CACHE_PREFIX}${rollNo}`,
      JSON.stringify({
        raw: rawData,
        timestamp: Date.now(),
      })
    );
  } catch {
    // Ignore storage quota errors
  }
}

function parseLocalCache(raw) {
  if (!raw) return null;
  try {
    if (raw.startsWith("{") && raw.includes('"subjects"')) {
      return JSON.parse(raw);
    }
  } catch {}
  return parseInternalMarksSummary(raw);
}

export async function fetchInternalMarkConversion(rollNo, forceRefresh = false) {
  if (!rollNo) {
    throw new Error("Roll number is required");
  }

  const cleanRollNo = String(rollNo).trim().toUpperCase();

  // 1. Check local persistent cache
  const localCached = getLocalCachedData(cleanRollNo);
  if (localCached?.raw) {
    // If not forcing refresh, immediately return cached result without hitting network
    if (!forceRefresh) {
      return parseLocalCache(localCached.raw);
    }
    // If forcing refresh, enforce client cooldown (3 min) to prevent rapid-fire clicks
    if (Date.now() - localCached.timestamp < CLIENT_MIN_REFRESH_INTERVAL_MS) {
      return parseLocalCache(localCached.raw);
    }
  }

  // 2. Fetch through the server backend with server-side caching & single-flight
  try {
    const refreshParam = forceRefresh ? "&refresh=true" : "";
    const res = await api.get(
      `/internal-marks/conversion?roll_no=${encodeURIComponent(cleanRollNo)}${refreshParam}`
    );
    if (res.data?.success) {
      if (res.data.subjects && Array.isArray(res.data.subjects)) {
        const subjects = res.data.subjects.map((s) => ({
          code: s.code,
          category: s.category || "Theory Subjects",
          internalMarks: { Total: String(s.mark) },
          rewardPoints: {},
          totalMarks: s.mark,
          maxMarks: s.max_marks || 30,
        }));
        const maxMarks =
          res.data.overall?.max_marks ||
          subjects.reduce((sum, s) => sum + (s.maxMarks || 30), 0);
        const earnedMarks =
          res.data.overall?.total_internal_marks !== undefined
            ? res.data.overall.total_internal_marks
            : subjects.reduce((sum, s) => sum + s.totalMarks, 0);

        const parsed = {
          title: "Internal Marks Summary",
          subjects,
          overall: {
            totalSubjects: String(res.data.overall?.total_subjects || subjects.length),
            totalInternalMarks: String(earnedMarks),
            maxMarks,
            percentage:
              res.data.overall?.percentage ||
              (maxMarks > 0 ? Math.round((earnedMarks / maxMarks) * 1000) / 10 : 0),
            breakdown: [],
            rewardPointsBreakdown: { category: "", periods: {} },
            internalMarksBreakdown: { category: "", periods: {} },
          },
          studentName: res.data.student_name,
          department: res.data.department,
          year: res.data.year,
          degree: res.data.degree,
          raw: res.data.raw || "",
        };
        setLocalCachedData(cleanRollNo, JSON.stringify(parsed));
        return parsed;
      }

      if (res.data?.raw) {
        setLocalCachedData(cleanRollNo, res.data.raw);
        return parseInternalMarksSummary(res.data.raw);
      }
    }
  } catch (err) {
    console.warn("Backend internal marks cache route failed, evaluating fallback:", err);
    // If the server explicitly rejected with a 4xx client error, don't hammer Gradio
    if (err?.response?.status && err.response.status >= 400 && err.response.status < 500) {
      throw new Error(err.response.data?.error || "Invalid request for internal marks.");
    }
  }

  // 3. Fallback to direct Gradio client only if network/server is completely down
  try {
    const client = await getGradioClient();
    const result = await client.predict("/extract_subjects_and_marks_for_gradio", {
      roll_no: cleanRollNo,
    });

    const rawData = Array.isArray(result?.data) ? result.data[0] : result?.data;
    if (rawData) {
      setLocalCachedData(cleanRollNo, rawData);
    }
    return parseInternalMarksSummary(rawData);
  } catch (directErr) {
    // If we have stale local cached data, prefer returning that over a failure
    if (localCached?.raw) {
      return parseLocalCache(localCached.raw);
    }
    throw directErr;
  }
}

