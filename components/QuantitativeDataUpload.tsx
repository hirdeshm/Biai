"use client";

import { useState } from "react";

type DataType =
  | "sales"
  | "customers"
  | "products"
  | "marketing"
  | "web_analytics"
  | "inventory";

interface Template {
  label: string;
  description: string;
  columns: string[];
  sample: string[][];
}

interface Dataset {
  file: File | null;
  filename: string;
  rows: number | null;
  analyzed: boolean;
  analysis: any | null;
  loading: boolean;
  message: string;
}

interface QuantitativeDataUploadProps {
  onUpload: (file: File, dataType: string) => void;
  onAnalyze?: (dataType: string, result: any) => void;
 // onAnalyzeAll?: (analyses: Record<string, any>) => void;
}

const DATA_TYPES: DataType[] = [
  "sales",
  "customers",
  "products",
  "marketing",
  "web_analytics",
  "inventory",
];

const templates: Record<DataType, Template> = {
  sales: {
    label: "Sales / Revenue Data",
    description:
      "Orders, revenue, region, product and sales channel data",
    columns: [
      "date",
      "order_id",
      "customer_id",
      "product_id",
      "region",
      "sales_channel",
      "quantity",
      "unit_price",
      "discount",
      "revenue",
      "order_status",
    ],
    sample: [
      [
        "2026-08-01",
        "ORD001",
        "CUS001",
        "PROD001",
        "North",
        "Online",
        "2",
        "5000",
        "500",
        "9500",
        "Completed",
      ],
      [
        "2026-08-02",
        "ORD002",
        "CUS002",
        "PROD002",
        "West",
        "Retail",
        "1",
        "8000",
        "0",
        "8000",
        "Completed",
      ],
    ],
  },

  customers: {
    label: "Customer Data",
    description:
      "Customer segments, regions and purchasing information",
    columns: [
      "customer_id",
      "customer_segment",
      "region",
      "customer_type",
      "acquisition_date",
      "previous_revenue",
      "current_revenue",
    ],
    sample: [
      [
        "CUS001",
        "Enterprise",
        "North",
        "Returning",
        "2025-03-12",
        "50000",
        "42000",
      ],
      [
        "CUS002",
        "SMB",
        "West",
        "New",
        "2026-02-10",
        "0",
        "18000",
      ],
    ],
  },

  products: {
    label: "Product Data",
    description:
      "Product pricing, category and inventory information",
    columns: [
      "product_id",
      "product_name",
      "category",
      "price",
      "cost",
      "inventory",
      "region",
    ],
    sample: [
      [
        "PROD001",
        "Product A",
        "Electronics",
        "5000",
        "3200",
        "450",
        "North",
      ],
      [
        "PROD002",
        "Product B",
        "Furniture",
        "8000",
        "5200",
        "120",
        "West",
      ],
    ],
  },

  marketing: {
    label: "Marketing Data",
    description:
      "Campaign spending, traffic and conversion metrics",
    columns: [
      "date",
      "campaign",
      "region",
      "spend",
      "impressions",
      "clicks",
      "conversions",
      "conversion_rate",
    ],
    sample: [
      [
        "2026-08-01",
        "Summer Sale",
        "North",
        "50000",
        "500000",
        "20000",
        "1200",
        "0.06",
      ],
      [
        "2026-08-02",
        "Product Launch",
        "West",
        "75000",
        "700000",
        "28000",
        "1400",
        "0.05",
      ],
    ],
  },

  web_analytics: {
    label: "Website / App Analytics",
    description:
      "Traffic, product views, cart activity and conversion",
    columns: [
      "date",
      "region",
      "visitors",
      "product_views",
      "add_to_cart",
      "orders",
      "conversion_rate",
      "error_rate",
    ],
    sample: [
      [
        "2026-08-01",
        "North",
        "100000",
        "40000",
        "8000",
        "2000",
        "0.02",
        "0.01",
      ],
      [
        "2026-08-02",
        "West",
        "95000",
        "36000",
        "7000",
        "1500",
        "0.015",
        "0.04",
      ],
    ],
  },

  inventory: {
    label: "Inventory / Supply Chain",
    description:
      "Stock levels, safety stock and delivery performance",
    columns: [
      "date",
      "product_id",
      "region",
      "stock_level",
      "safety_stock",
      "stockout_hours",
      "delivery_delay_days",
    ],
    sample: [
      [
        "2026-08-01",
        "PROD001",
        "North",
        "250",
        "100",
        "0",
        "1",
      ],
      [
        "2026-08-02",
        "PROD002",
        "West",
        "20",
        "100",
        "12",
        "3",
      ],
    ],
  },
};

const createEmptyDataset = (): Dataset => ({
  file: null,
  filename: "",
  rows: null,
  analyzed: false,
  analysis: null,
  loading: false,
  message: "",
});

const createInitialDatasets = (): Record<DataType, Dataset> => ({
  sales: createEmptyDataset(),
  customers: createEmptyDataset(),
  products: createEmptyDataset(),
  marketing: createEmptyDataset(),
  web_analytics: createEmptyDataset(),
  inventory: createEmptyDataset(),
});

export default function QuantitativeDataUpload({
  onUpload,
  onAnalyze,
 // onAnalyzeAll,
}: QuantitativeDataUploadProps) {

  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [datasets, setDatasets] =
    useState<Record<DataType, Dataset>>(createInitialDatasets);

  const [activeTemplate, setActiveTemplate] =
    useState<DataType | null>(null);

  const [dragActive, setDragActive] =
    useState<DataType | null>(null);

  const [globalMessage, setGlobalMessage] = useState("");

  const connectedCount = DATA_TYPES.filter(
    (type) => datasets[type].file !== null
  ).length;

  const analyzedCount = DATA_TYPES.filter(
    (type) => datasets[type].analyzed
  ).length;

  // --------------------------------------------------
  // Download CSV template
  // --------------------------------------------------

  const downloadTemplate = (dataType: DataType) => {
    const template = templates[dataType];

    const header = template.columns.join(",");

    const rows = template.sample.map((row) =>
      row
        .map((value) => {
          const stringValue = String(value);

          if (
            stringValue.includes(",") ||
            stringValue.includes('"')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }

          return stringValue;
        })
        .join(",")
    );

    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${dataType}_template.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------
  // Handle file
  // --------------------------------------------------

  const handleFile = (
  dataType: DataType,
  selectedFile: File | undefined
  ) => {
  if (!selectedFile) return;

  if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
    updateDataset(dataType, {
      message: "Please upload a CSV file.",
    });

    return;
  }

  updateDataset(dataType, {
    file: selectedFile,
    filename: selectedFile.name,
    rows: null,
    analyzed: false,
    analysis: null,
    message: "",
  });

  onUpload(selectedFile, dataType);

  setGlobalMessage(
    `${templates[dataType].label} uploaded successfully.`
  );
};

  // --------------------------------------------------
  // Update individual dataset
  // --------------------------------------------------

  const updateDataset = (
    dataType: DataType,
    updates: Partial<Dataset>
  ) => {
    setDatasets((previous) => ({
      ...previous,
      [dataType]: {
        ...previous[dataType],
        ...updates,
      },
    }));
  };

  // --------------------------------------------------
  // Individual Analyze
  // --------------------------------------------------

  const analyzeDataset = async (dataType: DataType) => {
    const dataset = datasets[dataType];

    if (!dataset.file) {
      updateDataset(dataType, {
        message: "Please upload a CSV file first.",
      });

      return;
    }

    updateDataset(dataType, {
      loading: true,
      message: "Analyzing data...",
    });

    try {
      const formData = new FormData();

      formData.append("file", dataset.file);
      formData.append("data_type", dataType);

      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.error ||
            `Analysis failed with status ${response.status}`
        );
      }

      const result = await response.json();

      console.log(
        `${dataType} analysis:`,
        result
      );


        // if (onAnalyze) {
        //   onAnalyze(dataType, result);
        // }

      updateDataset(dataType, {
        loading: false,
        analyzed: true,
        analysis: result,
        rows: result.rows ?? null,
        message: "Analysis completed successfully.",
      });

      // Send to parent
     // onUpload(dataset.file, dataType);

      if (onAnalyze) {
        onAnalyze(dataType, result);
      }

      setGlobalMessage(
        `${templates[dataType].label} analyzed successfully.`
      );
    } catch (error) {
      console.error(
        `${dataType} analysis error:`,
        error
      );

      updateDataset(dataType, {
        loading: false,
        analyzed: false,
       message:
        error instanceof Error
       ? error.message
       : "Analysis failed.",
      });
    }
  };

  // --------------------------------------------------
  // Analyze All
  // --------------------------------------------------

 const analyzeAllWithAI = async () => {
  const analyzedDatasets: Record<string, any> = {};

  DATA_TYPES.forEach((type) => {
    const dataset = datasets[type];

    if (
      dataset.file &&
      dataset.analyzed &&
      dataset.analysis
    ) {
      analyzedDatasets[type] =
        dataset.analysis.evidence ??
        dataset.analysis.analysis ??
        dataset.analysis;
    }
  });

  if (Object.keys(analyzedDatasets).length === 0) {
    setGlobalMessage(
      "Please analyze at least one data source before using Analyze All with AI."
    );
    return;
  }

  try {
    setAiLoading(true);
    setAiResult(null);

    setGlobalMessage(
      "Sending analyzed business evidence to AI..."
    );

    const response = await fetch(
      "http://127.0.0.1:8000/analyze-all",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analyzedDatasets),
      }
    );

    if (!response.ok) {
      throw new Error(
        `AI analysis failed: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("FULL AI RESPONSE:", result);
      console.log(
        "AI ANALYSIS:",
        result.ai_analysis
      );
      console.log(
        "AI ANALYSIS TYPE:",
        typeof result.ai_analysis
      );

    

    if (!result.success) {
      throw new Error(
        result.error ||
          "AI cross-source analysis failed"
      );
    }

    // Store AI result so we can display it
   let aiAnalysis = result.ai_analysis.result;

if (typeof aiAnalysis === "string") {
  try {
    aiAnalysis = JSON.parse(aiAnalysis);
  } catch (error) {
    console.error(
      "Could not parse AI analysis:",
      aiAnalysis
    );
  }
}

setAiResult(aiAnalysis);
    setGlobalMessage(
      "AI cross-source analysis completed successfully."
    );

  } catch (error) {
    console.error(
      "Analyze All error:",
      error
    );

    setAiResult(null);

    setGlobalMessage(
      error instanceof Error
        ? error.message
        : "Unable to perform AI cross-source analysis."
    );

  } finally {
    setAiLoading(false);
  }
};

  // --------------------------------------------------
  // Drag & Drop
  // --------------------------------------------------

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dataType: DataType
  ) => {
    e.preventDefault();

    setDragActive(null);

    const droppedFile =
      e.dataTransfer.files[0];

    handleFile(dataType, droppedFile);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Quantitative Data
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Connect your business data sources for
              AI-powered KPI analysis.
            </p>
          </div>

          {/* Connected Count */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-blue-700">
              {connectedCount} / 6
            </p>

            <p className="text-xs font-medium text-blue-600">
              Data Sources Connected
            </p>
          </div>

        </div>

      </div>

      {/* Progress */}
      <div className="mb-7">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-sm font-medium text-gray-700">
            Connection Progress
          </span>

          <span className="text-xs text-gray-500">
            {connectedCount === 6
              ? "All sources connected"
              : `${6 - connectedCount} sources remaining`}
          </span>

        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-purple-600 transition-all duration-500"
            style={{
              width: `${(connectedCount / 6) * 100}%`,
            }}
          />

        </div>

      </div>

      {/* Data Sources */}
      <div className="space-y-4">

        {DATA_TYPES.map((dataType, index) => {

          const dataset = datasets[dataType];
          const template = templates[dataType];

          const isActive =
            activeTemplate === dataType;

          return (
            <div
              key={dataType}
              className={`rounded-xl border transition ${
                dataset.file
                  ? "border-green-200 bg-green-50/30"
                  : "border-gray-200 bg-white"
              }`}
            >

              {/* Card Header */}
              <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

                <div className="flex items-start gap-4">

                  {/* Number */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      dataset.file
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {dataset.file ? "✓" : index + 1}
                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      {template.label}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {template.description}
                    </p>

                    {dataset.file && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Uploaded
                        </span>

                        {dataset.analyzed && (
                          <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                            Analyzed
                          </span>
                        )}

                        <span className="text-xs text-gray-500">
                          {dataset.filename}
                        </span>

                        {dataset.rows !== null && (
                          <span className="text-xs text-gray-500">
                            • {dataset.rows} rows
                          </span>
                        )}

                      </div>
                    )}

                  </div>

                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTemplate(
                        isActive ? null : dataType
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    {isActive
                      ? "Hide Details"
                      : "View Template"}
                  </button>

                  {dataset.file ? (
                    <button
                      type="button"
                      onClick={() =>
                        analyzeDataset(dataType)
                      }
                      disabled={dataset.loading}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {dataset.loading
                        ? "Analyzing..."
                        : dataset.analyzed
                        ? "Re-Analyze"
                        : "Analyze"}
                    </button>
                  ) : null}

                </div>

              </div>

              {/* Expanded Template / Upload Area */}
              {isActive && (
                <div className="border-t border-gray-200 p-5">

                  {/* Required Columns */}
                  <div className="mb-5 rounded-lg bg-gray-50 p-4">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                          Required Columns
                        </p>

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          {template.columns.join(", ")}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          downloadTemplate(dataType)
                        }
                        className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-white"
                      >
                        ↓ Download Template
                      </button>

                    </div>

                  </div>

                  {/* Upload */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(dataType);
                    }}
                    onDragLeave={() => {
                      setDragActive(null);
                    }}
                    onDrop={(e) =>
                      handleDrop(e, dataType)
                    }
                    className={`rounded-xl border-2 border-dashed p-7 text-center transition ${
                      dragActive === dataType
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >

                    <div className="mb-2 text-3xl">
                      📄
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      Drag & drop your CSV file here
                    </p>

                    <p className="my-2 text-xs text-gray-500">
                      or
                    </p>

                    <label className="inline-block cursor-pointer rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">

                      {dataset.file
                        ? "Replace File"
                        : "Browse Files"}

                      <input
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={(e) =>
                          handleFile(
                            dataType,
                            e.target.files?.[0]
                          )
                        }
                      />

                    </label>

                    {dataset.file && (
                      <div className="mx-auto mt-4 max-w-lg rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-left">

                        <p className="text-sm font-medium text-green-800">
                          ✓ {dataset.file.name}
                        </p>

                        <p className="mt-1 text-xs text-green-600">
                          {(
                            dataset.file.size /
                            1024
                          ).toFixed(1)}{" "}
                          KB
                        </p>

                      </div>
                    )}

                  </div>

                  {/* Message */}
                  {dataset.message && (
                    <div
                      className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                        dataset.message.includes(
                          "successfully"
                        )
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {dataset.message}
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* Bottom AI Section */}
      <div className="mt-7 rounded-xl border border-purple-200 bg-purple-50 p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h3 className="font-semibold text-gray-900">
              AI Cross-Source Analysis
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Combine the analyzed evidence from all
              connected data sources to identify
              relationships, root causes and actions.
            </p>

            <div className="mt-2 text-xs text-gray-500">
              {analyzedCount} / {connectedCount} connected
              sources analyzed
            </div>

          </div>

          <button
            type="button"
            onClick={analyzeAllWithAI}
           disabled={analyzedCount === 0 || aiLoading}
            className="shrink-0 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
           {aiLoading
            ? "Analyzing..."
            : "✨ Analyze All with AI"}
          </button>

        </div>

      </div>
              {aiResult && (
          <div className="mt-6 rounded-xl border border-purple-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                AI Business Analysis
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Cross-source insights generated from the
                analyzed business evidence.
              </p>
            </div>

            {/* Summary */}

            {aiResult.summary && (
              <div className="mb-6 rounded-lg bg-purple-50 p-5">
                <h4 className="font-semibold text-gray-900">
                  Executive Summary
                </h4>

                <p className="mt-2 leading-7 text-gray-700">
                  {aiResult.summary}
                </p>
              </div>
            )}

            {/* What Changed */}

            {aiResult.what_changed?.length > 0 && (
              <div className="mb-6">

                <h4 className="mb-3 text-lg font-semibold text-gray-900">
                  What Changed
                </h4>

                <div className="space-y-3">

                  {aiResult.what_changed.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <p className="font-medium text-gray-900">
                          {item.metric}
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {item.change}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          Evidence: {item.evidence}
                        </p>
                      </div>
                    )
                  )}

                </div>
              </div>
            )}

            {/* Likely Causes */}

            {aiResult.likely_causes?.length > 0 && (
              <div className="mb-6">

                <h4 className="mb-3 text-lg font-semibold text-gray-900">
                  Likely Causes
                </h4>

                <div className="space-y-3">

                  {aiResult.likely_causes.map(
                    (cause: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4"
                      >

                        <div className="flex flex-col justify-between gap-2 sm:flex-row">

                          <p className="font-medium text-gray-900">
                            {cause.cause}
                          </p>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            Confidence:{" "}
                            {cause.confidence}%
                          </span>

                        </div>

                        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Relationship:{" "}
                          {cause.relationship}
                        </p>

                        {cause.evidence?.length > 0 && (
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
                            {cause.evidence.map(
                              (
                                evidence: string,
                                evidenceIndex: number
                              ) => (
                                <li key={evidenceIndex}>
                                  {evidence}
                                </li>
                              )
                            )}
                          </ul>
                        )}

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

            {/* Recommendations */}

            {aiResult.recommendations?.length > 0 && (
              <div className="mb-6">

                <h4 className="mb-3 text-lg font-semibold text-gray-900">
                  Recommended Actions
                </h4>

                <div className="space-y-3">

                  {aiResult.recommendations.map(
                    (recommendation: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4"
                      >

                        <div className="flex items-start gap-3">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              recommendation.priority ===
                              "HIGH"
                                ? "bg-red-100 text-red-700"
                                : recommendation.priority ===
                                  "MEDIUM"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {recommendation.priority}
                          </span>

                          <div>

                            <p className="font-medium text-gray-900">
                              {recommendation.action}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              {recommendation.reason}
                            </p>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

            {/* Uncertainty */}

            {aiResult.uncertainty?.length > 0 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5">

                <h4 className="font-semibold text-gray-900">
                  Uncertainty & Limitations
                </h4>

                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {aiResult.uncertainty.map(
                    (
                      item: string,
                      index: number
                    ) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>

              </div>
            )}

          </div>
        )}

      {/* Global Message */}
      {globalMessage && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          {globalMessage}
        </div>
      )}

    </div>
  );
}