// app/rules/page.tsx
"use client";

export default function Rules() {
  const rules = [
    {
      title: "Eligibility",
      items: [
        "Open to residents aged 16 and over.",
        "Contestants must enter by paying the entry fee and submitting their drink idea.",
        "One entry per person per round.",
      ],
    },
    {
      title: "Entry Fee",
      items: [
        "Entry fee is $20 per drink idea, non-refundable.",
        "Payment must be completed online (Stripe, Apple Pay, Google Pay, card) or in-store.",
      ],
    },
    {
      title: "Contest Rounds",
      items: [
        "Each round runs for 3 weeks.",
        "Up to 100 entries accepted per round.",
        "From all entries, Top 3 finalists will be selected by store judges.",
      ],
    },
    {
      title: "Voting System",
      items: [
        "Each purchase of a finalist drink = 1 vote for that drink.",
        "Combo purchase = 1 vote + 1 prediction.",
        "Votes are collected at point of sale and recorded in the contest database.",
      ],
    },
    {
      title: "Predictions",
      items: [
        "Only combo buyers may make a prediction.",
        "Predictions are recorded at the time of purchase.",
        "At the end of the round, customers who predicted correctly enter a grand prize draw.",
      ],
    },
    {
      title: "Prizes",
      items: [
        "Contestant prize: The finalist drink with the most votes wins the main prize (e.g., cash or store credit).",
        "Voter raffle: Every vote is a raffle entry. Three winners per round receive either 2 free drinks or free entry into the next contest.",
        "Prediction prize: Customers who guessed correctly are entered into a grand prize draw (e.g., 50% off drinks for a week).",
      ],
    },
    {
      title: "Announcement of Winners",
      items: [
        "Winners will be announced within 72 hours after each round ends.",
        "Winners will be contacted by email/phone.",
        "Unclaimed prizes may be forfeited after 14 days.",
      ],
    },
    {
      title: "Fair Play",
      items: [
        "The store reserves the right to disqualify entries or votes suspected of fraud, manipulation, or bulk self-purchasing.",
        "Staff entries are not eligible.",
      ],
    },
    {
      title: "Privacy",
      items: [
        "Personal details collected (name, email, phone) are only used to run the contest and notify winners.",
        "No personal details will be sold or shared.",
      ],
    },
    {
      title: "Legal",
      items: [
        "This is a trade promotion competition under NSW rules.",
        "No gambling is involved.",
        "Total prize value is under $10,000, so no permit is required.",
      ],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "var(--color-green)",
        color: "var(--color-white)",
        fontFamily: "var(--font-body)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem",
          marginBottom: "2rem",
        }}
      >
        Contest Rules
      </h1>

      <div style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
        {rules.map((rule, i) => (
          <div key={i} style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--color-yellow)" }}>
              {i + 1}. {rule.title}
            </h2>
            <ul style={{ paddingLeft: "1.5rem" }}>
              {rule.items.map((item, j) => (
                <li key={j} style={{ marginBottom: "0.25rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
