import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mail,
  Map,
  MessageSquare,
  Phone,
  ShieldCheck,
  Trophy,
  Utensils,
} from "lucide-react";

export const publicLinks = [
  { label: "About", href: "/about" },
  { label: "Developer", href: "/developer" },
  { label: "Support Dev ❤️", href: "/support-dev" },
  { label: "Features", href: "/features" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const developerProfile = {
  name: "Jaison David M",
  role: "Developer of BIT Central",
  description:
    "Jaison David M developed BIT Central as a student-focused web application for the Bannari Amman Institute of Technology community. BIT Central helps BIT Sathy students access academic resources, question banks, answer keys, mess menu information, reward points links, and campus service tools.",
  institution: "Bannari Amman Institute of Technology, Sathyamangalam",
  email: "developer@bitsathy.in",
  phone: "+91 98437 77817",
  sameAs: [
    "https://github.com/jaisondavid-m",
    "https://www.linkedin.com/in/jaison-david-m-a14072360/",
    "https://herostack.netlify.app/",
  ],
};

export const featureList = [
  {
    icon: BookOpen,
    title: "Academic Resources",
    summary:
      "Semester-wise question banks, answer keys, PDFs, and study materials for BIT Sathy students.",
  },
  {
    icon: Utensils,
    title: "Mess Menu",
    summary:
      "Daily hostel mess menu information that helps students plan meals before visiting the mess.",
  },
  {
    icon: Trophy,
    title: "Reward Points Access",
    summary:
      "Quick access to reward points information and student achievement tracking workflows.",
  },
  {
    icon: Map,
    title: "Campus Resources",
    summary:
      "Helpful campus tools such as FindMyWay, exam hall support, profile access, and student services.",
  },
  {
    icon: CalendarDays,
    title: "Student Services",
    summary:
      "Leave schedules, exam hall utilities, dashboards, and commonly used college service links.",
  },
  {
    icon: ShieldCheck,
    title: "Institution Email Login",
    summary:
      "Students sign in with their BIT Sathy institutional Google account for protected resources.",
  },
];

export const benefitList = [
  "Reduces the time students spend searching for scattered academic files and campus links.",
  "Makes common resources easier to find from mobile and desktop devices.",
  "Helps students discover question banks, answer keys, mess updates, and service tools from one portal.",
  "Keeps public information clear for students, parents, search engines, and AI answer engines.",
];

export const faqs = [
  {
    question: "What is BIT Central?",
    answer:
      "BIT Central is a student portal for Bannari Amman Institute of Technology, also known as BIT Sathy. It brings academic resources, question banks, answer keys, mess menu information, campus tools, and student service links into one web application.",
  },
  {
    question: "Who can use BIT Central?",
    answer:
      "BIT Central is designed for students of Bannari Amman Institute of Technology. Public pages can be viewed by anyone, while protected tools require a valid BIT Sathy institutional Google account.",
  },
  {
    question: "How do I log in?",
    answer:
      "Open the login page and sign in with your BIT Sathy Google account, typically an institutional email account connected to bitsathy.ac.in. After authentication, the portal opens the protected student dashboard and tools.",
  },
  {
    question: "What resources are available?",
    answer:
      "BIT Central includes academic resources such as question banks, answer keys, semester materials, exam hall utilities, reward points access, mess menu updates, leave schedule information, FindMyWay support, and campus service links.",
  },
  {
    question: "Is BIT Central official?",
    answer:
      "BIT Central is a student-focused portal for the BIT Sathy community. Users should treat institutional systems and college announcements as the final authority for official academic, administrative, and policy decisions.",
  },
  {
    question: "Who developed BIT Central?",
    answer:
      "BIT Central was developed by Jaison David M for the BIT Sathy student community. The project is built to help students of Bannari Amman Institute of Technology access academic resources, question banks, answer keys, mess menu information, reward points links, and campus service tools.",
  },
];

export const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "developer@bitsathy.in",
    href: "mailto:developer@bitsathy.in",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98437 77817",
    href: "tel:+919843777817",
  },
  {
    icon: MessageSquare,
    label: "Feedback Form",
    value: "Submit feedback or suggestions",
    href: "https://forms.gle/LSMMFVBHSPUvPKKK9",
    external: true,
  },
  {
    icon: GraduationCap,
    label: "Institution",
    value: "Bannari Amman Institute of Technology, Sathyamangalam",
    href: "https://www.bitsathy.ac.in/",
    external: true,
  },
];
