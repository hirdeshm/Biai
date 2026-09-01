"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Papa from "papaparse";
import { useEffect, useState } from "react";

interface DataChartsProps {
  file: File | null;
  analyze: boolean;
}

interface CSVRow {
  [key: string]: string | number | null;
}

interface ChartData {
  title: string;
  type: "line" | "bar";
  xKey: string;
  yKey: string;
  data: CSVRow[];
}

export default function DataCharts({
  file,
  analyze,
}: DataChartsProps) {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file || !analyze) {
      setCharts([]);
      return;
    }

    setLoading(true);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,

      complete: (results) => {
        const rows = results.data;

        if (!rows.length) {
          setLoading(false);
          return;
        }

        const columns = Object.keys(rows[0]);

        const numericColumns = columns.filter((column) => {
          const values = rows
            .map((row) => row[column])
            .filter(
              (value) =>
                value !== null &&
                value !== undefined &&
                value !== ""
            );

          if (!values.length) return false;

          const numericValues = values.filter(
            (value) =>
              typeof value === "number" &&
              Number.isFinite(value)
          );

          return numericValues.length / values.length >= 0.7;
        });

        const categoricalColumns = columns.filter(
          (column) => !numericColumns.includes(column)
        );

        const generatedCharts: ChartData[] = [];

        /*
         * ==========================================
         * 1. TIME-SERIES CHARTS
         * ==========================================
         */

        const dateColumn = columns.find((column) => {
          const lower = column.toLowerCase();

          return (
            lower.includes("date") ||
            lower.includes("time") ||
            lower.includes("month") ||
            lower.includes("year")
          );
        });

        if (dateColumn && numericColumns.length > 0) {
          numericColumns.forEach((numericColumn) => {
            generatedCharts.push({
              title: `${formatName(
                numericColumn
              )} Over Time`,

              type: "line",

              xKey: dateColumn,

              yKey: numericColumn,

              data: rows,
            });
          });
        }

        /*
         * ==========================================
         * 2. NUMERIC DATA
         * ==========================================
         */

        if (
          !dateColumn &&
          numericColumns.length > 0
        ) {
          const indexColumn = columns[0];

          numericColumns.forEach((numericColumn) => {
            generatedCharts.push({
              title: `${formatName(
                numericColumn
              )} Distribution`,

              type: "line",

              xKey: indexColumn,

              yKey: numericColumn,

              data: rows,
            });
          });
        }

        /*
         * ==========================================
         * 3. CATEGORY VS NUMERIC
         * ==========================================
         */

        if (
          categoricalColumns.length > 0 &&
          numericColumns.length > 0
        ) {
          const categoryColumn =
            categoricalColumns.find((column) => {
              const uniqueValues = new Set(
                rows.map((row) =>
                  String(row[column])
                )
              );

              return (
                uniqueValues.size > 1 &&
                uniqueValues.size <= 20
              );
            });

          if (categoryColumn) {
            numericColumns.forEach((numericColumn) => {
              const grouped = groupByCategory(
                rows,
                categoryColumn,
                numericColumn
              );

              generatedCharts.push({
                title: `${formatName(
                  numericColumn
                )} by ${formatName(categoryColumn)}`,

                type: "bar",

                xKey: categoryColumn,

                yKey: numericColumn,

                data: grouped,
              });
            });
          }
        }

        /*
         * ==========================================
         * LIMIT FOR PERFORMANCE
         * ==========================================
         */

        setCharts(
          generatedCharts.slice(0, 8)
        );

        setLoading(false);
      },

      error: () => {
        setLoading(false);
      },
    });
  }, [file, analyze]);

  if (!file) {
    return null;
  }

  if (!analyze) {
    return null;
  }

  if (loading) {
    return (
      <section className="mt-8 rounded-2xl border bg-white p-8 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />

        <p className="text-sm text-gray-500">
          Generating charts from your data...
        </p>
      </section>
    );
  }

  if (!charts.length) {
    return (
      <section className="mt-8 rounded-2xl border bg-white p-8">
        <p className="text-sm text-gray-500">
          No suitable numerical data was found
          for visualization.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8">

      {/* Header */}

      <div className="mb-6">
        <p className="text-sm font-medium text-purple-600">
          Data Analysis
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-gray-900">
          Data Visualizations
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Automatically generated visualizations
          from your uploaded dataset.
        </p>
      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {charts.map((chart, index) => (
          <div
            key={`${chart.xKey}-${chart.yKey}-${index}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >

            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {chart.title}
            </h3>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                {chart.type === "line" ? (
                  <LineChart
                    data={chart.data}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey={chart.xKey}
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey={chart.yKey}
                      strokeWidth={2}
                    />

                  </LineChart>
                ) : (
                  <BarChart
                    data={chart.data}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey={chart.xKey}
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey={chart.yKey}
                      fill="#9333ea"
                    />

                  </BarChart>
                )}

              </ResponsiveContainer>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

/* ==========================================
   HELPERS
   ========================================== */

function formatName(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function groupByCategory(
  rows: CSVRow[],
  categoryColumn: string,
  numericColumn: string
): CSVRow[] {
  const grouped: Record<string, number> = {};

  rows.forEach((row) => {
    const category = String(
      row[categoryColumn] ?? "Unknown"
    );

    const value = Number(
      row[numericColumn]
    );

    if (!Number.isFinite(value)) return;

    grouped[category] =
      (grouped[category] || 0) + value;
  });

  return Object.entries(grouped).map(
    ([category, value]) => ({
      [categoryColumn]: category,
      [numericColumn]: value,
    })
  );
}