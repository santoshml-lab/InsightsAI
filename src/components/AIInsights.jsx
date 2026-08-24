import {
  Brain,
  Lightbulb,
  Sparkles,
  Rocket,
} from "lucide-react";

function AIInsights({ insights, loading }) {

  // =====================================================
  // FORMAT AI RESPONSE
  // =====================================================

  const formatAIInsights = (text) => {
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

      const lower =
        cleanLine.toLowerCase();

      const isHeading =
        lower.includes("key insights") ||
        lower.includes("key findings") ||
        lower.includes("data quality") ||
        lower.includes("important patterns") ||
        lower.includes("patterns") ||
        lower.includes("business implications") ||
        lower.includes(
          "possible business implications"
        ) ||
        lower.includes(
          "recommended next steps"
        ) ||
        lower.includes("next steps");

      if (isHeading) {

        currentSection = {
          title: cleanLine,
          items: [],
        };

        sections.push(
          currentSection
        );

        return;
      }

      if (!currentSection) {

        currentSection = {
          title: "AI Analysis",
          items: [],
        };

        sections.push(
          currentSection
        );
      }

      const cleanedItem = line
        .replace(/^[-*•]\s*/, "")
        .replace(/^\d+\.\s*/, "")
        .replace(/^>\s*/, "")
        .trim();

      if (cleanedItem) {
        currentSection.items.push(
          cleanedItem
        );
      }

    });

    return sections;
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!insights && !loading) {
    return (
      <section className="dashboard">

        <div className="section-heading">

          <div>
            <h2>
              AI Insights
            </h2>

            <p>
              AI-powered findings from
              your dataset.
            </p>
          </div>

          <Brain size={24} />

        </div>

        <div className="recent-card">

          <div className="card-header">

            <div>
              <h3>
                No Insights Yet
              </h3>

              <p>
                Upload and analyze a CSV
                dataset from the Dashboard
                to generate AI insights.
              </p>
            </div>

            <Lightbulb size={20} />

          </div>

        </div>

      </section>
    );
  }

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="dashboard">

        <div className="section-heading">

          <div>
            <h2>
              AI Insights
            </h2>

            <p>
              Your dataset is being
              analyzed by AI.
            </p>
          </div>

          <Sparkles size={24} />

        </div>

        <div className="recent-card">

          <div
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                fontSize: "36px",
                marginBottom: "12px",
              }}
            >
              ✨
            </div>

            <h3>
              AI is analyzing your data...
            </h3>

            <p>
              Finding patterns,
              relationships and
              business insights.
            </p>

          </div>

        </div>

      </section>
    );
  }

  const sections =
    formatAIInsights(insights);

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <section className="dashboard">

      {/* PAGE HEADER */}

      <div className="section-heading">

        <div>

          <h2>
            AI Insights
          </h2>

          <p>
            Intelligent findings generated
            from your dataset.
          </p>

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Sparkles size={22} />
          <span>
            AI Powered
          </span>
        </div>

      </div>

      {/* INSIGHTS */}

      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >

        {sections.map(
          (section, index) => {

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

            let icon = "✨";

            if (isQuality) {
              icon = "⚠️";
            } else if (isPattern) {
              icon = "🔍";
            } else if (isBusiness) {
              icon = "💼";
            } else if (
              isRecommendation
            ) {
              icon = "🚀";
            } else if (isFinding) {
              icon = "💡";
            }

            return (
              <div
                key={index}
                className="recent-card"
              >

                {/* HEADER */}

                <div className="card-header">

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "22px",
                      }}
                    >
                      {icon}
                    </div>

                    <h3>
                      {section.title}
                    </h3>

                  </div>

                  {isBusiness ? (
                    <Rocket size={20} />
                  ) : isFinding ? (
                    <Lightbulb size={20} />
                  ) : (
                    <Brain size={20} />
                  )}

                </div>

                {/* ITEMS */}

                <div
                  style={{
                    padding: "20px",
                    display: "grid",
                    gap: "12px",
                  }}
                >

                  {section.items.map(
                    (
                      item,
                      itemIndex
                    ) => (

                      <div
                        key={itemIndex}
                        style={{
                          display: "flex",
                          gap: "12px",
                          lineHeight: "1.6",
                        }}
                      >

                        <span
                          style={{
                            minWidth:
                              "20px",
                            opacity: 0.7,
                            fontWeight:
                              "600",
                          }}
                        >
                          {isRecommendation
                            ? `${itemIndex + 1}.`
                            : "•"}
                        </span>

                        <span>
                          {item}
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

    </section>
  );
}

export default AIInsights;
