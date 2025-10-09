"use client";

import Link from "next/link";

export default function HomePage() {
  const buttonStyleBase = {
    flex: 1, // same width for both buttons
    padding: "0.75rem 2rem",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontSize: "1.125rem",
    fontWeight: "normal",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none", // remove weird black outline
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-green)",
        color: "var(--color-background)",
        fontFamily: "var(--font-body)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "7rem 1rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "5rem",
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

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          justifyContent: "center",
          width: "100%",
          maxWidth: "400px", // optional: keeps buttons nicely centered
        }}
      >
        <Link href="/enter">
          <button
            style={{
              ...buttonStyleBase,
              backgroundColor: "var(--color-red)",
              color: "var(--color-white)",
              border: "2px solid var(--color-white)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#d24f4f")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-red)")
            }
          >
            enter ($20)
          </button>
        </Link>

        <Link href="/rules">
          <button
            style={{
              ...buttonStyleBase,
              backgroundColor: "var(--color-white)",
              color: "var(--color-red)",
              border: "2px solid var(--color-red)",
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
            rules
          </button>
        </Link>
      </div>
    </div>
  );
}
