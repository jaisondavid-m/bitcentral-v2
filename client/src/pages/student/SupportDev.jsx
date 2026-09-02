import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Heart,
  ShieldCheck,
  Server,
  Code2,
  Users,
  Lock,
  Sparkles,
  CheckCircle2,
  User,
  Mail,
  Phone,
  CreditCard,
  Loader2,
  X,
  ArrowLeft,
  LogIn,
  GraduationCap,
  EyeOff,
} from "lucide-react";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { auth, logout } from "@/config/firebase.js";
import { useAuth } from "@/context/StudentContext.jsx";
import { getSponsorsLeaderboard, getMeProfile, checkUserContribution, createSponsorOrder, captureSponsorPayment } from "@/api/axios.js";
import { processLeaderboardData, isCurrentUserSponsor } from "@/utils/sponsorUtils.js";
import SearchableDepartmentSelect from "@/components/common/SearchableDepartmentSelect.jsx";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function SupportDev() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRealUser = Boolean(user && !user?.isGuest);

  const handleLoginToDonate = async () => {
    if (user?.isGuest) {
      try {
        await logout();
      } catch (e) {
        // ignore
      }
    }
    navigate("/login", { state: { from: "/support-dev" } });
  };

  const [loading, setLoading] = useState(true);
  const [leaderboardTab, setLeaderboardTab] = useState("individual"); // "individual" | "departments"
  const [leaderboard, setLeaderboard] = useState({
    total_raised: 0,
    total_supporters: 0,
    sponsors: [],
    department_leaderboard: [],
  });

  // User Contribution State
  const [userContribution, setUserContribution] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");

  const [hasUserName, setHasUserName] = useState(false);
  const [hasUserEmail, setHasUserEmail] = useState(false);
  const [hasUserPhone, setHasUserPhone] = useState(false);

  // Preference Options (Anonymous & Target Department)
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [targetDeptId, setTargetDeptId] = useState("");

  // Editable Amount State (User types custom amount)
  const [amount, setAmount] = useState("");

  // Payment Status State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchContributionStatus = async (pVal, eVal) => {
    const p = pVal || donorPhone;
    const e = eVal || donorEmail || user?.email;
    if (!p && !e) return;
    try {
      const res = await checkUserContribution({ phone: p, email: e });
      if (res?.success) {
        setUserContribution(res);
      }
    } catch (err) {
      // ignore
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getSponsorsLeaderboard();
      if (data?.success && Array.isArray(data.sponsors)) {
        const sorted = processLeaderboardData(data.sponsors);
        setLeaderboard({
          ...data,
          total_supporters: sorted.length,
          sponsors: sorted,
          department_leaderboard: data.department_leaderboard || [],
        });
      }
    } catch (err) {
      setLeaderboard({ total_raised: 0, total_supporters: 0, sponsors: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Fetch Profile Details when Authenticated
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (auth.currentUser) {
          const meData = await getMeProfile();
          if (isMounted) {
            const displayNameFromMe =
              meData?.display_name ||
              meData?.displayName ||
              meData?.name ||
              meData?.full_name ||
              auth.currentUser.displayName ||
              "";
            const emailToUse = meData?.email || auth.currentUser.email || "";
            const phoneToUse = meData?.phone || meData?.phone_no || meData?.phoneNumber || "";

            if (displayNameFromMe) {
              setDonorName(displayNameFromMe);
              setHasUserName(true);
            } else {
              setHasUserName(false);
            }

            if (emailToUse) {
              setDonorEmail(emailToUse);
              setHasUserEmail(true);
            } else {
              setHasUserEmail(false);
            }

            if (phoneToUse) {
              setDonorPhone(phoneToUse);
              setHasUserPhone(true);
            } else {
              setHasUserPhone(false);
            }

            fetchContributionStatus(phoneToUse, emailToUse);
          }
        } else {
          if (isMounted) {
            setHasUserName(false);
            setHasUserEmail(false);
            setHasUserPhone(false);
          }
        }
      } catch (err) {
        if (isMounted && auth.currentUser) {
          if (auth.currentUser.displayName) {
            setDonorName(auth.currentUser.displayName);
            setHasUserName(true);
          } else {
            setHasUserName(false);
          }

          if (auth.currentUser.email) {
            setDonorEmail(auth.currentUser.email);
            setHasUserEmail(true);
          } else {
            setHasUserEmail(false);
          }

          setHasUserPhone(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Helper to auto-detect department ID from user email
  const detectDepartmentFromEmail = (email, depts) => {
    if (!email || !Array.isArray(depts) || depts.length === 0) return "";
    const emailLower = email.toLowerCase().trim();
    const atIdx = emailLower.indexOf("@");
    const username = atIdx !== -1 ? emailLower.slice(0, atIdx) : emailLower;
    const lastDot = username.lastIndexOf(".");
    const codeSegment = lastDot !== -1 ? username.slice(lastDot + 1) : username;

    const alphaMatch = codeSegment.match(/[a-z]+/i);
    const digitMatch = codeSegment.match(/\d+/);

    const emailCode = alphaMatch ? alphaMatch[0].toLowerCase() : "";
    const yearCode = digitMatch ? digitMatch[0] : "";

    if (!emailCode) return "";

    // Pass 1: Try matching email_code (or code) AND year_code (or year number)
    for (const dept of depts) {
      const dEmailCode = (dept.email_code || dept.code || "").toLowerCase();
      const dCode = (dept.code || "").toLowerCase();
      const dYearCode = (dept.year_code || "").toLowerCase();
      const dYear = (dept.year || "").toLowerCase();

      const codeMatches = (dEmailCode === emailCode || dCode === emailCode);

      if (codeMatches) {
        if (yearCode && dYearCode && yearCode === dYearCode) {
          return String(dept.id);
        }
        if (yearCode === "26" && (dYear.includes("1") || dYearCode === "26")) return String(dept.id);
        if (yearCode === "25" && (dYear.includes("2") || dYearCode === "25")) return String(dept.id);
        if ((yearCode === "24" || yearCode === "23") && (dYear.includes("3") || dYearCode === "24" || dYearCode === "23")) return String(dept.id);
        if (yearCode === "22" && (dYear.includes("4") || dYearCode === "22")) return String(dept.id);
      }
    }

    // Pass 2: Match email_code or code alone
    for (const dept of depts) {
      const dEmailCode = (dept.email_code || dept.code || "").toLowerCase();
      const dCode = (dept.code || "").toLowerCase();
      if (dEmailCode === emailCode || dCode === emailCode) {
        return String(dept.id);
      }
    }

    return "";
  };

  // Auto-detect and pre-select department when email or department leaderboard loads
  useEffect(() => {
    const depts = leaderboard.department_leaderboard || [];
    if (depts.length > 0) {
      const emailToTest = donorEmail || user?.email || auth.currentUser?.email || "";
      const detectedId = detectDepartmentFromEmail(emailToTest, depts);
      if (detectedId) {
        setTargetDeptId(detectedId);
      } else if (!targetDeptId && depts[0]?.id) {
        setTargetDeptId(String(depts[0].id));
      }
    }
  }, [donorEmail, user, leaderboard.department_leaderboard]);


  const effectiveAmount = Number(amount);

  const handlePayment = async (e) => {
    e?.preventDefault();
    setErrorMessage("");

    if (!effectiveAmount || effectiveAmount < 1) {
      setErrorMessage("Please enter a valid contribution amount greater than ₹0.");
      return;
    }

    if (!isAnonymous && !donorName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!donorPhone.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }

    setIsProcessing(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setErrorMessage("Razorpay SDK failed to load. Please check your network connection.");
      setIsProcessing(false);
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
    if (!key) {
      setErrorMessage("Razorpay Key ID is missing. Please add VITE_RAZORPAY_KEY_ID to client/.env");
      setIsProcessing(false);
      return;
    }

    const targetDept = (leaderboard.department_leaderboard || []).find((d) => String(d.id) === String(targetDeptId));
    const targetDeptCode = targetDept?.code || "";
    const actualName = donorName.trim() || user?.displayName || "Anonymous BITSian";

    let orderId = "";
    try {
      const orderRes = await createSponsorOrder({
        amount: effectiveAmount,
        name: actualName,
        email: donorEmail,
        phone: donorPhone,
        is_anonymous: isAnonymous,
        target_department_id: targetDeptId ? Number(targetDeptId) : 0,
        target_department_code: targetDeptCode,
      });
      if (orderRes?.success && orderRes?.order_id) {
        orderId = orderRes.order_id;
      }
    } catch (err) {
      // order API fallback
    }

    const options = {
      key: key,
      ...(orderId ? { order_id: orderId } : {}),
      amount: Math.round(effectiveAmount * 100), // amount in paise
      currency: "INR",
      name: "BIT CENTRAL",
      description: "Support BIT-CENTRAL Community Platform",
      prefill: {
        name: actualName,
        email: donorEmail,
        contact: donorPhone,
      },
      notes: {
        name: actualName,
        email: donorEmail,
        phone: donorPhone,
        contact: donorPhone,
        is_anonymous: isAnonymous ? "true" : "false",
        target_department_id: targetDeptId ? String(targetDeptId) : "",
        target_department_code: targetDeptCode,
      },
      config: {
        display: {
          blocks: {
            upi_qr: {
              name: "Pay via UPI / QR Code",
              instruments: [
                {
                  method: "upi",
                  flows: ["qr", "intent", "collect"],
                },
              ],
            },
          },
          sequence: ["block.upi_qr"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      theme: {
        color: "#2563eb",
      },
      handler: async function (response) {
        if (response?.razorpay_payment_id) {
          try {
            await captureSponsorPayment({
              payment_id: response.razorpay_payment_id,
              amount: effectiveAmount,
            });
          } catch (err) {
            // ignore
          }
        }
        setIsProcessing(false);
        setIsModalOpen(false);
        setPaymentSuccess(true);
        fetchLeaderboard();

        let certId = response?.razorpay_payment_id || "BIT-PATRON-VERIFIED";
        try {
          const res = await checkUserContribution({ phone: donorPhone, email: donorEmail });
          if (res?.success && res?.certificate_id) {
            certId = res.certificate_id;
          }
        } catch (err) {
          // ignore
        }

        navigate(`/payment-successful/${encodeURIComponent(certId)}`);
      },


      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };



    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrorMessage("Failed to open Razorpay payment window.");
      setIsProcessing(false);
    }
  };

  const formattedTotal = Number(leaderboard.total_raised || 0).toLocaleString("en-IN");
  return (
    <div className="w-full min-h-screen py-6 lg:py-10 bg-slate-50/60 text-slate-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full grid gap-6 lg:grid-cols-12 lg:items-start">

          {/* Left Column: Hero & Clean CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 space-y-4"
          >
            {/* Back to Home Button */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 shadow-2xs cursor-pointer w-fit"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </button>

            {/* Main Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center flex-wrap gap-2">
                <span>Keep BIT-CENTRAL</span>{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Running
                </span>
                <FaHandHoldingHeart className="h-7 w-7 text-blue-600 dark:text-blue-400 inline-block shrink-0 ml-1" />
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                BIT-CENTRAL provides free question banks, answer keys, exam hall finders, and mess schedules for the BIT Sathy community. Help us keep it running.
              </p>
            </div>

            {/* 3 Feature Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
                <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 w-fit">
                  <Server className="h-4 w-4" />
                </div>
                <h3 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Cloud Server</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">High speed delivery</p>
              </div>

              <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
                <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 w-fit">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">100% Ad-Free</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Clean student UX</p>
              </div>

              <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
                <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 w-fit">
                  <Code2 className="h-4 w-4" />
                </div>
                <h3 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Active R&D</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">New campus tools</p>
              </div>
            </div>

            {/* 2 Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40">
                <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-300">
                  3,600+
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-blue-600/90 dark:text-blue-400/90">
                  Students Served
                </div>
              </div>

              <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40">
                <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-300">
                  ₹{formattedTotal}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-blue-600/90 dark:text-blue-400/90">
                  Raised by Community
                </div>
              </div>
            </div>

            {/* Main Action Button Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3.5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Heart className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400 fill-blue-600/20" />
                    Support Our Platform
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Your contributions fund server infrastructure and free tools for all students.
                  </p>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 shrink-0 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900">
                  <Sparkles className="h-3.5 w-3.5" /> Razorpay Secured
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                {isRealUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentSuccess(false);
                      setErrorMessage("");
                      setIsModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md hover:scale-102 active:scale-98 transition-all duration-150 flex items-center gap-2 cursor-pointer w-fit"
                  >
                    <Heart className="h-4 w-4 fill-white text-white" />
                    <span>Donate Now</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoginToDonate}
                      className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md hover:scale-102 active:scale-98 transition-all duration-150 flex items-center gap-2 cursor-pointer w-fit"
                    >
                      <LogIn className="h-4 w-4 text-white" />
                      <span>Log In to Donate</span>
                    </button>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Log in with @bitsathy.ac.in email
                    </span>
                  </div>
                )}

                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  Secure 256-bit SSL
                </p>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Disclaimer:</span> BIT-CENTRAL is an independent student-developed platform not officially affiliated with Bannari Amman Institute of Technology.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Top Donors Leaderboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-5 space-y-3"
          >
            {/* User Contribution Cards */}
            {userContribution?.found && (
              <div className="space-y-2">
                {/* 1. Public Named Contribution Card */}
                {userContribution.named_amount > 0 && userContribution.name !== "Anonymous BITSian" && (
                  <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3 shadow-2xs dark:border-emerald-900/60 dark:bg-emerald-950/40 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Heart className="h-4 w-4 fill-white text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block leading-none">
                            YOUR PUBLIC CONTRIBUTION
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                            {userContribution.name}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end">
                        <div className="text-sm font-black text-emerald-700 dark:text-emerald-300 leading-none">
                          ₹{Number(userContribution.named_amount || userContribution.amount || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="rounded bg-emerald-200/80 dark:bg-emerald-900 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:text-emerald-200">
                            Rank #{userContribution.rank}
                          </span>
                          <button
                            type="button"
                            onClick={() => navigate(`/payment-successful/${encodeURIComponent(userContribution.certificate_id || 'BIT-PATRON-VERIFIED')}`)}
                            className="inline-flex items-center gap-0.5 rounded bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
                          >
                            <span>Certificate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Anonymous Contribution Card */}
                {(userContribution.anonymous_amount > 0 || userContribution.name === "Anonymous BITSian") && (
                  <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/70 p-3 shadow-2xs dark:border-indigo-900/60 dark:bg-indigo-950/40 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <EyeOff className="h-4 w-4 fill-white text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block leading-none">
                            YOUR ANONYMOUS CONTRIBUTION
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                            Anonymous BITSian
                          </h4>
                          <span className="text-[9px] text-indigo-600/90 dark:text-indigo-300/90 font-medium block">
                            🔒 Hidden on Leaderboard • Counted for Dept
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end">
                        <div className="text-sm font-black text-indigo-700 dark:text-indigo-300 leading-none">
                          ₹{Number(userContribution.anonymous_amount || userContribution.amount || 0).toLocaleString("en-IN")}
                        </div>
                        <span className="mt-1 rounded bg-indigo-200/80 dark:bg-indigo-900 px-1.5 py-0.5 text-[10px] font-bold text-indigo-900 dark:text-indigo-200">
                          Verified Anonymous
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              {/* Leaderboard Header & Tabs */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setLeaderboardTab("individual")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leaderboardTab === "individual"
                        ? "bg-white text-blue-600 shadow-2xs dark:bg-slate-900 dark:text-blue-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Top Donors</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeaderboardTab("departments")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leaderboardTab === "departments"
                        ? "bg-white text-blue-600 shadow-2xs dark:bg-slate-900 dark:text-blue-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Departments</span>
                  </button>
                </div>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Top Rankings
                </span>
              </div>

              {/* List / Skeleton Loading / Empty State */}
              <div className="mt-2.5 space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin flex flex-col justify-start">
                {loading ? (
                  /* Skeleton Loading State */
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/40 animate-pulse"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-4 w-6 rounded bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                      <div className="h-3.5 w-10 rounded bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  ))
                ) : leaderboardTab === "individual" ? (
                  leaderboard.sponsors.length === 0 ? (
                    /* Empty State (No Donors Yet) */
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                      <div className="rounded-full bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        <Heart className="h-5 w-5 fill-current" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Be the first patron!
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-[200px] mx-auto">
                          Your support keeps student tools online.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Real Donors List */
                    leaderboard.sponsors.slice(0, 10).map((sponsor, idx) => {
                      const rank = idx + 1;
                      const isCurrentUser = isCurrentUserSponsor(
                        userContribution,
                        sponsor,
                        donorEmail || user?.email,
                        donorPhone
                      );

                      let rowStyle = "border border-slate-100 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-950";
                      let badgeStyle = "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded text-[10px]";

                      if (rank === 1) {
                        rowStyle = "border border-slate-300 bg-slate-100/80 dark:border-slate-700 dark:bg-slate-800/60 font-semibold";
                        badgeStyle = "bg-slate-900 text-white dark:bg-blue-600 dark:text-white font-extrabold px-1.5 py-0.5 rounded text-[10px]";
                      } else if (rank === 2) {
                        badgeStyle = "bg-slate-700 text-white font-bold px-1.5 py-0.5 rounded text-[10px]";
                      } else if (rank === 3) {
                        badgeStyle = "bg-slate-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]";
                      }

                      if (isCurrentUser) {
                        rowStyle = "border-2 border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40";
                      }

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between rounded-lg p-2 text-xs transition-all duration-150 ${rowStyle}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`inline-flex items-center justify-center shrink-0 ${badgeStyle}`}>
                              #{rank}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[130px]">
                                  {sponsor.name}
                                </span>
                                {isCurrentUser && (
                                  <span className="rounded bg-emerald-700 px-1 py-0.2 text-[8px] font-black text-white uppercase tracking-wider shrink-0">
                                    YOU
                                  </span>
                                )}
                              </div>
                              {sponsor.department_display && (
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                                  {sponsor.department_display}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              ₹{Number(sponsor.amount || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  /* Department Leaderboard List */
                  (leaderboard.department_leaderboard || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-1">
                      <GraduationCap className="h-5 w-5 text-slate-400" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        No Department Contributions Yet
                      </h4>
                    </div>
                  ) : (
                    (leaderboard.department_leaderboard || []).slice(0, 10).map((dept, idx) => {
                      const rank = idx + 1;
                      let badgeStyle = "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded text-[10px]";
                      let rowStyle = "border border-slate-100 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-950";

                      if (rank === 1) {
                        rowStyle = "border border-slate-300 bg-slate-100/80 dark:border-slate-700 dark:bg-slate-800/60 font-semibold";
                        badgeStyle = "bg-blue-600 text-white font-black px-1.5 py-0.5 rounded text-[10px]";
                      }

                      return (
                        <div
                          key={dept.id || idx}
                          className={`flex items-center justify-between rounded-lg p-2 text-xs transition-all duration-150 ${rowStyle}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`inline-flex items-center justify-center shrink-0 ${badgeStyle}`}>
                              #{rank}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 dark:text-white truncate block text-xs">
                                {dept.display_name}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                                {dept.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              ₹{Number(dept.total_amount || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Donation Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[420px] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100/70 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                    <Heart className="h-5 w-5 fill-rose-600 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                      Make a Contribution
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Support BIT-CENTRAL development & servers
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Amount Input Section */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    ENTER CONTRIBUTION AMOUNT (₹)
                  </label>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Direct via Razorpay
                  </span>
                </div>

                <div className="relative rounded-xl border border-blue-100 bg-blue-50/40 dark:border-blue-900/40 dark:bg-blue-950/20 px-3.5 py-2.5 flex items-center shadow-xs">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-base mr-2 select-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-base font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Donor Information Section - Only visible when NOT anonymous */}
              {!isAnonymous && (
                <div className="space-y-2 pt-1">
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                    DONOR DETAILS (FOR LEADERBOARD & RECEIPT)
                  </label>

                  <div className="space-y-2">
                    <div className="relative rounded-xl border border-slate-200/80 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/40 px-3.5 py-2.5 flex items-center focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-slate-900 transition-colors">
                      <User className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full text-xs font-medium text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
                      />
                    </div>

                    {/* Email Input - Only if not from user */}
                    {!hasUserEmail && (
                      <div className="relative rounded-xl border border-slate-200/80 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/40 px-3.5 py-2.5 flex items-center focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-slate-900 transition-colors">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Phone Input - Only if not from user */}
                    {!hasUserPhone && (
                      <div className="relative rounded-xl border border-slate-200/80 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/40 px-3.5 py-2.5 flex items-center focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-slate-900 transition-colors">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
                        <input
                          type="tel"
                          placeholder="Phone Number *"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Department Target Section */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                  CONTRIBUTE AS THIS DEPARTMENT
                </label>
                <SearchableDepartmentSelect
                  departments={leaderboard.department_leaderboard || []}
                  value={targetDeptId}
                  onChange={(val) => setTargetDeptId(val)}
                  placeholder="Type code, branch, or year (e.g. CSE, 3rd Year)..."
                />
              </div>

              {/* Anonymous Checkbox Option */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/60 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-800/20 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Donate Anonymously
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                      Hide your name on individual leaderboard. Your contribution still counts towards your selected department!
                    </span>
                  </div>
                </label>
              </div>


              {/* Error Alert */}
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  {errorMessage}
                </div>
              )}

              {/* Success Alert */}
              {paymentSuccess && (
                <div className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>
                    Thank you, <strong>{donorName}</strong>! Your payment was successful and leaderboard updated.
                  </span>
                </div>
              )}

              {/* Submit Payment Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Opening Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 fill-white text-white" />
                      <span>
                        {effectiveAmount > 0
                          ? `Donate ₹${effectiveAmount} now`
                          : "Donate now"}
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-3">
                  <Lock className="h-3 w-3 text-slate-400" />
                  Secure 256-bit SSL · UPI, GPay, PhonePe, Cards
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
