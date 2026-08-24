import {
  FileText,
  Upload,
  Database,
  CheckCircle,
  Trash2,
} from "lucide-react";

function Documents({
  file,
  analysis,
  onUpload,
  onClear,
}) {
  return (
    <section className="dashboard">

      {/* PAGE HEADER */}

      <div className="section-heading">
        <div>
          <h2>Documents</h2>

          <p>
            Manage your uploaded datasets
            and analysis history.
          </p>
        </div>

        <FileText size={24} />
      </div>

      {/* NO DATASET */}

      {!file && (
        <div className="recent-card">

          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 16px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "rgba(99,102,241,0.12)",
              }}
            >
              <FileText size={30} />
            </div>

            <h3>
              No Dataset Uploaded
            </h3>

            <p
              style={{
                marginTop: "8px",
                opacity: 0.7,
              }}
            >
              Upload a CSV dataset to
              start your analysis.
            </p>

            <button
              className="view-button"
              onClick={onUpload}
              type="button"
              style={{
                marginTop: "20px",
              }}
            >
              <Upload size={16} />
              Upload CSV
            </button>

          </div>

        </div>
      )}

      {/* CURRENT DATASET */}

      {file && (
        <div
          className="recent-card"
          style={{
            marginTop: "24px",
          }}
        >

          {/* HEADER */}

          <div className="card-header">

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >

              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "rgba(99,102,241,0.12)",
                }}
              >
                <FileText size={21} />
              </div>

              <div>

                <h3>
                  {file.name}
                </h3>

                <p>
                  CSV Dataset
                </p>

              </div>

            </div>

            <button
              className="view-button"
              onClick={onClear}
              type="button"
            >
              <Trash2 size={16} />
              Clear
            </button>

          </div>

          {/* DATASET DETAILS */}

          <div
            style={{
              padding: "20px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
            }}
          >

            {/* FILE STATUS */}

            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.04)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <CheckCircle size={17} />

                <small>
                  Status
                </small>
              </div>

              <strong>
                {analysis
                  ? "Analyzed"
                  : "Processing"}
              </strong>

            </div>

            {/* ROWS */}

            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.04)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <Database size={17} />

                <small>
                  Rows
                </small>
              </div>

              <strong>
                {analysis?.summary?.rows ??
                  "—"}
              </strong>

            </div>

            {/* COLUMNS */}

            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.04)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <FileText size={17} />

                <small>
                  Columns
                </small>
              </div>

              <strong>
                {analysis?.summary?.columns ??
                  "—"}
              </strong>

            </div>

            {/* MISSING VALUES */}

            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.04)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <Database size={17} />

                <small>
                  Missing Values
                </small>
              </div>

              <strong>
                {analysis?.summary
                  ?.total_missing_values ??
                  "—"}
              </strong>

            </div>

          </div>

        </div>
      )}

      {/* DATASET INFORMATION */}

      {analysis && (
        <div
          className="recent-card"
          style={{
            marginTop: "24px",
          }}
        >

          <div className="card-header">

            <div>
              <h3>
                Dataset Information
              </h3>

              <p>
                Overview of the analyzed
                dataset.
              </p>
            </div>

            <Database size={20} />

          </div>

          <div
            style={{
              padding: "20px",
              display: "grid",
              gap: "12px",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "12px 0",
                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span>
                Duplicate Rows
              </span>

              <strong>
                {analysis.summary
                  ?.duplicate_rows ??
                  "0"}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "12px 0",
                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span>
                Total Missing Values
              </span>

              <strong>
                {analysis.summary
                  ?.total_missing_values ??
                  "0"}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "12px 0",
              }}
            >
              <span>
                Analysis Status
              </span>

              <strong>
                Completed
              </strong>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default Documents;
