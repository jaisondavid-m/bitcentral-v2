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
} from "lucide-react";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";
import { getSponsorsLeaderboard, getMeProfile, checkUserContribution, createSponsorOrder, captureSponsorPayment } from "../api/axios.js";
import { processLeaderboardData } from "../utils/sponsorUtils.js";

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
  const [user] = useAuthState(auth);

  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState({
    total_raised: 0,
    total_supporters: 0,
    sponsors: [],
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


  const effectiveAmount = Number(amount);

  const handlePayment = async (e) => {
    e?.preventDefault();
    setErrorMessage("");

    if (!effectiveAmount || effectiveAmount < 1) {
      setErrorMessage("Please enter a valid contribution amount greater than ₹0.");
      return;
    }

    if (!donorName.trim()) {
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

    let orderId = "";
    try {
      const orderRes = await createSponsorOrder({
        amount: effectiveAmount,
        name: donorName,
        email: donorEmail,
        phone: donorPhone,
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
        name: donorName,
        email: donorEmail,
        contact: donorPhone,
      },
      notes: {
        name: donorName,
        email: donorEmail,
        phone: donorPhone,
        contact: donorPhone,
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
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#f2f6ff] text-slate-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-12 lg:items-start">

          {/* Left Column: Hero & Clean CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Back to Home Button */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 shadow-xs cursor-pointer w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white flex items-center flex-wrap gap-2">
                <span>Keep BIT-CENTRAL</span>{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Running
                </span>
                <FaHandHoldingHeart className="h-8 w-8 text-rose-500 inline-block shrink-0 ml-1" />
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                BIT-CENTRAL provides free question banks, answer keys, exam hall finders, and mess schedules for the BIT Sathy community. Help us keep it running.
              </p>
            </div>

            {/* 3 Feature Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400 w-fit">
                  <Server className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Cloud Server</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">High speed delivery</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-400 dark:bg-blue-950 w-fit">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">100% Ad-Free</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Clean student UX</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-400 dark:bg-blue-950 w-fit">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Active R&D</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">New campus tools</p>
              </div>
            </div>

            {/* 2 Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-100/90 to-blue-50/80 p-5 border border-blue-200/60 dark:from-blue-950/60 dark:to-slate-900 dark:border-blue-900/60">
                <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
                  3,600+
                </div>
                <div className="mt-1 text-xs font-semibold text-blue-600/80 dark:text-blue-400/80">
                  Students Served
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-blue-100/90 to-blue-50/80 p-5 border border-blue-200/60 dark:from-blue-950/60 dark:to-slate-900 dark:border-blue-900/60">
                <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
                  ₹{formattedTotal}
                </div>
                <div className="mt-1 text-xs font-semibold text-blue-600/80 dark:text-blue-400/80">
                  Raised by Community
                </div>
              </div>
            </div>

            {/* Main Action Button Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                    Support Our Platform
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Your contributions fund server infrastructure and free tools for all students.
                  </p>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 shrink-0">
                  <Sparkles className="h-3.5 w-3.5" /> Razorpay Secured
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentSuccess(false);
                    setErrorMessage("");
                    setIsModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-600/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer w-fit"
                >
                  <Heart className="h-3.5 w-3.5 fill-white text-white" />
                  <span>Donate Now</span>
                </button>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                  Secure 256-bit SSL
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Top Donors Leaderboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* User Contribution Card (Visible even if not in Top 10) */}
            {userContribution?.found && (
              <div className="rounded-2xl border border-emerald-200/90 bg-[#dcfce7]/80 p-3.5 sm:p-4 shadow-xs dark:border-emerald-800/80 dark:bg-emerald-950/50 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#047857] dark:bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Heart className="h-5 w-5 fill-white text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#047857] dark:text-emerald-400 block leading-tight">
                        YOUR CONTRIBUTION
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {userContribution.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <div className="text-base sm:text-lg font-black text-[#047857] dark:text-emerald-300 leading-tight">
                      ₹{Number(userContribution.amount || 0).toLocaleString("en-IN")}
                    </div>
                    <span className="inline-block mt-0.5 rounded-md bg-[#86efac] px-2 py-0.5 text-[11px] font-bold text-[#064e3b] dark:bg-emerald-800 dark:text-emerald-100">
                      Rank #{userContribution.rank} {userContribution.total_supporters ? `of ${userContribution.total_supporters}` : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/payment-successful/${encodeURIComponent(userContribution.certificate_id || 'BIT-PATRON-VERIFIED')}`)}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-[#047857] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#065f46] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300" />
                      <span>View Certificate</span>
                    </button>

                  </div>
                </div>
              </div>
            )}


            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Leaderboard Header */}
              <div className="flex items-center justify-between pb-3.5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Top Donors</span>
                </div>
                <span className="rounded-full bg-[#e0e7ff]/80 px-3 py-0.5 text-[11px] font-bold text-[#4318ff] dark:bg-blue-950 dark:text-blue-300 border border-blue-100/60 dark:border-blue-800/60">
                  Top 10 Supporters
                </span>
              </div>

              {/* List / Skeleton Loading / Empty State */}
              <div className="mt-2 space-y-2 max-h-[540px] min-h-[200px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-start">
                {loading ? (
                  /* Skeleton Loading State */
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-slate-100/70 p-3 dark:bg-slate-800/50 animate-pulse"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-8 rounded bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                      <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  ))
                ) : leaderboard.sponsors.length === 0 ? (
                  /* Empty State (No Donors Yet) */
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <div className="rounded-full bg-rose-50 p-3 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
                      <Heart className="h-6 w-6 fill-current animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                        <span>Be the first patron!</span>
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px] mx-auto">
                        Your support keeps open student infrastructure running.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Real Donors List */
                  leaderboard.sponsors.slice(0, 10).map((sponsor, idx) => {
                    const rank = idx + 1;
                    const isCurrentUser = Boolean(
                      userContribution?.found &&
                        userContribution?.rank === rank
                    );

                    let rowStyle = "border border-slate-100 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-950";
                    let badgeStyle = "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold px-2 py-0.5 rounded-lg text-xs";
                    let badgeContent = `#${rank}`;

                    if (rank === 1) {
                      rowStyle = "border border-amber-200/90 bg-amber-50/40 dark:border-amber-800/60 dark:from-amber-950/30 dark:to-slate-900";
                      badgeStyle = "bg-[#ff6b00] text-white font-black px-2 py-0.5 rounded-lg text-xs shadow-xs";
                      badgeContent = "#1";
                    } else if (rank === 2) {
                      rowStyle = "border border-slate-200/80 bg-slate-100/50 dark:border-slate-700/60 dark:bg-slate-800/40";
                      badgeStyle = "bg-[#64748b] text-white font-bold px-2 py-0.5 rounded-lg text-xs";
                      badgeContent = "#2";
                    } else if (rank === 3) {
                      rowStyle = "border border-orange-200/80 bg-orange-50/30 dark:border-amber-900/50 dark:bg-orange-950/20";
                      badgeStyle = "bg-[#ea580c] text-white font-bold px-2 py-0.5 rounded-lg text-xs";
                      badgeContent = "#3";
                    }

                    if (isCurrentUser) {
                      rowStyle = "border-2 border-[#10b981] bg-[#ecfdf5]/80 dark:bg-emerald-950/40 shadow-xs";
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition-all duration-200 ${rowStyle}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`inline-flex items-center justify-center shrink-0 ${badgeStyle}`}>
                            {badgeContent}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">
                            {sponsor.name}
                          </span>
                          {isCurrentUser && (
                            <span className="rounded bg-[#047857] px-1.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider shrink-0">
                              YOU
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-extrabold text-[#047857] dark:text-emerald-400 text-sm">
                            ₹{Number(sponsor.amount || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })
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

              {/* Donor Information Section */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block">
                  DONOR DETAILS (FOR LEADERBOARD & RECEIPT)
                </label>

                <div className="space-y-2">
                  {/* Name Input - Always editable */}
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
