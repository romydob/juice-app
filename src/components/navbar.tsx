"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { name: "Hall of Fame", path: "/hall-of-fame" },
  { name: "My Entries", path: "/my-entries" },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header>
      {/* ===== Mobile Navbar ===== */}
      <div className="nav-mobile">
        <Link href="/edit-profile">
          <Image src="/profile.png" alt="Profile" width={35} height={35} />
        </Link>

        <Link href="/" className="logo">
          Zaaki
        </Link>

        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div className="nav-mobile-menu">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path} onClick={() => setMobileOpen(false)}>
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {/* ===== Desktop Navbar ===== */}
      <div className="nav-desktop">
        {/* Left: Title */}
        <Link href="/" className="logo">
          Zaaki by Kisswani
        </Link>

        {/* Center: Nav items */}
        <div className="nav-center">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path} className="nav-link">
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right: Profile */}
        <div className="nav-right">
          <Link href="/edit-profile">
            <Image src="/profile.png" alt="Profile" width={50} height={50} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
