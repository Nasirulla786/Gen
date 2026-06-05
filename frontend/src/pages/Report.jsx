import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ServerURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setInterviewReport } from "../redux/Slices/interviewSlice";
// import { ArrowLeft } from '@lucide/vue';
import { MoveLeft } from 'lucide-react';

/* ─── Helpers ─── */
const parseResume = (raw = "") => {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const name = lines[0] || "Candidate";
  const tagline = lines[1] || "";
  const email = lines.find((l) => l.includes("@")) || "";
  const phone = lines.find((l) => /\+?\d[\d\s\-]{8,}/.test(l)) || "";
  const sectionHeaders = ["EDUCATION","SKILLS","EXPERIENCE","PROJECTS","COURSEWORK","CODING PROFILES","RESPONSIBILITY","LIBRARIES","DEV TOOLS","CLOUD PLATFORMS","OPERATING SYSTEMS","PROGRAMMING LANGUAGES","FRONTEND","BACKEND","DATABASE"];
  const sectionMap = {};
  let current = null;
  lines.forEach((line) => {
    const up = line.toUpperCase();
    if (sectionHeaders.includes(up)) { current = up; sectionMap[current] = []; }
    else if (current) sectionMap[current].push(line);
  });
  const skills = [...(sectionMap["PROGRAMMING LANGUAGES"]||[]),...(sectionMap["FRONTEND"]||[]),...(sectionMap["BACKEND"]||[]),...(sectionMap["DATABASE"]||[])].map((s)=>s.replace(/^[•\-]\s*/,"").trim()).filter(Boolean);
  return { name, tagline, email, phone, skills };
};

const scoreColor = (score) => {
  if (score >= 85) return { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", label: "Excellent Match" };
  if (score >= 65) return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Good Match" };
  return { color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.25)", label: "Needs Work" };
};

/* ─── Score Ring ─── */
const ScoreRing = ({ score }) => {
  const { color, label } = scoreColor(score);
  const r = 52, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  return (
    <div style={{ position:"relative", width:130, height:130, flexShrink:0 }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9"/>
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition:"stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)" }}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800,color,lineHeight:1 }}>{score}</span>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:"0.75rem",fontWeight:600,color,marginTop:1 }}>%</span>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:"9px",color:"#5a5a78",marginTop:3,textAlign:"center",letterSpacing:"0.5px" }}>{label}</span>
      </div>
    </div>
  );
};

/* ─── Accordion Item ─── */
const AccordionItem = ({ index, question, intention, answer, type }) => {
  const [open, setOpen] = useState(false);
  const colors = { technical: { accent:"#8b5cf6", bg:"rgba(139,92,246,0.08)", border:"rgba(139,92,246,0.2)", badge:"rgba(139,92,246,0.15)", badgeText:"#c4b5fd" }, behavioral: { accent:"#06b6d4", bg:"rgba(6,182,212,0.06)", border:"rgba(6,182,212,0.18)", badge:"rgba(6,182,212,0.12)", badgeText:"#67e8f9" } };
  const c = colors[type] || colors.technical;
  return (
    <div style={{ border:`1px solid ${open ? c.border : "rgba(255,255,255,0.07)"}`, borderRadius:14, background: open ? c.bg : "#0d0d12", transition:"all 0.25s", overflow:"hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", background:"none", border:"none", padding:"1rem 1.2rem", display:"flex", alignItems:"center", gap:12, cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color: c.accent, background: c.badge, padding:"3px 9px", borderRadius:6, flexShrink:0 }}>Q{index + 1}</span>
        <span style={{ flex:1, fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:600, color:"#ede9ff", lineHeight:1.5 }}>{question}</span>
        <span style={{ color:"#5a5a78", fontSize:18, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.25s", flexShrink:0 }}>⌃</span>
      </button>
      {open && (
        <div style={{ padding:"0 1.2rem 1.2rem", display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ height:1, background:"rgba(255,255,255,0.06)" }} />
          <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 14px" }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, color:"#5a5a78", letterSpacing:"1.5px", marginBottom:5, textTransform:"uppercase" }}>Intention</p>
            <p style={{ fontSize:13, color:"#8888a8", lineHeight:1.7 }}>{intention}</p>
          </div>
          <div style={{ background: c.bg, border:`1px solid ${c.border}`, borderRadius:10, padding:"10px 14px" }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, color: c.accent, letterSpacing:"1.5px", marginBottom:5, textTransform:"uppercase" }}>Expected Answer</p>
            <p style={{ fontSize:13, color:"#c4b5fd", lineHeight:1.7 }}>{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Prep Day Card ─── */
const PrepDayCard = ({ day, focus, tasks }) => {
  const [open, setOpen] = useState(day === 1);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, background:"#0d0d12", overflow:"hidden", transition:"border-color 0.2s" }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%",background:"none",border:"none",padding:"0.9rem 1.1rem",display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
        <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:"#f0eeff",background:"rgba(139,92,246,0.15)",border:"1px solid rgba(139,92,246,0.25)",padding:"2px 9px",borderRadius:6,flexShrink:0 }}>Day {day}</span>
        <span style={{ flex:1,fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,color:"#ede9ff",textAlign:"left" }}>{focus}</span>
        <span style={{ fontSize:12,color:"#5a5a78",flexShrink:0 }}>{tasks?.length || 0} tasks</span>
        <span style={{ color:"#5a5a78",fontSize:16,transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s",flexShrink:0 }}>⌃</span>
      </button>
      {open && tasks?.length > 0 && (
        <div style={{ padding:"0 1.1rem 1rem",display:"flex",flexDirection:"column",gap:6 }}>
          <div style={{ height:1,background:"rgba(255,255,255,0.05)",marginBottom:4 }} />
          {tasks.map((task, i) => (
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8 }}>
              <span style={{ color:"#8b5cf6",fontSize:14,marginTop:2,flexShrink:0 }}>◆</span>
              <span style={{ fontSize:13,color:"#8888a8",lineHeight:1.6 }}>{typeof task === "string" ? task : task.task || JSON.stringify(task)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Tab Button ─── */
const Tab = ({ active, onClick, children, count }) => (
  <button onClick={onClick} style={{
    fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13,
    padding:"8px 18px", borderRadius:10, border:"none", cursor:"pointer",
    background: active ? "rgba(139,92,246,0.15)" : "transparent",
    color: active ? "#c4b5fd" : "#5a5a78",
    borderBottom: active ? "2px solid #8b5cf6" : "2px solid transparent",
    transition:"all 0.2s", display:"flex", alignItems:"center", gap:7,
  }}>
    {children}
    {count !== undefined && (
      <span style={{ background:"rgba(255,255,255,0.07)", fontSize:10, padding:"1px 6px", borderRadius:4, color:"#5a5a78" }}>{count}</span>
    )}
  </button>
);

/* ─── Section Card ─── */
const Card = ({ children, accent }) => (
  <div style={{
    background: accent ? "rgba(139,92,246,0.04)" : "#0d0d12",
    border: `1px solid ${accent ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.07)"}`,
    borderRadius:18, padding:"1.4rem 1.6rem",
    display:"flex", flexDirection:"column", gap:"1rem",
  }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title, sub }) => (
  <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
    <div style={{ width:30,height:30,flexShrink:0,borderRadius:8,background:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"#a78bfa" }}>{icon}</div>
    <div>
      <div style={{ fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:"#ede9ff" }}>{title}</div>
      {sub && <div style={{ fontFamily:"'Syne',sans-serif",fontSize:11,color:"#5a5a78",marginTop:2 }}>{sub}</div>}
    </div>
  </div>
);

/* ─── Main Component ─── */
const Report = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { interviewReport } = useSelector((state) => state.interview);
  const [activeTab, setActiveTab] = useState("technical");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${ServerURL}/api/interview/report/${params.id}`, { withCredentials: true });
        dispatch(setInterviewReport(res.data.report));
      } catch (error) { console.log(error); }
    };
    fetchReport();
  }, []);

  // console.log("this iis",interviewReport);

  if (!interviewReport) return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#060608",color:"#5a5a78",fontFamily:"sans-serif",gap:16 }}>
      <div style={{ width:40,height:40,border:"3px solid rgba(139,92,246,0.2)",borderTopColor:"#8b5cf6",borderRadius:"50%",animation:"rp-spin 0.8s linear infinite" }} />
      <p>Loading your report…</p>
      <style>{`@keyframes rp-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const {
    matchScore = 0, jobDescription = "", selfDescription = "", resume = "",
    technicalQuestion = [], behaviorQuestion = [], preparationPlan = [], createdAt, _id
  } = interviewReport;

  const resumeData = parseResume(resume);
  const scoreInfo = scoreColor(matchScore);
  const date = createdAt ? new Date(createdAt).toLocaleDateString("en-IN", { day:"numeric",month:"long",year:"numeric" }) : "";

  const jdSkillsRaw = ["JavaScript","React.js","Node.js","Express.js","MongoDB","SQL","Git","GitHub","REST API"];
  const matched = jdSkillsRaw.filter((sk) => resumeData.skills.some((rs) => rs.toLowerCase().includes(sk.toLowerCase().replace(".js","").replace(".",""))) );
  const missing = jdSkillsRaw.filter((sk) => !matched.includes(sk));
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:#060608;font-family:'Lora',serif;}
        .rp-orb{position:fixed;border-radius:50%;pointer-events:none;}
        .rp-orb1{width:700px;height:700px;background:radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 65%);top:-200px;left:-150px;animation:drift1 16s ease-in-out infinite;}
        .rp-orb2{width:500px;height:500px;background:radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 65%);bottom:-100px;right:-80px;animation:drift2 20s ease-in-out infinite;}
        @keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(50px,-40px)}}
        @keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,30px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rp-spin{to{transform:rotate(360deg)}}
        .fade-up{animation:fadeUp 0.55s ease both;}
        .rp-tag{font-family:'Syne',sans-serif;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;letter-spacing:0.3px;}
        .rp-tag-default{background:rgba(255,255,255,0.05);color:#8888a8;border:1px solid rgba(255,255,255,0.07);}
        .rp-tag-success{background:rgba(16,185,129,0.1);color:#34d399;border:1px solid rgba(16,185,129,0.2);}
        .rp-tag-warn{background:rgba(245,158,11,0.1);color:#fbbf24;border:1px solid rgba(245,158,11,0.2);}
        @media(max-width:768px){
          .rp-hero{flex-direction:column!important;}
          .rp-grid-2{grid-template-columns:1fr!important;}
          .rp-grid-3{grid-template-columns:1fr!important;}
          .rp-header-right{display:none!important;}
          .rp-main-pad{padding:1.2rem 0.9rem 3rem!important;}
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#060608", color:"#ede9ff", position:"relative", overflowX:"hidden" }}>
        <div className="rp-orb rp-orb1" style={{ zIndex:0 }} />
        <div className="rp-orb rp-orb2" style={{ zIndex:0 }} />

        {/* ── Header ── */}
        <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 2.5rem",borderBottom:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(30px)",background:"rgba(6,6,8,0.85)",position:"sticky",top:0,zIndex:100 }}>
          <div style={{ display:"flex",alignItems:"center",gap:20 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>

                <span onClick={()=>navigate("/")}>  <MoveLeft /></span>
              <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#7c3aed,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,color:"white" }}>HL</div>
              <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#ede9ff" }}>Hire<span style={{ color:"#5a5a78",fontWeight:400 }}>Lens</span></span>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:999,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.2)",color:"#a78bfa" }}>Interview Report</span>
              {date && <span style={{ fontFamily:"'Syne',sans-serif",fontSize:12,color:"#5a5a78" }}>{date}</span>}
            </div>
          </div>
          <div className="rp-header-right" style={{ display:"flex",gap:10 }}>
            <button onClick={() => window.print()} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:"#8888a8",fontFamily:"'Syne',sans-serif",fontSize:13,cursor:"pointer" }}>
              <i className="ti ti-printer" /> Print
            </button>
            <button style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#7c3aed,#6366f1)",color:"white",fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer" }}>
              <i className="ti ti-download" /> Download PDF
            </button>
          </div>
        </header>

        <main className="rp-main-pad" style={{ maxWidth:1080,margin:"0 auto",padding:"2rem 2rem 4rem",display:"flex",flexDirection:"column",gap:"1.5rem",position:"relative",zIndex:10 }}>

          {/* ── Hero ── */}
          <section className="rp-hero fade-up" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:"2rem",flexWrap:"wrap" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"1.5rem" }}>
              <div style={{ width:70,height:70,borderRadius:18,background:"linear-gradient(135deg,#7c3aed,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"white",flexShrink:0 }}>
                {resumeData.name.charAt(0)}
              </div>
              <div>
                <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800,letterSpacing:"-0.5px",color:"#ede9ff" }}>{resumeData.name}</h1>
                <p style={{ color:"#8888a8",fontSize:13,marginTop:3,fontStyle:"italic" }}>{resumeData.tagline}</p>
                <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginTop:10 }}>
                  {resumeData.email && <span style={{ display:"flex",alignItems:"center",gap:5,fontFamily:"'Syne',sans-serif",fontSize:12,color:"#8888a8",background:"#0d0d12",border:"1px solid rgba(255,255,255,0.07)",padding:"4px 10px",borderRadius:999 }}><i className="ti ti-mail" /> {resumeData.email}</span>}
                  {resumeData.phone && <span style={{ display:"flex",alignItems:"center",gap:5,fontFamily:"'Syne',sans-serif",fontSize:12,color:"#8888a8",background:"#0d0d12",border:"1px solid rgba(255,255,255,0.07)",padding:"4px 10px",borderRadius:999 }}><i className="ti ti-phone" /> {resumeData.phone}</span>}
                </div>
              </div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
              <ScoreRing score={matchScore} />
              <span style={{ fontFamily:"'Syne',sans-serif",fontSize:10,color:"#5a5a78",letterSpacing:"1px",textTransform:"uppercase" }}>Match Score</span>
            </div>
          </section>

          {/* ── Banner ── */}
          <div className="fade-up" style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"13px 18px",borderRadius:14,border:`1px solid ${scoreInfo.border}`,background:scoreInfo.bg,fontFamily:"'Syne',sans-serif",fontSize:14,lineHeight:1.6 }}>
            <i className="ti ti-sparkles" style={{ color:scoreInfo.color,fontSize:20,marginTop:2,flexShrink:0 }} />
            <p style={{ color:scoreInfo.color }}>
              <strong>{resumeData.name.split(" ")[0]}</strong> is a {scoreInfo.label.toLowerCase()} for the <strong>Junior Full Stack Developer</strong> role with a <strong>{matchScore}%</strong> compatibility score.
            </p>
          </div>

          {/* ── Stats Row ── */}
          <div className="rp-grid-3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
            {[
              { label:"Match Score", value:`${matchScore}%`, icon:"ti-target", color:"#8b5cf6" },
              { label:"Technical Qs", value:technicalQuestion.length, icon:"ti-code", color:"#06b6d4" },
              { label:"Prep Days", value:preparationPlan.length, icon:"ti-calendar", color:"#10b981" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} style={{ background:"#0d0d12",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"1rem 1.2rem",position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${color},transparent)` }} />
                <div style={{ width:28,height:28,borderRadius:7,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color,marginBottom:8 }}><i className={`ti ${icon}`} /></div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.6rem",fontWeight:800,color:"#ede9ff",lineHeight:1 }}>{value}</div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:12,color:"#5a5a78",marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Skills + About ── */}
          <div className="rp-grid-2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.2rem" }}>
            <Card>
              <SectionTitle icon={<i className="ti ti-circle-check" style={{ color:"#10b981" }} />} title="Skills Matched" sub={`${matched.length} of ${jdSkillsRaw.length} from JD`} />
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {matched.map((s) => <span key={s} className="rp-tag rp-tag-success">{s}</span>)}
              </div>
              {missing.length > 0 && <>
                <div style={{ height:1,background:"rgba(255,255,255,0.06)" }} />
                <SectionTitle icon={<i className="ti ti-alert-triangle" style={{ color:"#f59e0b" }} />} title="Skill Gaps" sub="Not found in resume" />
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {missing.map((s) => <span key={s} className="rp-tag rp-tag-warn">{s}</span>)}
                </div>
              </>}
            </Card>
            <Card>
              <SectionTitle icon={<i className="ti ti-user-circle" />} title="About the Candidate" />
              <p style={{ fontSize:14,color:"#8888a8",lineHeight:1.8 }}>{selfDescription}</p>
            </Card>
          </div>

          {/* ── Tech Stack ── */}
          <Card>
            <SectionTitle icon={<i className="ti ti-code" />} title="Full Tech Stack" sub="Extracted from resume" />
            <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
              {resumeData.skills.map((s) => <span key={s} className="rp-tag rp-tag-default" style={{ fontSize:12,padding:"5px 12px" }}>{s}</span>)}
            </div>
          </Card>

          {/* ── Questions Tabs ── */}
          <Card>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
              <SectionTitle icon={<i className="ti ti-messages" />} title="Interview Questions" sub="Click any question to expand" />
              <div style={{ display:"flex",gap:6,background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4,border:"1px solid rgba(255,255,255,0.07)" }}>
                <Tab active={activeTab==="technical"} onClick={() => setActiveTab("technical")} count={technicalQuestion.length}>Technical</Tab>
                <Tab active={activeTab==="behavioral"} onClick={() => setActiveTab("behavioral")} count={behaviorQuestion.length}>Behavioral</Tab>
              </div>
            </div>

            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {activeTab === "technical" && (
                technicalQuestion.length > 0
                  ? technicalQuestion.map((q, i) => <AccordionItem key={q._id || i} index={i} question={q.question} intention={q.intension} answer={q.answer} type="technical" />)
                  : <p style={{ fontSize:13,color:"#5a5a78",fontStyle:"italic" }}>No technical questions available.</p>
              )}
              {activeTab === "behavioral" && (
                behaviorQuestion.length > 0
                  ? behaviorQuestion.map((q, i) => <AccordionItem key={q._id || i} index={i} question={q.question} intention={q.intension} answer={q.answer} type="behavioral" />)
                  : <p style={{ fontSize:13,color:"#5a5a78",fontStyle:"italic" }}>No behavioral questions available.</p>
              )}
            </div>
          </Card>

          {/* ── Preparation Plan ── */}
          {preparationPlan.length > 0 && (
            <Card>
              <SectionTitle icon={<i className="ti ti-calendar-check" />} title="7-Day Preparation Plan" sub="Personalized study roadmap" />
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {preparationPlan.map((p, i) => (
                  <PrepDayCard key={p._id || i} day={p.day || i+1} focus={p.focus} tasks={p.tasks} />
                ))}
              </div>
            </Card>
          )}

          {/* ── Footer ── */}
          <footer style={{ display:"flex",justifyContent:"space-between",fontFamily:"'Syne',sans-serif",fontSize:11,color:"#5a5a78",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"1rem" }}>
            <span>Generated by <strong style={{ color:"#8888a8" }}>HireLens AI</strong></span>
            <span>Report ID: {_id?.slice(-8)?.toUpperCase()}</span>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Report;
