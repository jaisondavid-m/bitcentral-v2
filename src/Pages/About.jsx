import React from 'react';
import { Mail, Phone, MessageSquare, BookOpen, Utensils, Target, User, Github, Linkedin, Globe } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <BookOpen className="h-7 w-7" />,
      title: "Academic Resources",
      description: "Access semester-wise question banks, answer keys, and study materials."
    },
    {
      icon: <Utensils className="h-7 w-7" />,
      title: "Mess Menu",
      description: "Real-time hostel mess menu with daily updates for both hostels."
    },
    {
      icon: <Target className="h-7 w-7" />,
      title: "RP Site Integration",
      description: "Direct access to the Reward Points system for tracking achievements."
    },
    {
      icon: <User className="h-7 w-7" />,
      title: "Smart Profile",
      description: "Automatic department and batch detection from your college email."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-blue-600 sm:text-4xl">
              About BIT-CENTRAL
            </h1>
            <p className="mx-auto max-w-2xl text-base text-blue-700 sm:text-lg">
              Your one-stop platform for academic resources and campus information at Bannari Amman Institute of Technology
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-blue-600">Our Mission</h2>
          <p className="text-base leading-relaxed text-blue-700">
            BIT-CENTRAL streamlines student life at BIT Sathy by providing instant access to academic materials, 
            daily mess menus, and important campus resources—all in one secure, user-friendly platform.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-blue-600">Platform Features</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-blue-600">{feature.title}</h3>
                <p className="text-sm text-blue-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-blue-600">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Sign In with Google", description: "Use your @bitsathy.ac.in email to authenticate securely" },
              { step: "2", title: "Automatic Profile Setup", description: "Your department and batch are automatically detected" },
              { step: "3", title: "Access All Resources", description: "Browse question banks, check mess menus, and more" }
            ].map((item, index) => (
              <div key={index} className="flex gap-4 rounded-lg bg-gray-50 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-blue-600">{item.title}</h3>
                  <p className="text-sm text-blue-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-blue-600">About the Developer</h2>
          <p className="mb-6 text-blue-700">
            Hi, I'm <span className="font-semibold text-blue-800">Jaison David M</span>, a 1st-year CSE student at Bannari Amman Institute of Technology. I build web apps and freelance services.
          </p>

          <div className="space-y-3">
            <a href="https://github.com/jaisondavid-m" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white">
                <Github className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-600">GitHub</p>
                <p className="text-sm font-semibold text-blue-800">@jaisondavid-m</p>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/jaison-david-m-a14072360/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                <Linkedin className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-600">LinkedIn</p>
                <p className="text-sm font-semibold text-blue-800">Jaison David M</p>
              </div>
            </a>

            <a href="https://herostack.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
                <Globe className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-600">Freelance Website</p>
                <p className="text-sm font-semibold text-blue-800">HeroStack</p>
              </div>
            </a>
          </div>
        </div>

        <div id="contact" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-2 text-2xl font-bold text-blue-600">Get in Touch</h2>
          <p className="mb-6 text-blue-700">Have questions or feedback? Feel free to reach out.</p>

          <div className="space-y-3">
            <a href="mailto:jaison7373@gmail.com" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-600">Email</p>
                <p className="text-sm font-semibold text-blue-800">jaison7373@gmail.com</p>
              </div>
            </a>

            <a href="tel:+919843777817" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-600">Phone</p>
                <p className="text-sm font-semibold text-blue-800">+91 98437 77817</p>
              </div>
            </a>

            <a href="https://forms.gle/LSMMFVBHSPUvPKKK9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-600">Feedback Form</p>
                <p className="text-sm font-semibold text-blue-800">Submit your feedback</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}