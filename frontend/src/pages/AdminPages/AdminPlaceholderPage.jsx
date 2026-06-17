export default function AdminPlaceholderPage({ title, description }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 1.5rem", color: "#1e2937" }}>
        {title}
      </h1>

      <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: "1.5rem" }}>
        <p style={{ margin: 0, color: "#64748b" }}>
          {description}
        </p>
      </div>
    </div>
  );
}
