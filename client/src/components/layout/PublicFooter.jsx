import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail } from "lucide-react";
import { developerProfile } from "@/content/publicContent.js";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__inner">
        <div className="public-footer__grid">
          {/* Brand Col */}
          <div className="public-footer__brand">
            <Link to="/" className="public-brand" aria-label="BIT Central home">
              <span className="public-brand__mark">
                <img src="/CardImgs/cropped_circle_image.png" alt="" width="34" height="34" />
              </span>
              <span>
                <strong>BIT Central</strong>
                <small>Student knowledge hub</small>
              </span>
            </Link>
            <p>
              Student portal for Bannari Amman Institute of Technology. Academic resources, question banks, answer keys, mess menu updates, and campus tools in one place.
            </p>
            <p className="public-footer__note">
              Developed by {developerProfile.name} for the BIT Sathy community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="public-footer__column">
            <h3>Student Knowledge</h3>
            <ul>
              <li>
                <Link to="/guides" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Campus Guides & Hub</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About Portal</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-blue-600 dark:hover:text-blue-400">Portal Features</Link>
              </li>
              <li>
                <Link to="/developer" className="hover:text-blue-600 dark:hover:text-blue-400">Developer Profile</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="public-footer__column">
            <h3>Trust & Policies</h3>
            <ul>
              <li>
                <Link to="/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400">Disclaimer & Notice</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact & Feedback</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Institutional Login</Link>
              </li>
            </ul>
          </div>

          {/* Institution Info */}
          <div className="public-footer__column public-footer__support">
            <h3>Institution & Support</h3>
            <a
              href="https://www.bitsathy.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="public-footer__external"
            >
              <GraduationCap className="h-4 w-4 text-blue-600" aria-hidden="true" />
              BIT Sathy College Website
            </a>
            <a
              href="mailto:developer@bitsathy.in"
              className="public-footer__external"
            >
              <Mail className="h-4 w-4 text-blue-600" aria-hidden="true" />
              developer@bitsathy.in
            </a>
            <p className="public-footer__note">
              Disclaimer: BIT Central is a student-focused web portal for Bannari Amman Institute of Technology students. Institutional announcements remain the official authority.
            </p>
          </div>
        </div>

        <div className="public-footer__bottom">
          <p>© {new Date().getFullYear()} BIT Central. All rights reserved. Built for Bannari Amman Institute of Technology community.</p>
        </div>
      </div>
    </footer>
  );
}
