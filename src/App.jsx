import { useState } from "react";
import { getToken, setToken } from "./api.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import { MyComplaints, ComplaintDetail } from "./pages/MyComplaints.jsx";

export default function App() {
  const [authed, setAuthed] = useState(!!getToken());
  const [authView, setAuthView] = useState("login"); // "login" | "register"

  const [tab, setTab] = useState("report"); // "report" | "mine"
  const [openIssueId, setOpenIssueId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [justSubmitted, setJustSubmitted] = useState(null);

  function handleLogout() {
    setToken(null);
    setAuthed(false);
  }

  if (!authed) {
    return (
      <>
        <TopBar />
        {authView === "login" ? (
          <Login onLoggedIn={() => setAuthed(true)} onGoRegister={() => setAuthView("register")} />
        ) : (
          <Register onRegistered={() => setAuthView("login")} onGoLogin={() => setAuthView("login")} />
        )}
      </>
    );
  }

  return (
    <>
      <TopBar onLogout={handleLogout} />

      {openIssueId ? (
        <ComplaintDetail issueId={openIssueId} onBack={() => setOpenIssueId(null)} />
      ) : justSubmitted ? (
        <SubmittedScreen
          issue={justSubmitted}
          onDone={() => {
            setJustSubmitted(null);
            setTab("mine");
            setRefreshKey((k) => k + 1);
          }}
        />
      ) : tab === "report" ? (
        <ReportIssue onSubmitted={setJustSubmitted} />
      ) : (
        <MyComplaints refreshKey={refreshKey} onOpen={setOpenIssueId} />
      )}

      {!openIssueId && !justSubmitted && (
        <nav className="bottom-nav">
          <button className={tab === "report" ? "active" : ""} onClick={() => setTab("report")}>
            <span className="dot" />
            Report
          </button>
          <button className={tab === "mine" ? "active" : ""} onClick={() => setTab("mine")}>
            <span className="dot" />
            My reports
          </button>
        </nav>
      )}
    </>
  );
}

function TopBar({ onLogout }) {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-mark">CC</span>
        CivicConnect
      </div>
      {onLogout && (
        <button className="btn-text" style={{ color: "#fff" }} onClick={onLogout}>
          Sign out
        </button>
      )}
    </div>
  );
}

function SubmittedScreen({ issue, onDone }) {
  return (
    <div className="screen" style={{ alignItems: "center", textAlign: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 40 }}>✓</div>
      <h1 style={{ fontSize: 22 }}>Report submitted</h1>
      <p>
        Your report on <strong>{issue.asset_display || issue.asset}</strong> has been logged and routed for
        review. You can track its status any time.
      </p>
      <button className="btn-primary" onClick={onDone}>
        View my reports
      </button>
    </div>
  );
}
