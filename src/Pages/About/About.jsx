import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare } from "lucide-react";

export default function About() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: "📚",
      title: "Academic Resources",
      description: "Access semester-wise question banks, answer keys, and study materials curated specifically for BIT Sathy students."
    },
    {
      icon: "🍽️",
      title: "Mess Menu",
      description: "Real-time hostel mess menu with daily updates for both boys and girls hostels, showing current and upcoming meals."
    },
    {
      icon: "🎯",
      title: "RP Site Integration",
      description: "Direct access to the Reward Points system for tracking and managing your academic achievements."
    },
    {
      icon: "👤",
      title: "Smart Profile",
      description: "Automatic department and batch detection from your @bitsathy.ac.in email, with detailed account information."
    },
    {
      icon: "🔐",
      title: "Secure Authentication",
      description: "Firebase-powered Google authentication ensuring safe and seamless access to all resources."
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Fully optimized mobile and desktop experience with modern UI/UX design principles."
    }
  ];

  const team = {
    title: "Developed by a Student, for Students",
    description: "BIT-CENTRAL is a student-driven initiative designed to centralize and simplify access to essential academic resources and campus information."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"></div>
        
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
              About <span className="text-cyan-200">BIT-CENTRAL</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-blue-100 drop-shadow-md sm:text-xl">
              Your one-stop platform for academic resources, mess menus, and campus information at Bannari Amman Institute of Technology
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          {...fadeInUp}
          className="mb-16 overflow-hidden rounded-3xl bg-white p-8 shadow-2xl lg:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 100%)',
            border: '1px solid rgba(59,130,246,0.1)'
          }}
        >
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-blue-900 lg:text-4xl">Our Mission</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700">
              BIT-CENTRAL was created to streamline student life at BIT Sathy by providing instant access to academic materials, 
              daily mess menus, and important campus resources—all in one secure, user-friendly platform. We believe in making 
              information accessible, organized, and available anytime, anywhere.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-blue-900 lg:text-4xl">
            Platform Features
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.9) 100%)',
                  border: '1px solid rgba(59,130,246,0.15)'
                }}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-3xl shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-blue-900">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <motion.div
          {...fadeInUp}
          className="mb-16 overflow-hidden rounded-3xl bg-white p-8 shadow-2xl lg:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 100%)',
            border: '1px solid rgba(59,130,246,0.1)'
          }}
        >
          <h2 className="mb-12 text-center text-3xl font-bold text-blue-900 lg:text-4xl">
            How It Works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Sign In with Google",
                description: "Use your @bitsathy.ac.in email to authenticate securely via Google"
              },
              {
                step: "02",
                title: "Automatic Profile Setup",
                description: "Your department and batch are automatically detected from your email"
              },
              {
                step: "03",
                title: "Access All Resources",
                description: "Browse question banks, check mess menus, access RP site, and more"
              },
              {
                step: "04",
                title: "Stay Updated",
                description: "Get real-time information on mess menus and academic materials"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 rounded-2xl bg-gradient-to-r from-blue-50 to-transparent p-6 transition-all hover:shadow-lg"
              >
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-blue-900">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          {...fadeInUp}
          className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 p-8 shadow-2xl lg:p-12"
        >
          <div className="text-center text-white">
            <h2 className="mb-4 text-3xl font-bold drop-shadow-lg lg:text-4xl">
              {team.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-blue-100 drop-shadow-md">
              {team.description}
            </p>
          </div>
        </motion.div>

        {/* Credit / Author Section */}
        <motion.div
          {...fadeInUp}
          className="mt-6 rounded-xl bg-white p-4 text-center shadow-lg sm:p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(239,246,255,0.95))',
            border: '1px solid rgba(59,130,246,0.1)',
          }}
        >
          <h2 className="mb-2 text-xl font-bold text-blue-900 sm:text-2xl">About the Developer</h2>

          <p className="mb-4 text-sm text-gray-700 sm:text-base">
            Hi, I'm <span className="font-semibold text-blue-800">Jaison David M</span>, a 1st-year CSE student at{' '}
            <span className="font-semibold text-blue-800">Bannari Amman Institute of Technology</span>. I build web apps and freelance services.
          </p>

          <div className="mx-auto max-w-xs space-y-3">

            {/* GitHub */}
            <a
              href="https://github.com/jaisondavid-m"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-3 shadow transition-all hover:scale-105 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white sm:h-12 sm:w-12">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-600">GitHub</p>
                <p className="text-sm font-bold text-blue-800">@jaisondavid-m</p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/jaison-david-m-a14072360/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-3 shadow transition-all hover:scale-105 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white sm:h-12 sm:w-12">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-600">LinkedIn</p>
                <p className="text-sm font-bold text-blue-800">Jaison David M</p>
              </div>
            </a>

            {/* Freelance Website */}
            <a
              href="https://herostack.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-3 shadow transition-all hover:scale-105 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white sm:h-12 sm:w-12">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-600">Freelance Website</p>
                <p className="text-sm font-bold text-blue-800">HeroStack</p>
              </div>
            </a>

            <p className="pt-2 text-center text-xs text-gray-500">Developed & maintained by Jaison David M</p>
          </div>
        </motion.div>
        <motion.div
          {...fadeInUp}
          className="mt-10 overflow-hidden rounded-2xl bg-white p-5 text-center shadow-2xl
                    sm:mt-16 sm:rounded-3xl sm:p-8 lg:p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 100%)",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <h2 className="mb-3 text-2xl font-bold text-blue-900 sm:text-3xl lg:text-4xl">
            Questions or Feedback?
          </h2>

          <p className="mb-6 text-sm text-gray-700 sm:text-lg">I'm continuously improving BIT-CENTRAL. Your feedback truly matters.</p>

          <div id="contact" className="mx-auto max-w-md space-y-4 sm:space-y-5">
            
            {/* Email */}
            <a
              href="mailto:jaison7373@gmail.com"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r
                        from-blue-50 to-cyan-50 p-4 shadow-md transition-all
                        hover:scale-[1.02] hover:shadow-xl sm:gap-4 sm:p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full
                              bg-gradient-to-br from-blue-600 to-cyan-600 text-white
                              shadow-lg sm:h-14 sm:w-14">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <div className="text-left">
                <p className="text-xs font-semibold text-gray-600 sm:text-sm">
                  Email
                </p>
                <p className="text-sm font-bold text-blue-800 sm:text-base">
                  jaison7373@gmail.com
                </p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+919843777817"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r
                        from-blue-50 to-cyan-50 p-4 shadow-md transition-all
                        hover:scale-[1.02] hover:shadow-xl sm:gap-4 sm:p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full
                              bg-gradient-to-br from-blue-600 to-cyan-600 text-white
                              shadow-lg sm:h-14 sm:w-14">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <div className="text-left">
                <p className="text-xs font-semibold text-gray-600 sm:text-sm">
                  Phone
                </p>
                <p className="text-sm font-bold text-blue-800 sm:text-base">
                  +91 98437 77817
                </p>
              </div>
            </a>
            {/* Feedback Form */}
            <a
              href="https://forms.gle/LSMMFVBHSPUvPKKK9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r
                        from-blue-50 to-cyan-50 p-4 shadow-md transition-all
                        hover:scale-[1.02] hover:shadow-xl sm:gap-4 sm:p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full
                              bg-gradient-to-br from-blue-600 to-cyan-600 text-white
                              shadow-lg sm:h-14 sm:w-14">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <div className="text-left">
                <p className="text-xs font-semibold text-gray-600 sm:text-sm">
                  Feedback Form
                </p>
                <p className="text-sm font-bold text-blue-800 sm:text-base">
                  Submit your feedback
                </p>
              </div>
            </a>


            <p className="pt-3 text-center text-xs text-gray-600 sm:pt-4 sm:text-sm">
              Available for queries, suggestions, and bug reports
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}