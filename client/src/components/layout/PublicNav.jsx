import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogIn, Menu, X } from "lucide-react";
import { publicLinks } from "@/content/publicContent.js";

export default function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="public-nav">
      <nav className="public-nav__inner" aria-label="Public navigation">
        <Link to="/" className="public-brand" aria-label="BIT Central public home" onClick={() => setIsOpen(false)}>
          <span className="public-brand__mark">
            <img src="/CardImgs/cropped_circle_image.png" alt="" width="34" height="34" />
          </span>
          <span>
            <strong>BIT Central</strong>
            <small>Student knowledge hub</small>
          </span>
        </Link>

        <button
          type="button"
          className="public-nav__toggle"
          aria-expanded={isOpen}
          aria-controls="public-navigation-links"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <div id="public-navigation-links" className={`public-nav__links${isOpen ? " is-open" : ""}`}>
          <div className="public-nav__items">
            {publicLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `public-nav__link${isActive ? " is-active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <Link
            to="/login"
            onClick={() => {
              localStorage.setItem("visitedLogin", "true");
              setIsOpen(false);
            }}
            className="public-button public-button--primary public-nav__login"
          >
            <LogIn aria-hidden="true" />
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
