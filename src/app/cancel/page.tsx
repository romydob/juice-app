export default function CancelPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--color-green)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "var(--radius-md)",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", color: "var(--color-red)", marginBottom: "1rem" }}>
          ❌ Payment Cancelled
        </h1>
        <p style={{ marginBottom: "1.5rem", color: "var(--color-black)" }}>
          You can return to the entry form and try again.
        </p>
        <a
          href="/enter"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            backgroundColor: "var(--color-red)",
            color: "white",
            borderRadius: "var(--radius-md)",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}
        >
          Go Back
        </a>
      </div>
    </div>
  );
}
