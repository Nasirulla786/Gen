import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ServerURL } from "../App";

const PastReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${ServerURL}/api/interview/all-reports`, {
        withCredentials: true,
      });

      setReports(res.data.getAllReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  <AnimatePresence>
    {selectedReport && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedReport(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.7)",
            zIndex: 999,
          }}
        />

        {/* Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.35 }}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "min(900px,100%)",
            height: "100vh",
            overflowY: "auto",
            zIndex: 1000,
            padding: "2rem",
            background: "#09090F",
            borderLeft: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <button
            onClick={() => setSelectedReport(null)}
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              marginBottom: "1rem",
            }}
          >
            ✕
          </button>

          <h1
            style={{
              color: "#A78BFA",
              marginBottom: "1rem",
            }}
          >
            Interview Report
          </h1>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "2rem",
            }}
          >
            <div className="score-badge">
              Match Score :{selectedReport.matchScore}%
            </div>
          </div>

          {/* JD */}
          <div className="report-card">
            <h3>Job Description</h3>

            <p
              style={{
                marginTop: "10px",
                color: "#cfcfcf",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedReport.jobDescription}
            </p>
          </div>

          {/* Technical Questions */}
          <div
            style={{
              marginTop: "2rem",
            }}
          >
            <h2
              style={{
                color: "#22C55E",
                marginBottom: "1rem",
              }}
            >
              Technical Questions
            </h2>

            {selectedReport.technicalQuestion?.map((q, index) => (
              <details
                key={index}
                className="report-card"
                style={{
                  marginBottom: "10px",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {q.question}
                </summary>

                <div
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  <p>
                    <strong>Intention:</strong> {q.intension}
                  </p>

                  <br />

                  <p>
                    <strong>Ideal Answer:</strong> {q.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          {/* Behavioral */}
          <div
            style={{
              marginTop: "2rem",
            }}
          >
            <h2
              style={{
                color: "#3B82F6",
                marginBottom: "1rem",
              }}
            >
              Behavioral Questions
            </h2>

            {selectedReport.behaviorQuestion?.map((q, index) => (
              <details
                key={index}
                className="report-card"
                style={{
                  marginBottom: "10px",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {q.question}
                </summary>

                <div
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  <p>{q.intension}</p>

                  <br />

                  <p>{q.answer}</p>
                </div>
              </details>
            ))}
          </div>

          {/* Preparation */}
          <div
            style={{
              marginTop: "2rem",
            }}
          >
            <h2
              style={{
                color: "#F59E0B",
              }}
            >
              Preparation Plan
            </h2>

            {selectedReport.preparationPlan?.map((day, index) => (
              <div
                key={index}
                className="report-card"
                style={{
                  marginTop: "1rem",
                }}
              >
                <h3>Day {day.day}</h3>

                <p>{day.focus}</p>

                <ul
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {day.tasks?.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>;

  return (
    <>
      <style>
        {`
.report-page{
min-height:100vh;
padding:2rem;
color:white;
background:
radial-gradient(circle at top left,
rgba(124,58,237,.15),
transparent 35%),
radial-gradient(circle at bottom right,
rgba(59,130,246,.12),
transparent 35%),
#060608;
position:relative;
overflow:hidden;
}

.report-grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(340px,1fr));
gap:20px;
}

.report-card{
background:rgba(255,255,255,.03);
border:1px solid rgba(255,255,255,.08);
backdrop-filter:blur(20px);
padding:1.5rem;
border-radius:24px;
transition:.3s;
}

.report-card:hover{
border-color:rgba(167,139,250,.4);
}

.score-badge{
padding:8px 14px;
border-radius:999px;
background:rgba(167,139,250,.15);
color:#A78BFA;
font-weight:600;
font-size:12px;
}

.report-btn{
width:100%;
padding:12px;
border:none;
border-radius:12px;
margin-top:15px;
cursor:pointer;
background:linear-gradient(
135deg,
#7C3AED,
#8B5CF6
);
color:white;
font-weight:600;
}

.report-detail{
margin-top:15px;
padding:1rem;
border-radius:16px;
background:rgba(255,255,255,.03);
border:1px solid rgba(255,255,255,.08);
}

.section-title{
margin-top:15px;
margin-bottom:8px;
font-weight:700;
}

.empty{
height:50vh;
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
color:#888;
}

@media(max-width:768px){
.report-page{
padding:1rem;
}
}
`}
      </style>

      <div className="report-page">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(124,58,237,.15)",
            filter: "blur(120px)",
            top: -100,
            left: -100,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
            }}
          >
            Past <span style={{ color: "#A78BFA" }}>Reports</span>
          </h1>

          <p
            style={{
              color: "#8b8b9e",
              marginTop: "10px",
            }}
          >
            Review your AI generated interview reports.
          </p>
        </motion.div>

        {loading ? (
          <div className="report-grid">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                className="report-card"
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
                style={{
                  height: "220px",
                }}
              />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="empty">
            <h2>No Reports Found</h2>
            <p>Create your first report.</p>
          </div>
        ) : (
          <div className="report-grid">
            {reports.map((report, index) => (
              <motion.div
                key={report._id}
                className="report-card"
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3>Interview Report</h3>

                    <p
                      style={{
                        fontSize: "12px",
                        color: "#888",
                      }}
                    >
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="score-badge">
                    {report.overallScore || 0}/100
                  </div>
                </div>

                <p
                  style={{
                    color: "#9CA3AF",
                    lineHeight: "1.6",
                  }}
                >
                  {report.jobDescription?.slice(0, 120)}
                  ...
                </p>

                <button
                  className="report-btn"
                  onClick={() =>
                    setSelectedReport(
                      selectedReport?._id === report._id ? null : report,
                    )
                  }
                >
                  {selectedReport?._id === report._id
                    ? "Hide Report"
                    : "View Full Report"}
                </button>

                <AnimatePresence>
                  {selectedReport?._id === report._id && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <div className="report-detail">
                        <div
                          className="section-title"
                          style={{
                            color: "#A78BFA",
                          }}
                        >
                          Job Description
                        </div>

                        <p>{report.jobDescription}</p>

                        <div
                          className="section-title"
                          style={{
                            color: "#22C55E",
                          }}
                        >
                          Strengths
                        </div>

                        <ul>
                          {report.strengths?.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>

                        <div
                          className="section-title"
                          style={{
                            color: "#EF4444",
                          }}
                        >
                          Weaknesses
                        </div>

                        <ul>
                          {report.weaknesses?.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>

                       <div
  className="section-title"
  style={{
    color: "#3B82F6",
  }}
>
  Preparation Plan
</div>

{report.preparationPlan?.map((day, i) => (
  <div
    key={i}
    style={{
      marginBottom: "15px",
      padding: "10px",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: "10px",
    }}
  >
    <h4>Day {day.day}</h4>

    <p>
      <strong>Focus:</strong> {day.focus}
    </p>

    <ul>
      {day.tasks?.map((task, idx) => (
        <li key={idx}>{task}</li>
      ))}
    </ul>
  </div>
))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PastReport;
