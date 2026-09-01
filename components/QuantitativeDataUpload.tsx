"use client";

import { useState } from "react";

type DataType =
  | "sales"
  | "customers"
  | "products"
  | "marketing"
  | "web_analytics"
  | "inventory"
  | "";

interface Template {
  label: string;
  description: string;
  columns: string[];
  sample: string[][];
}

interface QuantitativeDataUploadProps {
  onUpload: (file: File, dataType: string) => void;
}

const templates: Record<Exclude<DataType, "">, Template> = {
  sales: {
    label: "Sales / Revenue Data",
    description: "Orders, revenue, region, product and sales channel data",
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
    description: "Customer segments, regions and purchasing information",
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
    description: "Product pricing, category and inventory information",
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
    description: "Campaign spending, traffic and conversion metrics",
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
    description: "Traffic, product views, cart activity and conversion",
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
    description: "Stock levels, safety stock and delivery performance",
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

export default function QuantitativeDataUpload({
  onUpload,
}: QuantitativeDataUploadProps) {
  const [dataType, setDataType] = useState<DataType>("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");

  const selectedTemplate =
    dataType !== "" ? templates[dataType] : null;

  const downloadTemplate = () => {
    if (!selectedTemplate) return;

    const header = selectedTemplate.columns.join(",");

    const rows = selectedTemplate.sample.map((row) =>
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

  const handleFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setMessage("Please upload a CSV file.");
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];

    handleFile(droppedFile);
  };

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (!dataType) {
    setMessage("Please select a data type.");
    return;
  }

  if (!file) {
    setMessage("Please upload your CSV file.");
    return;
  }

  try {
    setMessage("Uploading and analyzing data...");

    const formData = new FormData();

    formData.append("file", file);
    formData.append("data_type", dataType);

    // const response = await fetch(
    //   "http://127.0.0.1:8000/analyze",
    //   {
    //     method: "POST",
    //     body: formData,
    //   }
    // );

    // if (!response.ok) {
    //   throw new Error("Analysis failed");
    // }

    // const result = await response.json();

    // console.log("FastAPI Response:", result);

    // Send uploaded file + data type to parent page
    onUpload(file, dataType);

    setMessage(
      `${selectedTemplate?.label} analyzed successfully.`
    );

  } catch (error) {
    console.error("Analysis error:", error);

    setMessage(
      "Unable to connect to FastAPI. Make sure the backend is running."
    );
  }
};

  return (

    <div className="mx-auto w-full  rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-semibold text-gray-900">
          Quantitative Data
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload your business data using our standardized
          CSV templates.
        </p>
      </div>

      {/* Step 1 */}
      <div className="mb-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-300 text-sm font-semibold text-white">
            1
          </span>

          <div>
            <h3 className="font-medium text-gray-900">
              Select Data Type
            </h3>

            <p className="text-xs text-gray-500">
              Choose the business data you want to upload
            </p>
          </div>
        </div>

      <select
  value={dataType}
  onChange={(e) => {
    setDataType(e.target.value as DataType);
    setFile(null);
    setMessage("");
  }}
>
  <option value="">
    Select quantitative data
  </option>

  <option value="sales">
    Sales / Revenue Data
  </option>

  <option value="customers">
    Customer Data
  </option>

  <option value="products">
    Product Data
  </option>

  <option value="marketing">
    Marketing Data
  </option>

  <option value="web_analytics">
    Website / App Analytics
  </option>

  <option value="inventory">
    Inventory / Supply Chain
  </option>
</select>

        {selectedTemplate && (
          <p className="mt-2 text-sm text-gray-500">
            {selectedTemplate.description}
          </p>
        )}
      </div>

      {/* Step 2 */}
      <div className="mb-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-300 text-sm font-semibold text-white">
            2
          </span>

          <div>
            <h3 className="font-medium text-gray-900">
              Download Sample Template
            </h3>

            <p className="text-xs text-gray-500">
              Download the template and replace the sample
              values with your company data
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedTemplate}
          onClick={downloadTemplate}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ↓ Download CSV Template
        </button>

        {selectedTemplate && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-700">
              Required columns
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              {selectedTemplate.columns.join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Step 3 */}
      <div className="mb-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-300 text-sm font-semibold text-white">
            3
          </span>

          <div>
            <h3 className="font-medium text-gray-900">
              Upload Completed File
            </h3>

            <p className="text-xs text-gray-500">
              Upload the CSV after adding your company data
            </p>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => {
            setDragActive(false);
          }}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition ${dragActive
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300 bg-gray-50"
            }`}
        >
          <div className="mb-3 text-3xl">
            📄
          </div>

          <p className="text-sm font-medium text-gray-700">
            Drag & drop your CSV file here
          </p>

          <p className="my-2 text-xs text-gray-500">
            or
          </p>

          <label className="inline-block cursor-pointer rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">
            Browse Files

            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) =>
                handleFile(e.target.files?.[0])
              }
            />
          </label>

          {file && (
            <div className="mx-auto mt-4 max-w-md rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-left">
              <p className="text-sm font-medium text-green-800">
                ✓ {file.name}
              </p>

              <p className="mt-1 text-xs text-green-600">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload */}
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={!dataType || !file}
          className="w-full rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Upload & Analyze Data
        </button>
      </form>

      {/* Status */}
      {message && (
        <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
          {message}
        </div>
      )}
    </div>
  );
}