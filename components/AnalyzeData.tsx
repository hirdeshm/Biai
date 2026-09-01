"use client";

import { useState } from "react";

interface AnalyzeDataProps {
  file: File | null;
  dataType: string;
}

interface Cause {
  cause: string;
  confidence: number;
  evidence: string[];
}

interface Recommendation {
  action: string;
  priority: string;
  reason: string;
}

interface AIFeedback {
  summary?: string;
  severity?: string;
  likely_causes?: Cause[];
  recommendations?: Recommendation[];
  uncertainty?: string;
}

interface AnalysisResponse {
  success: boolean;
  filename: string;
  data_type: string;
  rows: number;
  columns: string[];
  analysis?: any;
  llm_evidence?: any;
  ai_feedback?: AIFeedback | string;
}

export default function AnalyzeData({
  file,
  dataType,
}: AnalyzeDataProps) {
  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<AnalysisResponse | null>(null);

  const [error, setError] = useState("");

  const analyzeData = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("data_type", dataType);

      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data: AnalysisResponse =
        await response.json();

      console.log("FastAPI Response:", data);

      setResult(data);

    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to FastAPI. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Parse AI response if FastAPI returns
   * JSON as a string.
   */
  const getFeedback = (): AIFeedback | null => {
    if (!result?.ai_feedback) {
      return null;
    }

    if (
      typeof result.ai_feedback === "object"
    ) {
      return result.ai_feedback;
    }

    try {
      const cleaned = result.ai_feedback
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleaned);
    } catch {
      return {
        summary: result.ai_feedback,
      };
    }
  };

  const feedback = getFeedback();

  return (
    <div className="mt-8">

      {/* ================= HEADER ================= */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-medium text-purple-600">
              AI Analytics
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              Business Intelligence Analysis
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              AI-powered analysis of your uploaded business data.
            </p>

          </div>

          <button
            type="button"
            onClick={analyzeData}
            disabled={!file || loading}
            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Data"}
          </button>

        </div>

        {/* ================= FILE INFO ================= */}

        {file && (
          <div className="mt-5 rounded-lg bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
              Selected File
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {file.name}
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

      </div>

      {/* ================= RESULTS ================= */}

      {result && (
        <div className="mt-6 space-y-6">

          {/* ================= BASIC ANALYSIS ================= */}

          {result.analysis?.kpi && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">

              <h3 className="text-xl font-semibold text-gray-900">
                KPI Analysis
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    KPI
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {result.analysis.kpi.name}
                  </p>

                </div>

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    ₹
                    {result.analysis.kpi.total?.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Average
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    ₹
                    {result.analysis.kpi.average?.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Change
                  </p>

                  <p
                    className={`mt-1 text-lg font-semibold ${
                      result.analysis.kpi
                        .change_percent < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {result.analysis.kpi
                      .change_percent > 0
                      ? "+"
                      : ""}
                    {result.analysis.kpi.change_percent}
                    %
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ================= AI FEEDBACK ================= */}

          {feedback && (
            <div className="rounded-2xl border border-purple-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-purple-600">
                    AI Business Insight
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-gray-900">
                    What the AI found
                  </h3>

                </div>

                {feedback.severity && (
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      feedback.severity ===
                      "CRITICAL"
                        ? "bg-red-100 text-red-700"
                        : feedback.severity ===
                          "HIGH"
                        ? "bg-orange-100 text-orange-700"
                        : feedback.severity ===
                          "MEDIUM"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {feedback.severity}
                  </span>
                )}

              </div>

              {/* Summary */}

              {feedback.summary && (
                <div className="mt-6 rounded-xl bg-purple-50 p-5">

                  <p className="text-sm font-semibold text-purple-700">
                    Executive Summary
                  </p>

                  <p className="mt-2 text-base leading-7 text-gray-700">
                    {feedback.summary}
                  </p>

                </div>
              )}

              {/* Likely Causes */}

              {feedback.likely_causes &&
                feedback.likely_causes.length >
                  0 && (

                  <div className="mt-6">

                    <h4 className="text-lg font-semibold text-gray-900">
                      Likely Causes
                    </h4>

                    <div className="mt-4 space-y-4">

                      {feedback.likely_causes.map(
                        (cause, index) => (
                          <div
                            key={index}
                            className="rounded-xl border p-5"
                          >

                            <div className="flex flex-col justify-between gap-2 sm:flex-row">

                              <h5 className="font-semibold text-gray-900">
                                {cause.cause}
                              </h5>

                              <span className="font-semibold text-purple-600">
                                {cause.confidence}%
                                confidence
                              </span>

                            </div>

                            {cause.evidence &&
                              cause.evidence
                                .length > 0 && (

                                <div className="mt-4">

                                  <p className="text-sm font-medium text-gray-500">
                                    Evidence
                                  </p>

                                  <ul className="mt-2 space-y-2">

                                    {cause.evidence.map(
                                      (
                                        evidence,
                                        evidenceIndex
                                      ) => (
                                        <li
                                          key={
                                            evidenceIndex
                                          }
                                          className="flex gap-2 text-sm text-gray-700"
                                        >
                                          <span>
                                            •
                                          </span>

                                          <span>
                                            {evidence}
                                          </span>
                                        </li>
                                      )
                                    )}

                                  </ul>

                                </div>
                              )}

                          </div>
                        )
                      )}

                    </div>

                  </div>
                )}

              {/* Recommendations */}

              {feedback.recommendations &&
                feedback.recommendations.length >
                  0 && (

                  <div className="mt-6">

                    <h4 className="text-lg font-semibold text-gray-900">
                      Recommended Actions
                    </h4>

                    <div className="mt-4 space-y-4">

                      {feedback.recommendations.map(
                        (recommendation, index) => (
                          <div
                            key={index}
                            className="rounded-xl border border-green-200 bg-green-50 p-5"
                          >

                            <div className="flex flex-col justify-between gap-2 sm:flex-row">

                              <h5 className="font-semibold text-gray-900">
                                {recommendation.action}
                              </h5>

                              <span className="text-sm font-semibold text-green-700">
                                {
                                  recommendation.priority
                                }{" "}
                                Priority
                              </span>

                            </div>

                            {recommendation.reason && (
                              <p className="mt-2 text-sm leading-6 text-gray-600">
                                {
                                  recommendation.reason
                                }
                              </p>
                            )}

                          </div>
                        )
                      )}

                    </div>

                  </div>
                )}

              {/* Uncertainty */}

              {feedback.uncertainty && (
                <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">

                  <p className="text-sm font-semibold text-yellow-800">
                    Uncertainty
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {feedback.uncertainty}
                  </p>

                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}