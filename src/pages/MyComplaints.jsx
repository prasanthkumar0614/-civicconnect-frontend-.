import { useEffect, useState } from "react";
import { api, mediaUrl } from "../api.js";
import AssetTag from "../components/AssetTag.jsx";
import { StatusBadge, PriorityDot } from "../components/Badges.jsx";

export function MyComplaints({ refreshKey, onOpen }) {
  const [issues, setIssues] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .myIssues()
      .then((data) => setIssues(data.results || data))
      .catch(() => setError("Couldn't load your reports right now."));
  }, [refreshKey]);

  return (
    <div className="screen">
      <div>
        <p className="eyebrow">My reports</p>
        <h1 style={{ fontSize: 22, marginTop: 6 }}>Track your complaints</h1>
      </div>

      {error && <p className="error-text">{error}</p>}

      {issues === null && !error && <p className="hint">Loading…</p>}

      {issues && issues.length === 0 && (
        <div className="empty-state">
          <h3>No reports yet</h3>
          <p>When you report a problem with a public asset, it'll show up here so you can track its status.</p>
        </div>
      )}

      {issues && issues.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {issues.map((issue) => (
            <button
              key={issue.id}
              className="card"
              style={{ textAlign: "left" }}
              onClick={() => onOpen(issue.id)}
            >
              <div className="card-row">
                <AssetTag id={issue.asset_display} />
                <StatusBadge status={issue.status} />
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "var(--ink)" }}>{issue.description}</p>
              {issue.ai_priority && <PriorityDot priority={issue.ai_priority} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ComplaintDetail({ issueId, onBack }) {
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.issueDetail(issueId).then(setIssue).catch(() => setError("Couldn't load this report."));
  }, [issueId]);

  if (error) {
    return (
      <div className="screen">
        <p className="error-text">{error}</p>
        <button className="btn-text" onClick={onBack}>← Back</button>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="screen">
        <p className="hint">Loading…</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <button className="btn-text" onClick={onBack}>← Back to my reports</button>

      <div className="card-row">
        <AssetTag id={issue.asset_display} large />
        <StatusBadge status={issue.status} />
      </div>

      {issue.ai_priority && <PriorityDot priority={issue.ai_priority} />}

      <div>
        <p className="eyebrow">Your report</p>
        <p style={{ marginTop: 6 }}>{issue.description}</p>
      </div>

      {issue.ai_summary && (
  <div className="card">
    <p className="eyebrow">Summary</p>
    <p style={{ margin: 0 }}>{issue.ai_summary}</p>
  </div>
)}

{(() => {
  const notesOnly = issue.status_history.filter(
    (h) => h.note && h.status !== "RESOLVED" && !h.note.startsWith("Assigned to officer")
  );
  const latest = notesOnly[notesOnly.length - 1];
  if (!latest) return null;
  return (
    <div className="card" style={{ borderColor: "var(--teal)" }}>
      <p className="eyebrow" style={{ color: "var(--teal)" }}>Update from the department</p>
      <p style={{ margin: 0 }}>{latest.note}</p>
      <p className="hint" style={{ marginTop: 6, marginBottom: 0 }}>
        {new Date(latest.changed_at).toLocaleString()}
      </p>
    </div>
  );
})()}

{issue.resolution_notes && (
        <div className="card" style={{ borderColor: "var(--green)" }}>
          <p className="eyebrow" style={{ color: "var(--green)" }}>Resolution</p>
          <p style={{ margin: 0 }}>{issue.resolution_notes}</p>
        </div>
      )}

{issue.photos && issue.photos.length > 0 && (
  <div>
    <p className="eyebrow">Photos & videos</p>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
      {issue.photos.map((p) =>
        p.video ? (
          <video
            key={p.id}
            src={mediaUrl(p.video)}
            controls
            style={{ width: 180, height: 120, borderRadius: 8, border: "1px solid var(--line)" }}
          />
        ) : (
          <a key={p.id} href={mediaUrl(p.image)} target="_blank" rel="noreferrer">
            <img
              src={mediaUrl(p.image)}
              alt="Reported issue"
              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" }}
            />
          </a>
        )
      )}
    </div>
  </div>
)}

      <div>
        <p className="eyebrow">Status history</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          {issue.status_history.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", marginTop: 5, flexShrink: 0 }} />
              <div>
                <StatusBadge status={h.status} />
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-soft)" }}>
                  {new Date(h.changed_at).toLocaleString()} {h.note && `— ${h.note}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
