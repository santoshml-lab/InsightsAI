
import {
  BarChart3,
  FileText,
  Home,
  Lightbulb,
  Settings,
  Sparkles,
} from "lucide-react";

function Sidebar({
  sidebarOpen,
  activePage,
  setActivePage,
}) {
  return (
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

      {/* NAVIGATION */}

      <nav className="sidebar-nav">

        {/* DASHBOARD */}

        <button
          type="button"
          className={`nav-item ${
            activePage === "dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActivePage("dashboard")
          }
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
          type="button"
          className={`nav-item ${
            activePage === "documents"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActivePage("documents")
          }
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
          type="button"
          className={`nav-item ${
            activePage === "analytics"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActivePage("analytics")
          }
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
          type="button"
          className={`nav-item ${
            activePage === "insights"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActivePage("insights")
          }
        >
          <Lightbulb size={19} />

          {sidebarOpen && (
            <span>
              AI Insights
            </span>
          )}
        </button>

      </nav>

      {/* BOTTOM */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className={`nav-item ${
            activePage === "settings"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActivePage("settings")
          }
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
  );
}

export default Sidebar;
