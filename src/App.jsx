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
} from "lucide-react";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    {
      title: "Total Documents",
      value: "24",
      change: "+12%",
      icon: FileText,
    },
    {
      title: "AI Insights",
      value: "186",
      change: "+24%",
      icon: Lightbulb,
    },
    {
      title: "Analyses",
      value: "342",
      change: "+18%",
      icon: BarChart3,
    },
    {
      title: "AI Accuracy",
      value: "94.8%",
      change: "+3.2%",
      icon: Brain,
    },
  ];

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

        <div className="logo">
          <div className="logo-icon">
            <Sparkles size={22} />
          </div>

          {sidebarOpen && (
            <div>
              <h2>InsightsAI</h2>
              <span>Intelligent Analytics</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">

          <a className="nav-item active" href="#">
            <Home size={19} />
            {sidebarOpen && <span>Dashboard</span>}
          </a>

          <a className="nav-item" href="#">
            <FileText size={19} />
            {sidebarOpen && <span>Documents</span>}
          </a>

          <a className="nav-item" href="#">
            <BarChart3 size={19} />
            {sidebarOpen && <span>Analytics</span>}
          </a>

          <a className="nav-item" href="#">
            <Lightbulb size={19} />
            {sidebarOpen && <span>AI Insights</span>}
          </a>

        </nav>

        <div className="sidebar-bottom">

          <a className="nav-item" href="#">
            <Settings size={19} />
            {sidebarOpen && <span>Settings</span>}
          </a>

        </div>

      </aside>


      {/* MAIN */}

      <main className={`main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

        {/* TOPBAR */}

        <header className="topbar">

          <button
            className="menu-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={22} />
          </button>

          <div className="topbar-title">
            <h1>Dashboard</h1>
            <p>Welcome back to your AI analytics workspace.</p>
          </div>

          <div className="topbar-actions">

            <button className="upload-button">
              <Upload size={17} />
              Upload Document
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
                <span> intelligent insights.</span>
              </h2>

              <p>
                Upload your documents, analyze your data,
                and let AI uncover the insights that matter.
              </p>
            </div>

            <button className="hero-button">
              <Brain size={18} />
              Generate AI Insight
            </button>

          </div>


          {/* STATS */}

          <div className="stats-grid">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (
                <div className="stat-card" key={stat.title}>

                  <div className="stat-top">

                    <div className="stat-icon">
                      <Icon size={20} />
                    </div>

                    <span className="stat-change">
                      {stat.change}
                    </span>

                  </div>

                  <div className="stat-value">
                    {stat.value}
                  </div>

                  <div className="stat-title">
                    {stat.title}
                  </div>

                </div>
              );

            })}

          </div>


          {/* ANALYTICS */}

          <div className="section-heading">

            <div>
              <h2>Analytics Overview</h2>
              <p>
                Monitor your AI-powered analysis activity.
              </p>
            </div>

            <button className="period-button">
              Last 30 days
            </button>

          </div>


          <div className="analytics-grid">

            <div className="chart-card">

              <div className="card-header">

                <div>
                  <h3>Analysis Activity</h3>
                  <p>Documents analyzed over time</p>
                </div>

                <BarChart3 size={20} />

              </div>

              <div className="chart-placeholder">

                <div className="chart-bars">

                  {[45, 70, 55, 85, 65, 95, 75, 88, 62, 92, 78, 100].map(
                    (height, index) => (
                      <div
                        className="chart-bar"
                        style={{ height: `${height}%` }}
                        key={index}
                      />
                    )
                  )}

                </div>

              </div>

            </div>


            {/* AI INSIGHTS */}

            <div className="insights-card">

              <div className="card-header">

                <div>
                  <h3>Latest AI Insights</h3>
                  <p>Generated from your data</p>
                </div>

                <Sparkles size={20} />

              </div>

              <div className="insight-list">

                <div className="insight-item">

                  <div className="insight-number">
                    01
                  </div>

                  <div>
                    <strong>
                      Revenue growth detected
                    </strong>

                    <p>
                      Your latest dataset shows
                      a positive growth trend.
                    </p>
                  </div>

                </div>


                <div className="insight-item">

                  <div className="insight-number">
                    02
                  </div>

                  <div>
                    <strong>
                      Customer engagement improved
                    </strong>

                    <p>
                      Engagement increased compared
                      with the previous period.
                    </p>
                  </div>

                </div>


                <div className="insight-item">

                  <div className="insight-number">
                    03
                  </div>

                  <div>
                    <strong>
                      Potential optimization area
                    </strong>

                    <p>
                      AI identified an opportunity
                      for further analysis.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* RECENT DOCUMENTS */}

          <div className="recent-card">

            <div className="card-header">

              <div>
                <h3>Recent Documents</h3>
                <p>Your latest uploaded files</p>
              </div>

              <button className="view-button">
                View All
              </button>

            </div>

            <div className="document-row">

              <div className="document-info">

                <div className="document-icon">
                  <FileText size={19} />
                </div>

                <div>
                  <strong>Sales_Report.pdf</strong>
                  <span>Analyzed recently</span>
                </div>

              </div>

              <span className="status">
                Analyzed
              </span>

            </div>


            <div className="document-row">

              <div className="document-info">

                <div className="document-icon">
                  <FileText size={19} />
                </div>

                <div>
                  <strong>Business_Analysis.pdf</strong>
                  <span>Analyzed recently</span>
                </div>

              </div>

              <span className="status">
                Analyzed
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;
