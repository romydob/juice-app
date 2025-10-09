"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [greenHeight, setGreenHeight] = useState("65vh");
  const [buttonWidth, setButtonWidth] = useState("180px");

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 480) {
        setGreenHeight("35vh"); // shorter green section on small screens
        setButtonWidth("140px"); // smaller buttons
      } else {
        setGreenHeight("65vh"); // desktop green height
        setButtonWidth("180px"); // desktop buttons
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonStyleBase = {
    width: buttonWidth,
    padding: "0.75rem 2rem",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
    fontWeight: "normal",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Green Section */}
      <div
        style={{
          backgroundColor: "var(--color-green)",
          color: "var(--color-background)",
          fontFamily: "var(--font-body)",
          minHeight: greenHeight,
          padding: "5rem 1rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 8vw, 5rem)",
            fontWeight: "normal",
            lineHeight: "1.2",
            marginBottom: "2rem",
            letterSpacing: "0.5rem",
          }}
        >
          100 Enter <br />
          3 Finalists <br />
          1 Champion
        </h1>

        {/* Buttons container */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/enter">
            <button
              style={{
                ...buttonStyleBase,
                backgroundColor: "var(--color-red)",
                color: "var(--color-white)",
                border: "3px solid var(--color-white)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d24f4f")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--color-red)")}
            >
              enter - ($20)
            </button>
          </Link>

          <Link href="/rules">
            <button
              style={{
                ...buttonStyleBase,
                backgroundColor: "var(--color-white)",
                color: "var(--color-red)",
                border: "3px solid var(--color-red)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#d24f4f";
                e.currentTarget.style.color = "var(--color-white)";
                e.currentTarget.style.borderColor = "#d24f4f";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-white)";
                e.currentTarget.style.color = "var(--color-red)";
                e.currentTarget.style.borderColor = "var(--color-red)";
              }}
            >
              rules - t/c&apos;s
            </button>
          </Link>
        </div>
      </div>

      {/* Diagonal Section */}
      <div
        style={{
          position: "relative",
          backgroundColor: "var(--color-red)",
          height: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* White diagonal rectangle with red border */}
        <div
          style={{
            position: "absolute",
            width: "120%",
            height: "150px",
            backgroundColor: "var(--color-white)",
            border: "10px solid var(--color-red)",
            transform: "rotate(-7deg)",
          }}
        />

        {/* Leaderboard text */}
        <span
          style={{
            position: "absolute",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 8vw, 5rem)",
            color: "var(--color-green)",
            transform: "rotate(-7deg)",
            whiteSpace: "nowrap",
          }}
        >
          Leaderboard
        </span>
      </div>

      {/* Yellow Section */}
      <div
        style={{
          backgroundColor: "var(--color-yellow)",
          margin: "0 auto",
          padding: "5rem 1rem",
          fontFamily: "var(--font-body)",
          color: "var(--color-black)",
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "2rem" }}>Next Section Title</h2>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)", margin: "0 auto" }}>
            Content for the yellow section goes here. You can add text, images, or buttons.
          </p>
        </div>
      </div>
    </div>
  );
}
