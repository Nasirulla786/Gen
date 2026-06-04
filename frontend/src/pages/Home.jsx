import React, { useState } from "react";
import axios from "axios"
import { ServerURL } from "../App";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

const handleSubmit = async () => {
  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("resume", resume);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const res = await axios.post(
      `${ServerURL}/api/interview`,
      formData,
      {
        withCredentials: true,
      }
    );

    alert("Report create Successfully");
    navigate("/report/"+res.data.reportData._id);



  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  const clearAll = () => {
    setJobDescription("");
    setSelfDescription("");
    setResume(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');

        :root {
          --bg: #060608;
          --surface: #0e0e14;
          --surface2: #15151e;
          --border: rgba(255,255,255,0.07);
          --accent: #8b5cf6;
          --accent2: #a78bfa;
          --text: #f0eeff;
          --muted: #6b6b85;
          --muted2: #9090a8;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
        }

        .hl-root {
          display: flex;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .hl-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .hl-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
        }

        .hl-orb1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%);
          top: -200px; left: -100px;
          animation: drift1 14s ease-in-out infinite;
        }

        .hl-orb2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%);
          bottom: -150px; right: -80px;
          animation: drift2 18s ease-in-out infinite;
        }

        .hl-orb3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%);
          top: 50%; right: 10%;
          animation: drift1 22s ease-in-out infinite reverse;
        }

        @keyframes drift1 {
          0%,100% { transform: translate(0,0); }
          33% { transform: translate(40px,-30px); }
          66% { transform: translate(-20px,20px); }
        }

        @keyframes drift2 {
          0%,100% { transform: translate(0,0); }
          33% { transform: translate(-50px,20px); }
          66% { transform: translate(30px,-40px); }
        }

        .hl-sidebar {
          width: 300px;
          min-width: 300px;
          border-right: 1px solid var(--border);
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
          z-index: 10;
          background: rgba(6,6,8,0.7);
          backdrop-filter: blur(40px);
        }

        .hl-logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hl-logo-mark {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hl-logo-mark i { font-size: 18px; color: white; }

        .hl-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: var(--text);
        }

        .hl-logo-text span { color: var(--muted); font-weight: 400; }

        .hl-section-label {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 500;
          padding: 0 2px;
          margin-bottom: 4px;
        }

        .hl-nav-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .hl-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          color: var(--muted2);
          font-size: 14px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }

        .hl-nav-item:hover { background: var(--surface); color: var(--text); }

        .hl-nav-item.active {
          background: rgba(139,92,246,0.1);
          border-color: rgba(139,92,246,0.2);
          color: var(--accent2);
        }

        .hl-nav-badge {
          margin-left: auto;
          background: rgba(139,92,246,0.2);
          color: var(--accent2);
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 999px;
          font-weight: 600;
        }

        .hl-sidebar-footer {
          margin-top: auto;
          padding: 14px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
        }

        .hl-footer-label { font-size: 11px; color: var(--muted); margin-bottom: 8px; }

        .hl-progress-wrap {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .hl-progress-fill {
          height: 100%;
          width: 60%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 99px;
        }

        .hl-footer-meta {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--muted);
        }

        .hl-footer-meta strong { color: var(--muted2); }
        .hl-footer-upgrade { color: var(--accent2); cursor: pointer; }

        .hl-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          position: relative;
          z-index: 10;
          padding: 2.5rem 3rem;
          gap: 2rem;
        }

        .hl-top-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .hl-page-title {
          font-family: 'Syne', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          color: var(--text);
        }

        .hl-page-title .accent { color: var(--accent2); }

        .hl-page-sub {
          font-size: 14px;
          color: var(--muted);
          margin-top: 6px;
          line-height: 1.6;
          max-width: 480px;
        }

        .hl-pill-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 99px;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          font-size: 12px;
          color: #34d399;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .hl-pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #34d399;
          animation: pulse-green 2s ease-in-out infinite;
        }

        @keyframes pulse-green {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.7); }
        }

        .hl-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .hl-stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.1rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .hl-stat-card:hover { border-color: rgba(255,255,255,0.12); }

        .hl-stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent);
        }

        .hl-stat-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .hl-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.7rem;
          font-weight: 700;
          line-height: 1;
          color: var(--text);
        }

        .hl-stat-label { font-size: 12px; color: var(--muted); }

        .hl-stat-change {
          font-size: 11px;
          color: #34d399;
          display: flex;
          align-items: center;
          gap: 3px;
          margin-top: 4px;
        }

        .hl-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .hl-field-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.2rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.25s, box-shadow 0.25s;
        }

        .hl-field-card:focus-within {
          border-color: rgba(139,92,246,0.4);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.07), inset 0 0 30px rgba(139,92,246,0.03);
        }

        .hl-field-card.full { grid-column: 1 / -1; }

        .hl-field-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hl-field-icon {
          width: 28px; height: 28px;
          border-radius: 7px;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: var(--accent2);
          flex-shrink: 0;
        }

        .hl-field-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--muted2);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hl-field-count { margin-left: auto; font-size: 11px; color: var(--muted); }

        .hl-divider {
          height: 1px;
          background: var(--border);
        }

        .hl-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          line-height: 1.7;
          resize: none;
          caret-color: var(--accent2);
        }

        .hl-textarea::placeholder { color: #3d3d52; }

        .hl-upload-zone {
          border: 1.5px dashed rgba(139,92,246,0.2);
          border-radius: 12px;
          padding: 1.8rem;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.25s;
          background: rgba(139,92,246,0.02);
        }

        .hl-upload-zone:hover {
          border-color: rgba(139,92,246,0.45);
          background: rgba(139,92,246,0.05);
        }

        .hl-upload-zone.has-file {
          border-color: rgba(52,211,153,0.4);
          background: rgba(52,211,153,0.04);
        }

        .hl-upload-icon {
          width: 44px; height: 44px;
          border-radius: 11px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: var(--accent2);
          flex-shrink: 0;
          transition: all 0.25s;
        }

        .hl-upload-zone.has-file .hl-upload-icon {
          background: rgba(52,211,153,0.12);
          border-color: rgba(52,211,153,0.2);
          color: #34d399;
        }

        .hl-upload-title { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
        .hl-upload-sub { font-size: 12px; color: var(--muted); }

        .hl-format-row { display: flex; gap: 6px; margin-top: 6px; }

        .hl-format-tag {
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          color: var(--muted2);
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .hl-action-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .hl-btn-secondary {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--muted2);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }

        .hl-btn-secondary:hover { background: var(--surface2); color: var(--text); border-color: rgba(255,255,255,0.12); }

        .hl-btn-primary {
          flex: 3;
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6 50%, #6366f1);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.2px;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .hl-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(139,92,246,0.35); }
        .hl-btn-primary:active { transform: translateY(0); }
        .hl-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

        @keyframes spin { to { transform: rotate(360deg); } }

        .hl-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .hl-tips-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding-bottom: 1rem;
        }

        .hl-tip-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .hl-tip-icon { font-size: 16px; color: var(--accent2); margin-bottom: 2px; }
        .hl-tip-title { font-size: 12px; font-weight: 500; color: var(--text); }
        .hl-tip-body { font-size: 11.5px; color: var(--muted); line-height: 1.5; }

        @media (max-width: 900px) {
          .hl-sidebar { display: none; }
          .hl-main { padding: 1.5rem; }
          .hl-form-grid { grid-template-columns: 1fr; }
          .hl-stats-row { grid-template-columns: 1fr; }
          .hl-tips-row { grid-template-columns: 1fr; }
          .hl-page-title { font-size: 1.8rem; }
        }
      `}</style>

      <div className="hl-root">
        <div className="hl-noise" />
        <div className="hl-orb hl-orb1" />
        <div className="hl-orb hl-orb2" />
        <div className="hl-orb hl-orb3" />

        {/* Sidebar */}
        <div className="hl-sidebar">
          <div className="hl-logo-row">
            <div className="hl-logo-mark">
              <i className="ti ti-brain" />
            </div>
            <div className="hl-logo-text">Hire<span>Lens</span></div>
          </div>

          <div>
            <div className="hl-section-label">Menu</div>
            <div className="hl-nav-group">
              <div className="hl-nav-item active">
                <i className="ti ti-file-analytics" />
                Analyze
                <span className="hl-nav-badge">New</span>
              </div>
              <div className="hl-nav-item" onClick={()=>navigate("/get-all-reports")}>
                <i className="ti ti-history" />
                Past Reports
              </div>
              <div className="hl-nav-item">
                <i className="ti ti-chart-dots-3" />
                Insights
              </div>
            </div>
          </div>

          <div>
            <div className="hl-section-label">Tools</div>
            <div className="hl-nav-group">
              <div className="hl-nav-item">
                <i className="ti ti-writing" />
                Cover Letter AI
              </div>
              <div className="hl-nav-item">
                <i className="ti ti-school" />
                Mock Interview
              </div>
              <div className="hl-nav-item">
                <i className="ti ti-settings" />
                Settings
              </div>
            </div>
          </div>

          <div className="hl-sidebar-footer">
            <div className="hl-footer-label">Free Plan Usage</div>
            <div className="hl-progress-wrap">
              <div className="hl-progress-fill" />
            </div>
            <div className="hl-footer-meta">
              <span><strong>3/5</strong> reports used</span>
              <span className="hl-footer-upgrade">Upgrade</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="hl-main">
          {/* Top Bar */}
          <div className="hl-top-bar">
            <div>
              <div className="hl-page-title">
                Interview <span className="accent">Report</span><br />Generator
              </div>
              <div className="hl-page-sub">
                Paste your job description, describe yourself, and upload your resume. AI will do the rest.
              </div>
            </div>
            <div className="hl-pill-status">
              <div className="hl-pill-dot" />
              AI Ready
            </div>
          </div>

          {/* Stats Row */}
          <div className="hl-stats-row">
            <div className="hl-stat-card">
              <div className="hl-stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}>
                <i className="ti ti-file-check" />
              </div>
              <div className="hl-stat-num">248</div>
              <div className="hl-stat-label">Reports Generated</div>
              <div className="hl-stat-change"><i className="ti ti-trending-up" style={{ fontSize: 11 }} /> +12 this week</div>
            </div>
            <div className="hl-stat-card">
              <div className="hl-stat-icon" style={{ background: "rgba(245,158,11,0.1)", color: "#fbbf24" }}>
                <i className="ti ti-star" />
              </div>
              <div className="hl-stat-num">94%</div>
              <div className="hl-stat-label">Match Accuracy</div>
              <div className="hl-stat-change"><i className="ti ti-trending-up" style={{ fontSize: 11 }} /> +3% avg</div>
            </div>
            <div className="hl-stat-card">
              <div className="hl-stat-icon" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>
                <i className="ti ti-briefcase" />
              </div>
              <div className="hl-stat-num">83%</div>
              <div className="hl-stat-label">Interview Success Rate</div>
              <div className="hl-stat-change"><i className="ti ti-trending-up" style={{ fontSize: 11 }} /> Top 10%</div>
            </div>
          </div>

          {/* Form */}
          <div className="hl-form-grid">
            {/* Job Description */}
            <div className="hl-field-card">
              <div className="hl-field-header">
                <div className="hl-field-icon"><i className="ti ti-briefcase" /></div>
                <span className="hl-field-label">Job Description</span>
                <span className="hl-field-count">{jobDescription.length} / 2000</span>
              </div>
              <div className="hl-divider" />
              <textarea
                className="hl-textarea"
                rows={7}
                placeholder="Paste the full job description here — role, responsibilities, and required skills…"
                maxLength={2000}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Self Description */}
            <div className="hl-field-card">
              <div className="hl-field-header">
                <div className="hl-field-icon"><i className="ti ti-user" /></div>
                <span className="hl-field-label">About You</span>
                <span className="hl-field-count">{selfDescription.length} / 1000</span>
              </div>
              <div className="hl-divider" />
              <textarea
                className="hl-textarea"
                rows={7}
                placeholder="Tell us about your experience, skills, and what makes you a strong candidate…"
                maxLength={1000}
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Resume Upload */}
            <div className="hl-field-card full">
              <div className="hl-field-header">
                <div className="hl-field-icon"><i className="ti ti-upload" /></div>
                <span className="hl-field-label">Resume</span>
              </div>
              <div className="hl-divider" />
              <label className={`hl-upload-zone ${resume ? "has-file" : ""}`}>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div className="hl-upload-icon">
                  <i className={resume ? "ti ti-check" : "ti ti-cloud-upload"} />
                </div>
                <div>
                  <div className="hl-upload-title">
                    {resume ? resume.name : "Drop your resume here"}
                  </div>
                  <div className="hl-upload-sub">
                    {resume
                      ? `${(resume.size / 1024).toFixed(1)} KB — ready to upload`
                      : "or click to browse from your device"}
                  </div>
                  {!resume && (
                    <div className="hl-format-row">
                      <span className="hl-format-tag">PDF</span>
                      <span className="hl-format-tag">DOC</span>
                      <span className="hl-format-tag">DOCX</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hl-action-row">
            <button className="hl-btn-secondary" onClick={clearAll}>
              <i className="ti ti-refresh" /> Clear All
            </button>
            <button
              className="hl-btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="hl-spinner" />
                  Generating Report...
                </>
              ) : (
                <>
                  <i className="ti ti-sparkles" style={{ fontSize: 15 }} />
                  Generate Interview Report
                </>
              )}
            </button>
          </div>

          {/* Tips Row */}
          <div className="hl-tips-row">
            <div className="hl-tip-card">
              <div className="hl-tip-icon"><i className="ti ti-bulb" /></div>
              <div className="hl-tip-title">Be Specific</div>
              <div className="hl-tip-body">Include the full JD with tech stack, responsibilities, and must-have skills for best results.</div>
            </div>
            <div className="hl-tip-card">
              <div className="hl-tip-icon"><i className="ti ti-writing-sign" /></div>
              <div className="hl-tip-title">Your Story Matters</div>
              <div className="hl-tip-body">Mention your projects, wins, and years of experience. The AI uses this to tailor questions.</div>
            </div>
            <div className="hl-tip-card">
              <div className="hl-tip-icon"><i className="ti ti-file-text" /></div>
              <div className="hl-tip-title">Updated Resume</div>
              <div className="hl-tip-body">Upload a current resume so the AI can spot skill gaps and highlight your strengths accurately.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
