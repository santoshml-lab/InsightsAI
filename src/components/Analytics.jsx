import { BarChart3, FileText } from "lucide-react";

function Analytics({ analysis }) {
  if (!analysis) {
    return (
      <div className="recent-card">
        <div className="card-header">
          <div>
            <h3>No Dataset Available</h3>
            <p>
              Upload a CSV dataset from the Dashboard
              to view analytics.
            </p>
          </div>

          <BarChart3 size={20} />
        </div>
      </div>
    );
  }

  const correlations =
    analysis?.correlations?.LoanApproved || {};

  const sortedCorrelations = Object.entries(
    correlations
  )
    .filter(
      ([column]) => column !== "LoanApproved"
    )
    .sort(
      ([, a], [, b]) =>
        Math.abs(Number(b)) -
        Math.abs(Number(a))
    );

  return (
    <section className="dashboard">

      {/* PAGE HEADER */}

      <div className="section-heading">
        <div>
          <h2>Analytics</h2>
          <p>
            Explore the statistical patterns
            detected in your dataset.
          </p>
        </div>

        <BarChart3 size={24} />
      </div>

      {/* SUMMARY */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon">
              <FileText size={20} />
            </div>

            <span className="stat-change">
              Dataset
            </span>
          </div>

          <div className="stat-value">
            {analysis.summary?.rows ?? "—"}
          </div>

          <div className="stat-title">
            Rows
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon">
              <BarChart3 size={20} />
            </div>

            <span className="stat-change">
              Detected
            </span>
          </div>

          <div className="stat-value">
            {analysis.summary?.columns ?? "—"}
          </div>

          <div className="stat-title">
            Columns
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon">
              <BarChart3 size={20} />
            </div>

            <span className="stat-change">
              Analysis
            </span>
          </div>

          <div className="stat-value">
            {sortedCorrelations.length}
          </div>

          <div className="stat-title">
            Correlations
          </div>
        </div>

      </div>

      {/* CORRELATION */}

      <div
        className="chart-card"
        style={{
          marginTop: "24px",
        }}
      >

        <div className="card-header">

          <div>
            <h3>
              Loan Approval Correlation
            </h3>

            <p>
              Relationship between numeric
              features and LoanApproved.
            </p>
          </div>

          <BarChart3 size={20} />

        </div>

        <div
          style={{
            padding: "20px",
            display: "grid",
            gap: "18px",
          }}
        >

          {sortedCorrelations.length > 0 ? (

            sortedCorrelations.map(
              ([column, value]) => {

                const correlation =
                  Number(value);

                const percentage =
                  Math.min(
                    Math.abs(correlation) * 100,
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
                        alignItems: "center",
                      }}
                    >

                      <strong>
                        {column}
                      </strong>

                      <span>
                        {correlation.toFixed(3)}
                      </span>

                    </div>

                    <div
                      style={{
                        height: "8px",
                        borderRadius: "10px",
                        background:
                          "rgba(255,255,255,0.08)",
                        overflow: "hidden",
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
                          borderRadius: "10px",
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

          ) : (

            <p>
              Correlation data is not available.
            </p>

          )}

        </div>

      </div>

      {/* COLUMNS */}

      <div
        className="chart-card"
        style={{
          marginTop: "24px",
        }}
      >

        <div className="card-header">

          <div>
            <h3>
              Dataset Columns
            </h3>

            <p>
              Fields detected in your dataset.
            </p>
          </div>

          <FileText size={20} />

        </div>

        <div
          style={{
            padding: "20px",
          }}
        >

          {analysis.columns?.length > 0 ? (

            analysis.columns.map(
              (column) => (
                <div
                  key={column}
                  style={{
                    padding: "12px 0",
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

    </section>
  );
}

export default Analytics;
