import { useEffect, useState } from "react";
import { api } from "../api.js";
import AssetTag from "../components/AssetTag.jsx";

const STEPS = ["Area", "Asset", "Describe"];

export default function ReportIssue({ onSubmitted }) {
  const [step, setStep] = useState(0);

  const [areaTree, setAreaTree] = useState([]);
  const [areaPath, setAreaPath] = useState([]); // drill-down selections
  const [selectedAreaId, setSelectedAreaId] = useState(null);

  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [descError, setDescError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    api.areaTree().then(setAreaTree).catch(() => setAreaTree([]));
  }, []);

  useEffect(() => {
    if (selectedAreaId) {
      api.assetsForArea(selectedAreaId).then(setAssets).catch(() => setAssets([]));
    }
  }, [selectedAreaId]);

  function currentLevelOptions() {
    let level = areaTree;
    for (const pick of areaPath) {
      const found = level.find((a) => a.id === pick);
      level = found ? found.children : [];
    }
    return level;
  }

  function pickArea(id) {
    const options = currentLevelOptions();
    const chosen = options.find((a) => a.id === Number(id));
    if (!chosen) return;
    const newPath = [...areaPath, chosen.id];
    setAreaPath(newPath);
    if (!chosen.children || chosen.children.length === 0) {
      setSelectedAreaId(chosen.id);
      setStep(1);
    }
  }

  function handleSubmit() {
    if (description.trim().length < 10) {
      setDescError("Please describe the problem in a bit more detail (at least 10 characters).");
      return;
    }
    setDescError("");
    setSubmitError("");
    setLoading(true);

    api
      .submitIssue({ asset: selectedAsset.id, description: description.trim() })
      .then(async (issue) => {
        if (photo) {
          const formData = new FormData();
          formData.append("image", photo);
          await api.uploadPhoto(issue.id, formData).catch(() => {});
        }
        if (video) {
          const formData = new FormData();
          formData.append("video", video);
          await api.uploadPhoto(issue.id, formData).catch(() => {});
        }
        onSubmitted(issue);
      })
      .catch(() => setSubmitError("Couldn't submit your report. Please try again."))
      .finally(() => setLoading(false));
  }

  const options = currentLevelOptions();

  return (
    <div className="screen">
      <div>
        <p className="eyebrow">New report</p>
        <h1 style={{ fontSize: 22, marginTop: 6 }}>{STEPS[step]}</h1>
      </div>

      <div className="stepper-dots" aria-hidden="true">
        {STEPS.map((_, i) => (
          <span key={i} className={i <= step ? "done" : ""} />
        ))}
      </div>

      {step === 0 && (
        <div className="field">
          <label>Select area</label>
          {options.length === 0 ? (
            <p className="hint">Loading areas…</p>
          ) : (
            <select value="" onChange={(e) => pickArea(e.target.value)}>
              <option value="" disabled>
                Choose {options[0]?.level?.toLowerCase() || "area"}…
              </option>
              {options.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          )}
          {areaPath.length > 0 && (
            <p className="hint">
              {areaPath.length} level{areaPath.length > 1 ? "s" : ""} selected — keep narrowing down to your ward.
            </p>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="field">
          <label>Select the asset with the problem</label>
          {assets.length === 0 ? (
            <p className="hint">No registered assets found in this area yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {assets.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="card"
                  style={{
                    alignItems: "flex-start",
                    textAlign: "left",
                    borderColor: selectedAsset?.id === a.id ? "var(--teal)" : undefined,
                  }}
                  onClick={() => {
                    setSelectedAsset(a);
                    setStep(2);
                  }}
                >
                  <AssetTag id={a.asset_id} />
                  <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{a.label}</span>
                </button>
              ))}
            </div>
          )}
          <button className="btn-text" onClick={() => setStep(0)}>
            ← Back to area
          </button>
        </div>
      )}

            {step === 2 && selectedAsset && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card-row">
            <AssetTag id={selectedAsset.asset_id} large />
          </div>

          <div className="field">
            <label htmlFor="description">What's wrong?</label>
            <textarea
              id="description"
              rows={4}
              placeholder="e.g. Light has been off for 3 nights"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descError && <p className="error-text">{descError}</p>}
          </div>

          <div className="field">
            <label htmlFor="photo">Add a photo (optional)</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </div>

          <div className="field">
            <label htmlFor="video">Add a video (optional)</label>
            <input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
            />
            <p className="hint" style={{ marginTop: 4 }}>Keep it short — large files may take longer to upload.</p>
          </div>

          {submitError && <p className="error-text">{submitError}</p>}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting…" : "Submit report"}
          </button>
          <button className="btn-text" onClick={() => setStep(1)}>
            ← Back to asset
          </button>
        </div>
      )}
    </div>
  );
}
