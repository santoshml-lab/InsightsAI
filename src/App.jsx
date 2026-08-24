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
  Download,
  Database,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { useRef, useState } from "react";
import jsPDF from "jspdf";

const API_BASE =
  "https://insightsai-backend.onrender.com";

// =====================================================
// AI INSIGHTS FORMATTER
// =====================================================

function formatAIInsights(text) {
  if (!text) return [];

  const sections = [];
  let currentSection = null;

  const lines = text
    .replace(/\r/g, "")
    .split("\n");

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) return;

    const cleanLine = line
      .replace(/^#{1,6}\s*/, "")
      .replace(/^\*\*(.*?)\*\*$/, "$1")
      .replace(/^#+/, "")
      .replace(/:$/, "")
      .trim();

    const lower = cleanLine.toLowerCase();

    const isHeading =
      lower.includes("key insights") ||
      lower.includes("key findings") ||
      lower.includes("data quality") ||
      lower.includes("important patterns") ||
      lower === "patterns" ||
      lower.includes("business implications") ||
      lower.includes("possible business implications") ||
      lower.includes("recommended next steps") ||
      lower.includes("next steps");

    if (isHeading) {
      currentSection = {
        title: cleanLine,
        items: [],
      };

      sections.push(currentSection);
      return;
    }

    if (!currentSection) {
      currentSection = {
        title: "AI Analysis",
        items: [],
      };

      sections.push(currentSection);
    }

    const cleanedItem = line
      .replace(/^[-*•]\s*/, "")
      .replace(/^\d+\.\s*/, "")
      .replace(/^>\s*/, "")
      .trim();

    if (cleanedItem) {
      currentSection.items.push(cleanedItem);
    }
  });

  return sections;
}

// =====================================================
// APP
// =====================================================

function App() {
  // =====================================================
  // STATE
  // =====================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [activePage, setActivePage] =
    useState("dashboard");

  const [file, setFile] =
    useState(null);

  const [analysis, setAnalysis] =
    useState(null);

  const [insights, setInsights] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(true);

  const fileInputRef =
    useRef(null);

  // =====================================================
  // HELPERS
  // =====================================================

  const getMissingCount = (value) => {
    if (
      value &&
      typeof value === "object"
    ) {
      return Number(value.count || 0);
    }

    return Number(value || 0);
  };

  const getMissingPercentage = (value) => {
    if (
      value &&
      typeof value === "object"
    ) {
      return Number(value.percentage || 0);
    }

    const rows =
      Number(
        analysis?.summary?.rows || 0
      );

    const count =
      Number(value || 0);

    if (!rows) return 0;

    return (count / rows) * 100;
  };

  const getStrongestCorrelation = () => {
    if (
      !analysis?.correlations?.LoanApproved
    ) {
      return null;
    }

    const strongest =
      Object.entries(
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
        )[0];

    if (!strongest) return null;

    return {
      column: strongest[0],
      value: Number(strongest[1]),
    };
  };

  // =====================================================
  // PDF REPORT
  // =====================================================

  const downloadReport = () => {
    if (!analysis) return;

    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    let y = 20;

    const addText = (
      text,
      x = 20,
      fontSize = 11,
      maxWidth = pageWidth - 40
    ) => {
      doc.setFontSize(fontSize);

      const lines =
        doc.splitTextToSize(
          String(text),
          maxWidth
        );

      if (
        y + lines.length * 7 >
        pageHeight - 20
      ) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines, x, y);

      y +=
        lines.length * 7 + 3;
    };

    doc.setFont(
      "helvetica",
      "bold"
    );

    addText(
      "InsightsAI",
      20,
      22
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    addText(
      "AI-Powered Data Analysis Report",
      20,
      12
    );

    y += 5;

    // DATASET

    doc.setFont(
      "helvetica",
      "bold"
    );

    addText(
      "DATASET",
      20,
      14
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    addText(
      file?.name || "Unknown",
      20,
      11
    );

    y += 5;

    // SUMMARY

    doc.setFont(
      "helvetica",
      "bold"
    );

    addText(
      "DATASET SUMMARY",
      20,
      14
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    addText(
      `Rows: ${
        analysis.summary?.rows ?? "N/A"
      }`
    );

    addText(
      `Columns: ${
        analysis.summary?.columns ?? "N/A"
      }`
    );

    addText(
      `Total Missing Values: ${
        analysis.summary?.total_missing_values ??
        "N/A"
      }`
    );

    addText(
      `Duplicate Rows: ${
        analysis.summary?.duplicate_rows ??
        "N/A"
      }`
    );

    y += 5;

    // AI INSIGHTS

    doc.setFont(
      "helvetica",
      "bold"
    );

    addText(
      "AI INSIGHTS",
      20,
      14
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    if (insights) {
      const formattedInsights =
        formatAIInsights(insights);

      formattedInsights.forEach(
        (section) => {
          doc.setFont(
            "helvetica",
            "bold"
          );

          addText(
            section.title,
            20,
            12
          );

          doc.setFont(
            "helvetica",
            "normal"
          );

          section.items.forEach(
            (item) => {
              addText(
                `• ${item}`,
                25,
                10
              );
            }
          );

          y += 2;
        }
      );
    } else {
      addText(
        "No AI insights available."
      );
    }

    y += 5;

    // AI EVIDENCE

    doc.setFont(
      "helvetica",
      "bold"
    );

    addText(
      "AI EVIDENCE",
      20,
      14
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    const strongest =
      getStrongestCorrelation();

    if (strongest) {
      addText(
        `Strongest Numeric Relationship: ${strongest.column}`
      );

      addText(
        `Correlation with LoanApproved: ${strongest.value.toFixed(
          4
        )}`
      );
    }

    y += 5;

    // MISSING DATA

    doc.setFont(
      "helvetica",
      "bold"
    );

    addText(
      "MISSING DATA",
      20,
      14
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    if (analysis.missing_values) {
      const missingColumns =
        Object.entries(
          analysis.missing_values
        ).filter(
          ([, data]) =>
            getMissingCount(data) > 0
        );

      if (
        missingColumns.length === 0
      ) {
        addText(
          "No missing values detected."
        );
      } else {
        missingColumns.forEach(
          ([column, data]) => {
            addText(
              `${column}: ${getMissingCount(
                data
              )} missing (${getMissingPercentage(
                data
              ).toFixed(2)}%)`
            );
          }
        );
      }
    }

    y += 5;

    // OUTLIERS

    doc.setFont(
      "helvetica",
      "bold"
    );

    addText(
      "OUTLIER CHECK",
      20,
      14
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    if (analysis.outliers) {
      const outliers =
        Object.entries(
          analysis.outliers
        ).filter(
          ([, data]) =>
            Number(data?.count) > 0
        );

      if (
        outliers.length === 0
      ) {
        addText(
          "No outliers detected."
        );
      } else {
        outliers.forEach(
          ([column, data]) => {
            addText(
              `${column}: ${data.count} (${data.percentage}%)`
            );
          }
        );
      }
    }

    y += 5;

    // DATA VALIDATION

    if (
      analysis.numeric_statistics
    ) {
      doc.setFont(
        "helvetica",
        "bold"
      );

      addText(
        "DATA VALIDATION",
        20,
        14
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      [
        "Income",
        "LoanAmount",
      ].forEach(
        (column) => {
          const stats =
            analysis
              .numeric_statistics?.[
              column
            ];

          if (!stats) return;

          if (
            Number(stats.minimum) >= 0
          ) {
            return;
          }

          addText(
            `Negative ${column} detected. Minimum: ${stats.minimum}`
          );
        }
      );
    }

    y += 8;

    doc.setFont(
      "helvetica",
      "italic"
    );

    addText(
      "Generated by InsightsAI — AI-Powered Data Analytics",
      20,
      9
    );

    const filename =
      `${
        file?.name?.replace(
          /\.csv$/i,
          ""
        ) || "dataset"
      }_InsightsAI_Report.pdf`;

    doc.save(filename);
  };

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange =
    async (event) => {
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

      setActivePage("dashboard");

      await analyzeDataset(
        selectedFile
      );
    };

  // =====================================================
  // ANALYZE
  // =====================================================

  const analyzeDataset =
    async (selectedFile) => {
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
  // GENERATE INSIGHTS
  // =====================================================

  const generateInsights =
    async (analysisData) => {
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
  // UPLOAD
  // =====================================================

  const openFilePicker =
    () => {
      fileInputRef.current?.click();
    };

  // =====================================================
  // CLEAR
  // =====================================================

  const clearDataset =
    () => {
      setFile(null);
      setAnalysis(null);
      setInsights("");
      setError("");

      setActivePage("dashboard");

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigateTo = (page) => {
    setActivePage(page);
  };

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "Rows",
      value:
        analysis?.summary?.rows ??
        "—",
      change:
        analysis
          ? "Analyzed"
          : "Waiting",
      icon: FileText,
    },

    {
      title: "Columns",
      value:
        analysis?.summary?.columns ??
        "—",
      change:
        analysis
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
      change:
        analysis
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
  // PAGE TITLE
  // =====================================================

  const getPageTitle = () => {
    switch (activePage) {
      case "documents":
        return {
          title: "Documents",
          subtitle:
            "Manage your uploaded datasets.",
        };

      case "analytics":
        return {
          title: "Analytics",
          subtitle:
            "Explore patterns and relationships in your data.",
        };

      case "insights":
        return {
          title: "AI Insights",
          subtitle:
            "AI-generated findings from your dataset.",
        };

      case "settings":
        return {
          title: "Settings",
          subtitle:
            "Manage your InsightsAI workspace.",
        };

      default:
        return {
          title: "Dashboard",
          subtitle:
            "Welcome back to your AI analytics workspace.",
        };
    }
  };

  const pageInfo =
    getPageTitle();

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className={`app ${
        darkMode
          ? "dark-mode"
          : ""
      }`}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >

        {/* LOGO */}

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

        {/* MAIN NAV */}

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <button
            className={`nav-item ${
              activePage ===
              "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "dashboard"
              )
            }
            type="button"
          >
            <Home size={19} />

            {sidebarOpen && (
              <span>
                Dashboard
              </span>
            )}
          </button>

          {/* DOCUMENTS */}

          <button
            className={`nav-item ${
              activePage ===
              "documents"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "documents"
              )
            }
            type="button"
          >
            <FileText size={19} />

            {sidebarOpen && (
              <span>
                Documents
              </span>
            )}
          </button>

          {/* ANALYTICS */}

          <button
            className={`nav-item ${
              activePage ===
              "analytics"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "analytics"
              )
            }
            type="button"
          >
            <BarChart3 size={19} />

            {sidebarOpen && (
              <span>
                Analytics
              </span>
            )}
          </button>

          {/* AI INSIGHTS */}

          <button
            className={`nav-item ${
              activePage ===
              "insights"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "insights"
              )
            }
            type="button"
          >
            <Lightbulb size={19} />

            {sidebarOpen && (
              <span>
                AI Insights
              </span>
            )}
          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            className={`nav-item ${
              activePage ===
              "settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "settings"
              )
            }
            type="button"
          >
            <Settings size={19} />

            {sidebarOpen && (
              <span>
                Settings
              </span>
            )}
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className={`main ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >

        {/* =====================================================
            TOPBAR
        ===================================================== */}

        <header className="topbar">

          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            type="button"
          >
            {sidebarOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          <div className="topbar-title">

            <h1>
              {pageInfo.title}
            </h1>

            <p>
              {pageInfo.subtitle}
            </p>

          </div>

          <div className="topbar-actions">

            {/* FILE INPUT */}

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

            {/* UPLOAD */}

            <button
              className="upload-button"
              onClick={
                openFilePicker
              }
              disabled={loading}
              type="button"
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

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div
            className="evaluation-error"
            style={{
              margin:
                "20px 24px 0",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {activePage ===
          "dashboard" && (
          <section className="dashboard">

            {/* HERO */}

            <div className="hero">

              <div>

                <div className="hero-actions">

                  <span className="hero-badge">
                    <Sparkles size={14} />
                    AI POWERED
                  </span>

                  {analysis && (
                    <button
                      className="download-button"
                      onClick={
                        downloadReport
                      }
                      type="button"
                    >
                      <Download size={16} />
                      Download Report
                    </button>
                  )}

                </div>

                <h2>
                  Turn your data into
                  <span>
                    {" "}
                    intelligent insights.
                  </span>
                </h2>

                <p>
                  Upload your CSV,
                  analyze your data,
                  and let AI uncover
                  the insights that matter.
                </p>

              </div>

              <button
                className="hero-button"
                onClick={
                  openFilePicker
                }
                disabled={loading}
                type="button"
              >
                <Brain size={18} />

                {loading
                  ? "Analyzing..."
                  : "Analyze Dataset"}
              </button>

            </div>

            {/* CURRENT DATASET */}

            {file && (
              <div
                className="recent-card"
                style={{
                  marginTop:
                    "24px",
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
                    type="button"
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
                          <Icon size={20} />
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
              <DataQuality
                analysis={
                  analysis
                }
                getMissingCount={
                  getMissingCount
                }
                getMissingPercentage={
                  getMissingPercentage
                }
              />
            )}

            {/* DATASET OVERVIEW */}

            {analysis && (
              <DatasetOverview
                analysis={
                  analysis
                }
              />
            )}

            {/* AI EVIDENCE */}

            {analysis && (
              <AIEvidence
                analysis={
                  analysis
                }
                getMissingCount={
                  getMissingCount
                }
                getMissingPercentage={
                  getMissingPercentage
                }
                getStrongestCorrelation={
                  getStrongestCorrelation
                }
              />
            )}

            {/* GET STARTED */}

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
                    type="button"
                  >
                    <Upload size={16} />
                    Upload CSV
                  </button>

                </div>

              </div>
            )}

          </section>
        )}

        {/* =====================================================
            DOCUMENTS
        ===================================================== */}

        {activePage ===
          "documents" && (
          <section className="dashboard">

            <div className="section-heading">

              <div>
                <h2>
                  Documents
                </h2>

                <p>
                  Your uploaded datasets
                  and their current status.
                </p>
              </div>

              <button
                className="upload-button"
                onClick={
                  openFilePicker
                }
                type="button"
              >
                <Upload size={17} />
                Upload CSV
              </button>

            </div>

            <div className="recent-card">

              <div className="card-header">

                <div>
                  <h3>
                    Uploaded Dataset
                  </h3>

                  <p>
                    CSV document
                  </p>
                </div>

                <Database
                  size={20}
                />

              </div>

              {!file ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                  }}
                >

                  <FileText
                    size={40}
                    style={{
                      opacity: 0.5,
                    }}
                  />

                  <h3>
                    No dataset uploaded
                  </h3>

                  <p>
                    Upload a CSV file
                    to start analyzing.
                  </p>

                  <button
                    className="hero-button"
                    onClick={
                      openFilePicker
                    }
                    type="button"
                  >
                    <Upload size={18} />
                    Upload Dataset
                  </button>

                </div>
              ) : (
                <div
                  style={{
                    padding: "24px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap: "20px",
                      flexWrap:
                        "wrap",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "14px",
                      }}
                    >

                      <div className="stat-icon">
                        <FileText
                          size={22}
                        />
                      </div>

                      <div>
                        <strong>
                          {file.name}
                        </strong>

                        <p>
                          {analysis
                            ? "Analysis completed"
                            : "Processing..."}
                        </p>
                      </div>

                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >

                      {analysis && (
                        <button
                          className="view-button"
                          onClick={() =>
                            navigateTo(
                              "dashboard"
                            )
                          }
                          type="button"
                        >
                          View Analysis
                        </button>
                      )}

                      <button
                        className="view-button"
                        onClick={
                          clearDataset
                        }
                        type="button"
                      >
                        <Trash2
                          size={16}
                        />
                        Remove
                      </button>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </section>
        )}

        {/* =====================================================
            ANALYTICS
        ===================================================== */}

        {activePage ===
          "analytics" && (
          <section className="dashboard">

            {!analysis ? (
              <EmptyState
                icon={BarChart3}
                title="No analytics available"
                description="Upload a CSV dataset to generate analytics."
                buttonText="Upload CSV"
                onClick={
                  openFilePicker
                }
              />
            ) : (
              <>

                <div className="section-heading">

                  <div>
                    <h2>
                      Dataset Analytics
                    </h2>

                    <p>
                      Numerical relationships
                      and dataset statistics.
                    </p>
                  </div>

                  <button
                    className="download-button"
                    onClick={
                      downloadReport
                    }
                    type="button"
                  >
                    <Download
                      size={16}
                    />
                    Report
                  </button>

                </div>

                {/* ANALYTICS STATS */}

                <div className="stats-grid">

                  <div className="stat-card">
                    <div className="stat-top">
                      <div className="stat-icon">
                        <Database
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="stat-value">
                      {
                        analysis
                          .summary
                          ?.rows
                      }
                    </div>

                    <div className="stat-title">
                      Total Records
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-top">
                      <div className="stat-icon">
                        <BarChart3
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="stat-value">
                      {
                        analysis
                          .summary
                          ?.columns
                      }
                    </div>

                    <div className="stat-title">
                      Features
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-top">
                      <div className="stat-icon">
                        <AlertCircle
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="stat-value">
                      {
                        analysis
                          .summary
                          ?.duplicate_rows ??
                        0
                      }
                    </div>

                    <div className="stat-title">
                      Duplicate Rows
                    </div>
                  </div>

                </div>

                {/* CORRELATION */}

                <div className="recent-card">

                  <div className="card-header">

                    <div>
                      <h3>
                        Loan Approval Correlation
                      </h3>

                      <p>
                        Relationship between
                        numeric features and
                        LoanApproved.
                      </p>
                    </div>

                    <BarChart3
                      size={20}
                    />

                  </div>

                  <div
                    style={{
                      padding: "24px",
                      display: "grid",
                      gap: "18px",
                    }}
                  >

                    {analysis
                      ?.correlations
                      ?.LoanApproved ? (
                      Object.entries(
                        analysis
                          .correlations
                          .LoanApproved
                      )
                        .filter(
                          ([column]) =>
                            column !==
                            "LoanApproved"
                        )
                        .sort(
                          (
                            [, a],
                            [, b]
                          ) =>
                            Math.abs(
                              Number(b)
                            ) -
                            Math.abs(
                              Number(a)
                            )
                        )
                        .map(
                          (
                            [
                              column,
                              value,
                            ]
                          ) => {

                            const correlation =
                              Number(
                                value
                              );

                            const percentage =
                              Math.min(
                                Math.abs(
                                  correlation
                                ) *
                                  100,
                                100
                              );

                            return (
                              <div
                                key={
                                  column
                                }
                              >

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    justifyContent:
                                      "space-between",
                                    marginBottom:
                                      "8px",
                                  }}
                                >
                                  <strong>
                                    {
                                      column
                                    }
                                  </strong>

                                  <strong>
                                    {correlation.toFixed(
                                      3
                                    )}
                                  </strong>
                                </div>

                                <div
                                  style={{
                                    height:
                                      "10px",
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
                                      height:
                                        "100%",
                                      background:
                                        correlation >=
                                        0
                                          ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                                          : "linear-gradient(90deg,#ef4444,#f97316)",
                                    }}
                                  />

                                </div>

                                <small
                                  style={{
                                    opacity:
                                      0.65,
                                    display:
                                      "block",
                                    marginTop:
                                      "6px",
                                  }}
                                >
                                  {correlation >
                                  0
                                    ? "Positive relationship"
                                    : correlation <
                                      0
                                    ? "Negative relationship"
                                    : "No linear relationship"}
                                </small>

                              </div>
                            );
                          }
                        )
                    ) : (
                      <p>
                        Correlation data
                        is not available.
                      </p>
                    )}

                  </div>

                </div>

                {/* COLUMNS */}

                <div className="recent-card">

                  <div className="card-header">

                    <div>
                      <h3>
                        Dataset Columns
                      </h3>

                      <p>
                        Fields detected
                        in your dataset.
                      </p>
                    </div>

                    <FileText
                      size={20}
                    />

                  </div>

                  <div
                    style={{
                      padding: "20px",
                    }}
                  >

                    {analysis.columns?.map(
                      (column) => (
                        <div
                          key={
                            column
                          }
                          style={{
                            padding:
                              "13px 0",
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

              </>
            )}

          </section>
        )}

        {/* =====================================================
            AI INSIGHTS PAGE
        ===================================================== */}

        {activePage ===
          "insights" && (
          <section className="dashboard">

            {!analysis ? (
              <EmptyState
                icon={Brain}
                title="No AI insights yet"
                description="Upload a CSV dataset and let AI discover meaningful patterns."
                buttonText="Analyze Dataset"
                onClick={
                  openFilePicker
                }
              />
            ) : (
              <>

                <div className="section-heading">

                  <div>
                    <h2>
                      AI Insights
                    </h2>

                    <p>
                      Intelligent findings
                      generated from your data.
                    </p>
                  </div>

                  {insights && (
                    <button
                      className="download-button"
                      onClick={
                        downloadReport
                      }
                      type="button"
                    >
                      <Download
                        size={16}
                      />
                      Download Report
                    </button>
                  )}

                </div>

                {loading && (
                  <div className="recent-card">

                    <div
                      style={{
                        padding:
                          "40px",
                        textAlign:
                          "center",
                      }}
                    >

                      <Brain
                        size={40}
                      />

                      <h3>
                        AI is analyzing...
                      </h3>

                      <p>
                        Finding patterns
                        and generating
                        insights.
                      </p>

                    </div>

                  </div>
                )}

                {!loading &&
                  insights && (
                    <div
                      className="recent-card"
                      style={{
                        padding:
                          "20px",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "grid",
                          gap:
                            "16px",
                        }}
                      >

                        {formatAIInsights(
                          insights
                        ).map(
                          (
                            section,
                            index
                          ) => {

                            const title =
                              section.title.toLowerCase();

                            const isQuality =
                              title.includes(
                                "quality"
                              );

                            const isPattern =
                              title.includes(
                                "pattern"
                              );

                            const isBusiness =
                              title.includes(
                                "business"
                              );

                            const isRecommendation =
                              title.includes(
                                "recommended"
                              ) ||
                              title.includes(
                                "next step"
                              );

                            const isFinding =
                              title.includes(
                                "finding"
                              ) ||
                              title.includes(
                                "insight"
                              );

                            return (
                              <div
                                key={
                                  index
                                }
                                style={{
                                  padding:
                                    "20px",
                                  borderRadius:
                                    "14px",
                                  background:
                                    "rgba(255,255,255,0.04)",
                                  border:
                                    "1px solid rgba(255,255,255,0.08)",
                                }}
                              >

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    gap:
                                      "10px",
                                    alignItems:
                                      "center",
                                    marginBottom:
                                      "14px",
                                  }}
                                >

                                  <span
                                    style={{
                                      fontSize:
                                        "20px",
                                    }}
                                  >
                                    {isQuality
                                      ? "⚠️"
                                      : isPattern
                                      ? "🔍"
                                      : isBusiness
                                      ? "💼"
                                      : isRecommendation
                                      ? "🚀"
                                      : isFinding
                                      ? "💡"
                                      : "✨"}
                                  </span>

                                  <strong>
                                    {
                                      section.title
                                    }
                                  </strong>

                                </div>

                                <div
                                  style={{
                                    display:
                                      "grid",
                                    gap:
                                      "10px",
                                  }}
                                >

                                  {section.items.map(
                                    (
                                      item,
                                      itemIndex
                                    ) => (
                                      <div
                                        key={
                                          itemIndex
                                        }
                                        style={{
                                          display:
                                            "flex",
                                          gap:
                                            "10px",
                                          lineHeight:
                                            "1.6",
                                        }}
                                      >

                                        <span>
                                          {isRecommendation
                                            ? `${itemIndex +
                                                1}.`
                                            : "•"}
                                        </span>

                                        <span>
                                          {
                                            item
                                          }
                                        </span>

                                      </div>
                                    )
                                  )}

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )}

                {!loading &&
                  !insights && (
                    <EmptyState
                      icon={Lightbulb}
                      title="No insights generated"
                      description="Try analyzing your dataset again."
                      buttonText="Upload CSV"
                      onClick={
                        openFilePicker
                      }
                    />
                  )}

              </>
            )}

          </section>
        )}

        {/* =====================================================
            SETTINGS
        ===================================================== */}

        {activePage ===
          "settings" && (
          <section className="dashboard">

            <div className="section-heading">

              <div>
                <h2>
                  Settings
                </h2>

                <p>
                  Manage your InsightsAI
                  workspace.
                </p>
              </div>

            </div>

            {/* GENERAL */}

            <div className="recent-card">

              <div className="card-header">

                <div>
                  <h3>
                    General
                  </h3>

                  <p>
                    Application preferences
                  </p>
                </div>

                <Settings
                  size={20}
                />

              </div>

              <div
                style={{
                  padding: "20px",
                  display: "grid",
                  gap: "16px",
                }}
              >

                {/* THEME */}

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    padding:
                      "16px",
                    borderRadius:
                      "12px",
                    background:
                      "rgba(255,255,255,0.04)",
                  }}
                >

                  <div>
                    <strong>
                      Dark Mode
                    </strong>

                    <p>
                      Use the dark
                      dashboard interface.
                    </p>
                  </div>

                  <button
                    className="view-button"
                    onClick={() =>
                      setDarkMode(
                        !darkMode
                      )
                    }
                    type="button"
                  >
                    {darkMode
                      ? "Enabled"
                      : "Disabled"}
                  </button>

                </div>

              </div>

            </div>

            {/* BACKEND */}

            <div
              className="recent-card"
              style={{
                marginTop:
                  "24px",
              }}
            >

              <div className="card-header">

                <div>
                  <h3>
                    Backend
                  </h3>

                  <p>
                    InsightsAI API
                    configuration
                  </p>
                </div>

                <Database
                  size={20}
                />

              </div>

              <div
                style={{
                  padding: "20px",
                }}
              >

                <div
                  style={{
                    padding:
                      "16px",
                    borderRadius:
                      "12px",
                    background:
                      "rgba(34,197,94,0.08)",
                    border:
                      "1px solid rgba(34,197,94,0.15)",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap:
                        "10px",
                    }}
                  >

                    <CheckCircle2
                      size={20}
                    />

                    <strong>
                      Backend Connected
                    </strong>

                  </div>

                  <p
                    style={{
                      marginTop:
                        "8px",
                      wordBreak:
                        "break-all",
                    }}
                  >
                    {API_BASE}
                  </p>

                </div>

              </div>

            </div>

            {/* DATA */}

            <div
              className="recent-card"
              style={{
                marginTop:
                  "24px",
              }}
            >

              <div className="card-header">

                <div>
                  <h3>
                    Dataset Management
                  </h3>

                  <p>
                    Manage the currently
                    loaded dataset.
                  </p>
                </div>

                <Trash2
                  size={20}
                />

              </div>

              <div
                style={{
                  padding: "20px",
                }}
              >

                <button
                  className="view-button"
                  onClick={
                    clearDataset
                  }
                  type="button"
                  disabled={!file}
                >
                  <Trash2
                    size={16}
                  />
                  Clear Dataset
                </button>

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

// =====================================================
// DATA QUALITY COMPONENT
// =====================================================

function DataQuality({
  analysis,
  getMissingCount,
  getMissingPercentage,
}) {
  const missingValues =
    analysis.missing_values || {};

  const totalMissing =
    Object.values(
      missingValues
    ).reduce(
      (
        total,
        value
      ) =>
        total +
        getMissingCount(
          value
        ),
      0
    );

  return (
    <div
      className="recent-card"
      style={{
        marginTop:
          "24px",
      }}
    >

      <div className="card-header">

        <div>
          <h3>
            Data Quality
          </h3>

          <p>
            Missing values detected
            in your dataset.
          </p>
        </div>

        <Lightbulb
          size={20}
        />

      </div>

      <div
        style={{
          padding: "20px",
          display: "grid",
          gap: "14px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            padding: "14px",
            borderRadius:
              "10px",
            background:
              "rgba(255,255,255,0.04)",
          }}
        >

          <strong>
            Total Missing Values
          </strong>

          <span className="stat-change">
            {totalMissing}
          </span>

        </div>

        {Object.entries(
          missingValues
        )
          .filter(
            ([, value]) =>
              getMissingCount(
                value
              ) > 0
          )
          .map(
            ([
              column,
              value,
            ]) => {

              const count =
                getMissingCount(
                  value
                );

              const percentage =
                getMissingPercentage(
                  value
                );

              return (
                <div
                  key={
                    column
                  }
                  style={{
                    padding:
                      "14px",
                    borderRadius:
                      "10px",
                    background:
                      "rgba(255,255,255,0.04)",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginBottom:
                        "8px",
                    }}
                  >

                    <strong>
                      {column}
                    </strong>

                    <span>
                      {count} missing
                    </span>

                  </div>

                  <div
                    style={{
                      height:
                        "7px",
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
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                        height:
                          "100%",
                        background:
                          "linear-gradient(90deg,#6366f1,#8b5cf6)",
                      }}
                    />

                  </div>

                  <small>
                    {percentage.toFixed(
                      2
                    )}
                    % of rows
                  </small>

                </div>
              );
            }
          )}

        {totalMissing ===
          0 && (
          <div
            style={{
              padding:
                "16px",
              borderRadius:
                "10px",
              background:
                "rgba(34,197,94,0.08)",
            }}
          >
            ✅ No missing values
            detected in this dataset.
          </div>
        )}

      </div>

    </div>
  );
}

// =====================================================
// DATASET OVERVIEW
// =====================================================

function DatasetOverview({
  analysis,
}) {
  return (
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

        {/* COLUMNS */}

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

            <FileText
              size={20}
            />

          </div>

          <div
            style={{
              padding: "20px",
            }}
          >

            {analysis.columns
              ?.length > 0 ? (
              analysis.columns.map(
                (column) => (
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
              )
            ) : (
              <p>
                No columns detected.
              </p>
            )}

          </div>

        </div>

        {/* CORRELATION */}

        <div className="chart-card">

          <div className="card-header">

            <div>
              <h3>
                Loan Approval Correlation
              </h3>

              <p>
                Numeric relationship
                with LoanApproved.
              </p>
            </div>

            <BarChart3
              size={20}
            />

          </div>

          <div
            style={{
              padding: "20px",
              display: "grid",
              gap: "16px",
            }}
          >

            {analysis
              ?.correlations
              ?.LoanApproved ? (
              Object.entries(
                analysis
                  .correlations
                  .LoanApproved
              )
                .filter(
                  ([column]) =>
                    column !==
                    "LoanApproved"
                )
                .sort(
                  (
                    [, a],
                    [, b]
                  ) =>
                    Math.abs(
                      Number(b)
                    ) -
                    Math.abs(
                      Number(a)
                    )
                )
                .map(
                  (
                    [
                      column,
                      value,
                    ]
                  ) => {

                    const correlation =
                      Number(
                        value
                      );

                    const percentage =
                      Math.min(
                        Math.abs(
                          correlation
                        ) * 100,
                        100
                      );

                    return (
                      <div
                        key={
                          column
                        }
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                          }}
                        >

                          <strong>
                            {
                              column
                            }
                          </strong>

                          <span>
                            {correlation.toFixed(
                              3
                            )}
                          </span>

                        </div>

                        <div
                          style={{
                            height:
                              "8px",
                            marginTop:
                              "8px",
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
                              height:
                                "100%",
                              background:
                                correlation >=
                                0
                                  ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                                  : "linear-gradient(90deg,#ef4444,#f97316)",
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )
            ) : (
              <p>
                Correlation data
                unavailable.
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
                Generated from
                your dataset.
              </p>
            </div>

            <Sparkles
              size={20}
            />

          </div>

          <div
            style={{
              padding: "20px",
            }}
          >

            <p>
              AI insights are
              available from the
              <strong>
                {" "}
                AI Insights
              </strong>{" "}
              section.
            </p>

          </div>

        </div>

      </div>
    </>
  );
}

// =====================================================
// AI EVIDENCE
// =====================================================

function AIEvidence({
  analysis,
  getMissingCount,
  getMissingPercentage,
  getStrongestCorrelation,
}) {
  const strongest =
    getStrongestCorrelation();

  return (
    <div
      className="recent-card"
      style={{
        marginTop:
          "24px",
      }}
    >

      <div className="card-header">

        <div>
          <h3>
            AI Evidence
          </h3>

          <p>
            Key findings backed
            by your dataset.
          </p>
        </div>

        <Brain size={20} />

      </div>

      <div
        style={{
          padding: "20px",
          display: "grid",
          gap: "14px",
        }}
      >

        {/* CORRELATION */}

        {strongest && (
          <div
            style={{
              padding:
                "16px",
              borderRadius:
                "12px",
              background:
                "rgba(99,102,241,0.08)",
              border:
                "1px solid rgba(99,102,241,0.18)",
            }}
          >

            <div
              style={{
                fontSize:
                  "12px",
                opacity:
                  0.7,
              }}
            >
              STRONGEST NUMERIC
              RELATIONSHIP
            </div>

            <strong
              style={{
                fontSize:
                  "18px",
              }}
            >
              {
                strongest.column
              }
            </strong>

            <div
              style={{
                marginTop:
                  "6px",
              }}
            >
              Correlation with{" "}
              <strong>
                LoanApproved
              </strong>
              :{" "}
              <strong>
                {strongest.value.toFixed(
                  4
                )}
              </strong>
            </div>

          </div>
        )}

        {/* MISSING DATA */}

        {analysis.missing_values && (
          <div
            style={{
              padding:
                "16px",
              borderRadius:
                "12px",
              background:
                "rgba(245,158,11,0.08)",
            }}
          >

            <div
              style={{
                fontSize:
                  "12px",
                opacity:
                  0.7,
                marginBottom:
                  "10px",
              }}
            >
              MISSING DATA
            </div>

            {Object.entries(
              analysis
                .missing_values
            )
              .filter(
                ([, data]) =>
                  getMissingCount(
                    data
                  ) > 0
              )
              .map(
                ([
                  column,
                  data,
                ]) => (
                  <div
                    key={
                      column
                    }
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      padding:
                        "7px 0",
                    }}
                  >

                    <span>
                      {column}
                    </span>

                    <strong>
                      {
                        getMissingCount(
                          data
                        )
                      }{" "}
                      (
                      {getMissingPercentage(
                        data
                      ).toFixed(
                        2
                      )}
                      %)
                    </strong>

                  </div>
                )
              )}

            {Object.values(
              analysis
                .missing_values
            ).every(
              (data) =>
                getMissingCount(
                  data
                ) === 0
            ) && (
              <div>
                No missing values
                detected.
              </div>
            )}

          </div>
        )}

        {/* OUTLIERS */}

        {analysis.outliers && (
          <div
            style={{
              padding:
                "16px",
              borderRadius:
                "12px",
              background:
                "rgba(239,68,68,0.07)",
            }}
          >

            <div
              style={{
                fontSize:
                  "12px",
                opacity:
                  0.7,
                marginBottom:
                  "10px",
              }}
            >
              OUTLIER CHECK
            </div>

            {Object.entries(
              analysis.outliers
            )
              .filter(
                ([, data]) =>
                  Number(
                    data?.count
                  ) > 0
              )
              .map(
                ([
                  column,
                  data,
                ]) => (
                  <div
                    key={
                      column
                    }
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      padding:
                        "7px 0",
                    }}
                  >

                    <span>
                      {column}
                    </span>

                    <strong>
                      {
                        data.count
                      }{" "}
                      (
                      {
                        data.percentage
                      }
                      %)
                    </strong>

                  </div>
                )
              )}

            {Object.values(
              analysis.outliers
            ).every(
              (data) =>
                Number(
                  data?.count
                ) === 0
            ) && (
              <div>
                No outliers detected.
              </div>
            )}

          </div>
        )}

        {/* VALIDATION */}

        {analysis.numeric_statistics && (
          <div
            style={{
              padding:
                "16px",
              borderRadius:
                "12px",
              background:
                "rgba(239,68,68,0.06)",
            }}
          >

            <div
              style={{
                fontSize:
                  "12px",
                opacity:
                  0.7,
                marginBottom:
                  "10px",
              }}
            >
              DATA VALIDATION
            </div>

            {[
              "Income",
              "LoanAmount",
            ].map(
              (column) => {

                const stats =
                  analysis
                    .numeric_statistics
                    ?.[column];

                if (!stats) {
                  return null;
                }

                if (
                  Number(
                    stats.minimum
                  ) >= 0
                ) {
                  return null;
                }

                return (
                  <div
                    key={
                      column
                    }
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      padding:
                        "7px 0",
                    }}
                  >

                    <span>
                      ⚠️ Negative{" "}
                      {column}
                    </span>

                    <strong>
                      Minimum:{" "}
                      {
                        stats.minimum
                      }
                    </strong>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div
      className="recent-card"
      style={{
        padding:
          "60px 20px",
        textAlign:
          "center",
      }}
    >

      <Icon
        size={48}
        style={{
          opacity:
            0.5,
        }}
      />

      <h2
        style={{
          marginTop:
            "16px",
        }}
      >
        {title}
      </h2>

      <p>
        {description}
      </p>

      <button
        className="hero-button"
        onClick={onClick}
        type="button"
        style={{
          marginTop:
            "20px",
        }}
      >
        <Upload size={18} />
        {buttonText}
      </button>

    </div>
  );
}

export default App;

                

                




