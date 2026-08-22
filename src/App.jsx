import {
  BarChart3,
  Brain,
  FileText,
  Home,
  Lightbulb,
  Menu,
  Settings,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { useRef, useState } from "react";

const API_BASE =
  "https://insightsai-backend.onrender.com";

function App() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] =
    useState(null);

  const [insights, setInsights] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fileInputRef =
    useRef(null);

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "Rows",
      value:
        analysis?.summary?.rows ??
        "—",
      change: analysis
        ? "Analyzed"
        : "Waiting",
      icon: FileText,
    },

    {
      title: "Columns",
      value:
        analysis?.summary?.columns ??
        "—",
      change: analysis
        ? "Detected"
        : "Waiting",
      icon: BarChart3,
    },

    {
      title: "Missing Values",
      value:
        analysis?.summary
          ?.total_missing_values ??
        "—",
      change: analysis
        ? "Detected"
        : "Waiting",
      icon: Lightbulb,
    },

    {
      title: "AI Insights",
      value:
        insights
          ? "Ready"
          : "—",
      change:
        insights
          ? "Generated"
          : "Waiting",
      icon: Brain,
    },
  ];

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = async (event) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      setError(
        "Please select a CSV file."
      );

      return;
    }

    setFile(selectedFile);
    setAnalysis(null);
    setInsights("");
    setError("");

    await analyzeDataset(
      selectedFile
    );
  };

  // =====================================================
  // ANALYZE DATASET
  // =====================================================

  const analyzeDataset = async (
    selectedFile
  ) => {
    try {
      setLoading(true);
      setError("");

      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const response =
        await fetch(
          `${API_BASE}/analyze`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Dataset analysis failed."
        );
      }

      setAnalysis(data);

      // Automatically generate AI insights
      await generateInsights(
        data
      );
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GENERATE AI INSIGHTS
  // =====================================================

  const generateInsights = async (
    analysisData
  ) => {
    try {
      const response =
        await fetch(
          `${API_BASE}/insights`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              analysis:
                analysisData,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "AI insights generation failed."
        );
      }

      setInsights(
        data.insights || ""
      );
    } catch (err) {
      throw new Error(
        err.message ||
          "Failed to generate AI insights."
      );
    }
  };

  // =====================================================
  // UPLOAD BUTTON
  // =====================================================

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // =====================================================
  // CLEAR DATA
  // =====================================================

  const clearDataset = () => {
    setFile(null);
    setAnalysis(null);
    setInsights("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "open"
            : "closed"
        }`}
      >

        <div className="logo">

          <div className="logo-icon">
            <Sparkles size={22} />
          </div>

          {sidebarOpen && (
            <div>
              <h2>
                InsightsAI
              </h2>

              <span>
                Intelligent Analytics
              </span>
            </div>
          )}

        </div>

        <nav className="sidebar-nav">

          <a
            className="nav-item active"
            href="#"
          >
            <Home size={19} />

            {sidebarOpen && (
              <span>
                Dashboard
              </span>
            )}
          </a>

          <a
            className="nav-item"
            href="#"
          >
            <FileText size={19} />

            {sidebarOpen && (
              <span>
                Documents
              </span>
            )}
          </a>

          <a
            className="nav-item"
            href="#"
          >
            <BarChart3 size={19} />

            {sidebarOpen && (
              <span>
                Analytics
              </span>
            )}
          </a>

          <a
            className="nav-item"
            href="#"
          >
            <Lightbulb size={19} />

            {sidebarOpen && (
              <span>
                AI Insights
              </span>
            )}
          </a>

        </nav>

        <div className="sidebar-bottom">

          <a
            className="nav-item"
            href="#"
          >
            <Settings size={19} />

            {sidebarOpen && (
              <span>
                Settings
              </span>
            )}
          </a>

        </div>

      </aside>


      {/* MAIN */}

      <main
        className={`main ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >

        {/* TOPBAR */}

        <header className="topbar">

          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >
            <Menu size={22} />
          </button>

          <div className="topbar-title">

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back to your AI
              analytics workspace.
            </p>

          </div>

          <div className="topbar-actions">

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={
                handleFileChange
              }
              style={{
                display: "none",
              }}
            />

            <button
              className="upload-button"
              onClick={
                openFilePicker
              }
              disabled={loading}
            >
              <Upload size={17} />

              {loading
                ? "Analyzing..."
                : "Upload CSV"}
            </button>

            <div className="avatar">
              S
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <section className="dashboard">

          {/* HERO */}

          <div className="hero">

            <div>

              <span className="hero-badge">
                <Sparkles size={14} />
                AI POWERED
              </span>

              <h2>
                Turn your data into
                <span>
                  {" "}
                  intelligent insights.
                </span>
              </h2>

              <p>
                Upload your CSV, analyze
                your data, and let AI
                uncover the insights that
                matter.
              </p>

            </div>

            <button
              className="hero-button"
              onClick={
                openFilePicker
              }
              disabled={loading}
            >
              <Brain size={18} />

              {loading
                ? "Analyzing..."
                : "Analyze Dataset"}
            </button>

          </div>


          {/* ERROR */}

          {error && (

            <div
              className="evaluation-error"
              style={{
                marginTop: "20px",
              }}
            >
              ⚠️ {error}
            </div>

          )}


          {/* FILE */}

          {file && (

            <div
              className="recent-card"
              style={{
                marginTop: "24px",
              }}
            >

              <div className="card-header">

                <div>

                  <h3>
                    Current Dataset
                  </h3>

                  <p>
                    {file.name}
                  </p>

                </div>

                <button
                  className="view-button"
                  onClick={
                    clearDataset
                  }
                >
                  <X size={16} />
                  Clear
                </button>

              </div>

            </div>

          )}


          {/* STATS */}

          <div className="stats-grid">

            {stats.map(
              (stat) => {

                const Icon =
                  stat.icon;

                return (

                  <div
                    className="stat-card"
                    key={
                      stat.title
                    }
                  >

                    <div className="stat-top">

                      <div className="stat-icon">
                        <Icon
                          size={20}
                        />
                      </div>

                      <span className="stat-change">
                        {
                          stat.change
                        }
                      </span>

                    </div>

                    <div className="stat-value">
                      {
                        stat.value
                      }
                    </div>

                    <div className="stat-title">
                      {
                        stat.title
                      }
                    </div>

                  </div>

                );
              }
            )}

          </div>
          {/* DATA QUALITY */}

{analysis && (
  <div
    className="recent-card"
    style={{ marginTop: "24px" }}
  >
    <div className="card-header">

      <div>
        <h3>Data Quality</h3>
        <p>
          Missing values detected in your dataset
        </p>
      </div>

      <Lightbulb size={20} />

    </div>

    <div
      style={{
        padding: "20px",
        display: "grid",
        gap: "14px",
      }}
    >

      {/* TOTAL MISSING */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px",
          borderRadius: "10px",
          background:
            "rgba(255,255,255,0.04)",
        }}
      >

        <strong>
          Total Missing Values
        </strong>

        <span className="stat-change">
          {Object.values(
            analysis.missing_values || {}
          ).reduce(
            (total, value) =>
              total + Number(value || 0),
            0
          )}
        </span>

      </div>


      {/* MISSING VALUE COLUMNS */}

      {Object.entries(
        analysis.missing_values || {}
      )
        .filter(
          ([, value]) =>
            Number(value) > 0
        )
        .map(
          ([column, value]) => {

            const count =
              Number(value);

            const rows =
              Number(
                analysis.rows || 0
              );

            const percentage =
              rows > 0
                ? (
                    (count / rows) *
                    100
                  ).toFixed(2)
                : "0.00";

            return (

              <div
                key={column}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background:
                    "rgba(255,255,255,0.04)",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: "8px",
                  }}
                >

                  <strong>
                    {column}
                  </strong>

                  <span>
                    {count} missing
                  </span>

                </div>


                {/* PROGRESS BAR */}

                <div
                  style={{
                    height: "7px",
                    borderRadius: "10px",
                    background:
                      "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                  }}
                >

                  <div
                    style={{
                      width: `${Math.min(
                        Number(
                          percentage
                        ),
                        100
                      )}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #6366f1, #8b5cf6)",
                      borderRadius: "10px",
                    }}
                  />

                </div>

                <small>
                  {percentage}% of rows
                </small>

              </div>

            );
          }
        )}


      {/* NO MISSING VALUES */}

      {Object.values(
        analysis.missing_values || {}
      ).every(
        (value) =>
          Number(value || 0) === 0
      ) && (

        <div
          style={{
            padding: "16px",
            borderRadius: "10px",
            background:
              "rgba(34,197,94,0.08)",
          }}
        >

          ✅ No missing values detected
          in this dataset.

        </div>

      )}

    </div>

  </div>
)}


          {/* DATASET OVERVIEW */}

          {analysis && (

            <>

              <div className="section-heading">

                <div>

                  <h2>
                    Dataset Overview
                  </h2>

                  <p>
                    Automatically detected
                    dataset structure.
                  </p>

                </div>

              </div>


              <div className="analytics-grid">

                <div className="chart-card">

                  <div className="card-header">

                    <div>

                      <h3>
                        Columns
                      </h3>

                      <p>
                        Detected fields
                      </p>

                    </div>

                    <BarChart3
                      size={20}
                    />

                  </div>

                  <div
                    style={{
                      padding:
                        "20px",
                    }}
                  >

                    {analysis.column_names?.map(
                      (
                        column
                      ) => (

                        <div
                          key={
                            column
                          }
                          style={{
                            padding:
                              "10px 0",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {column}
                        </div>

                      )
                    )}

                  </div>

                </div>
                {/* CORRELATION ANALYTICS */}

<div
  className="chart-card"
  style={{
    marginTop: "24px",
  }}
>
  <div className="card-header">

    <div>
      <h3>Loan Approval Correlation</h3>

      <p>
        Relationship between numeric features
        and LoanApproved
      </p>
    </div>

    <BarChart3 size={20} />

  </div>


  <div
    style={{
      padding: "20px",
      display: "grid",
      gap: "16px",
    }}
  >

    {analysis?.correlations?.LoanApproved
      ? Object.entries(
          analysis.correlations.LoanApproved
        )
          .filter(
            ([column]) =>
              column !== "LoanApproved"
          )
          .sort(
            ([, a], [, b]) =>
              Math.abs(Number(b)) -
              Math.abs(Number(a))
          )
          .map(
            ([column, value]) => {

              const correlation =
                Number(value);

              const percentage =
                Math.min(
                  Math.abs(
                    correlation
                  ) * 100,
                  100
                );

              return (

                <div
                  key={column}
                  style={{
                    display: "grid",
                    gap: "8px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >

                    <strong>
                      {column}
                    </strong>

                    <span>
                      {correlation.toFixed(
                        3
                      )}
                    </span>

                  </div>


                  <div
                    style={{
                      height: "8px",
                      borderRadius:
                        "10px",
                      background:
                        "rgba(255,255,255,0.08)",
                      overflow:
                        "hidden",
                    }}
                  >

                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background:
                          correlation >= 0
                            ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                            : "linear-gradient(90deg, #ef4444, #f97316)",
                        borderRadius:
                          "10px",
                        transition:
                          "width 0.5s ease",
                      }}
                    />

                  </div>

                  <small
                    style={{
                      opacity: 0.7,
                    }}
                  >
                    {correlation > 0
                      ? "Positive relationship"
                      : correlation < 0
                      ? "Negative relationship"
                      : "No linear relationship"}
                  </small>

                </div>

              );
            }
          )
      : (
        <p>
          Correlation data is not available.
        </p>
      )}

  </div>

</div>


                {/* AI INSIGHTS */}

                <div className="insights-card">

                  <div className="card-header">

                    <div>

                      <h3>
                        Latest AI Insights
                      </h3>

                      <p>
                        Generated from your
                        dataset
                      </p>

                    </div>

                    <Sparkles
                      size={20}
                    />

                  </div>

                  <div
                    className="insight-list"
                    style={{
                      padding:
                        "20px",
                    }}
                  >

                    {loading && (

                      <div className="insight-item">

                        <div className="insight-number">
                          ✨
                        </div>

                        <div>

                          <strong>
                            AI is analyzing...
                          </strong>

                          <p>
                            Finding patterns
                            and generating
                            insights from your
                            dataset.
                          </p>

                        </div>

                      </div>

                    )}


                    {!loading &&
                      insights && (

                        <div className="insight-item">

                          <div className="insight-number">
                            AI
                          </div>

                          <div>

                            <strong>
                              AI Analysis
                            </strong>

                            <p
                              style={{
                                whiteSpace:
                                  "pre-wrap",
                              }}
                            >
                              {
                                insights
                              }
                            </p>

                          </div>

                        </div>

                      )}

                    {!loading &&
                      !insights && (

                        <div className="insight-item">

                          <div className="insight-number">
                            —
                          </div>

                          <div>

                            <strong>
                              No insights yet
                            </strong>

                            <p>
                              Upload a CSV
                              dataset to
                              generate AI
                              insights.
                            </p>

                          </div>

                        </div>

                      )}

                  </div>

                </div>

              </div>

            </>

          )}


          {/* RECENT DOCUMENTS */}

          {!analysis && (

            <div className="recent-card">

              <div className="card-header">

                <div>

                  <h3>
                    Get Started
                  </h3>

                  <p>
                    Upload a CSV dataset
                    to begin analysis.
                  </p>

                </div>

                <button
                  className="view-button"
                  onClick={
                    openFilePicker
                  }
                >
                  <Upload
                    size={16}
                  />
                  Upload CSV
                </button>

              </div>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default App;




