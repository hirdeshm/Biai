"use client";

import { useMemo } from "react";

interface AnalyzeDataProps {
  file: File | null;
  dataType: string;
  result?: AnalysisResponse | null;
  loading?: boolean;
  error?: string;
}

interface AnalysisResponse {
  success: boolean;
  filename: string;
  data_type: string;
  rows: number;
  columns: string[];
  analysis?: any;
  evidence?: any;
}

export default function AnalyzeData({
  file,
  dataType,
  result,
  loading = false,
  error = "",
}: AnalyzeDataProps) {
  const analysis = result?.analysis;

  const title = useMemo(() => {
    const titles: Record<string, string> = {
      sales: "Sales / Revenue Analysis",
      customers: "Customer Analysis",
      products: "Product Analysis",
      marketing: "Marketing Analysis",
      web_analytics: "Website / App Analysis",
      inventory: "Inventory / Supply Chain Analysis",
    };

    return (
      titles[dataType] ||
      "Business Intelligence Analysis"
    );
  }, [dataType]);

  if (!file && !result) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-medium text-purple-600">
              Dataset Analysis
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              {title}
            </h2>

            {file && (
              <p className="mt-2 text-sm text-gray-500">
                {file.name}
              </p>
            )}
          </div>

          {result && (
            <div className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              ✓ Analysis Complete
            </div>
          )}

        </div>

      </div>

      {/* ================================================== */}
      {/* LOADING */}
      {/* ================================================== */}

      {loading && (
        <div className="rounded-2xl border border-purple-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />

          <p className="mt-4 text-sm font-medium text-gray-700">
            Analyzing {file?.name}...
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Processing your business data
          </p>

        </div>
      )}

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ================================================== */}
      {/* RESULTS */}
      {/* ================================================== */}

      {result && !loading && analysis && (

        <div className="space-y-6">

          {/* ================================================== */}
          {/* DATASET SUMMARY */}
          {/* ================================================== */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <StatCard
              label="Data Source"
              value={formatDataType(dataType)}
            />

            <StatCard
              label="Rows"
              value={result.rows.toLocaleString("en-IN")}
            />

            <StatCard
              label="Columns"
              value={result.columns.length.toString()}
            />

          </div>

          {/* ================================================== */}
          {/* SALES */}
          {/* ================================================== */}

          {dataType === "sales" && (
            <SalesAnalysis analysis={analysis} />
          )}

          {/* ================================================== */}
          {/* CUSTOMERS */}
          {/* ================================================== */}

          {dataType === "customers" && (
            <CustomerAnalysis analysis={analysis} />
          )}

          {/* ================================================== */}
          {/* PRODUCTS */}
          {/* ================================================== */}

          {dataType === "products" && (
            <ProductAnalysis analysis={analysis} />
          )}

          {/* ================================================== */}
          {/* MARKETING */}
          {/* ================================================== */}

          {dataType === "marketing" && (
            <MarketingAnalysis analysis={analysis} />
          )}

          {/* ================================================== */}
          {/* WEB ANALYTICS */}
          {/* ================================================== */}

          {dataType === "web_analytics" && (
            <WebAnalyticsAnalysis
              analysis={analysis}
            />
          )}

          {/* ================================================== */}
          {/* INVENTORY */}
          {/* ================================================== */}

          {dataType === "inventory" && (
            <InventoryAnalysis
              analysis={analysis}
            />
          )}

          {/* ================================================== */}
          {/* EVIDENCE */}
          {/* ================================================== */}

          {result.evidence && (
            <EvidenceSection
              evidence={result.evidence}
            />
          )}

        </div>
      )}

    </div>
  );
}


/* ============================================================
   GENERIC STAT CARD
============================================================ */

function StatCard({
  label,
  value,
  negative = false,
  positive = false,
}: {
  label: string;
  value: string | number;
  negative?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-semibold ${
          negative
            ? "text-red-600"
            : positive
            ? "text-green-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   SALES ANALYSIS
============================================================ */

function SalesAnalysis({
  analysis,
}: {
  analysis: any;
}) {
  const kpi = analysis?.kpi;

  return (
    <div className="space-y-6">

      <Section title="Revenue Performance">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Revenue"
            value={formatCurrency(kpi?.total)}
          />

          <StatCard
            label="Average Revenue"
            value={formatCurrency(kpi?.average)}
          />

          <StatCard
            label="Revenue Change"
            value={
              kpi?.change_percent == null
                ? "Not Available"
                : formatPercent(
                    kpi.change_percent
                  )
            }
            negative={
              typeof kpi?.change_percent ===
                "number" &&
              kpi.change_percent < 0
            }
            positive={
              typeof kpi?.change_percent ===
                "number" &&
              kpi.change_percent > 0
            }
          />

          <StatCard
            label="Severity"
            value={
              analysis?.critical_point
                ?.severity || "NORMAL"
            }
          />

        </div>

      </Section>

      <Section title="Revenue by Region">

        <SimpleBarChart
          data={analysis?.regions || []}
          labelKey="region"
          valueKey="revenue"
          formatValue={(value) =>
            formatCurrency(value)
          }
        />

      </Section>

      <Section title="Revenue by Product">

        <SimpleBarChart
          data={analysis?.products || []}
          labelKey="product_id"
          valueKey="revenue"
          formatValue={(value) =>
            formatCurrency(value)
          }
        />

      </Section>

      <Section title="Revenue by Sales Channel">

        <SimpleBarChart
          data={analysis?.channels || []}
          labelKey="sales_channel"
          valueKey="revenue"
          formatValue={(value) =>
            formatCurrency(value)
          }
        />

      </Section>

    </div>
  );
}


/* ============================================================
   CUSTOMER ANALYSIS
============================================================ */

function CustomerAnalysis({
  analysis,
}: {
  analysis: any;
}) {
  const kpi = analysis?.kpi;

  return (
    <div className="space-y-6">

      <Section title="Customer Performance">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Customers"
            value={formatNumber(
              kpi?.customer_count
            )}
          />

          <StatCard
            label="Previous Revenue"
            value={formatCurrency(
              kpi?.previous_revenue
            )}
          />

          <StatCard
            label="Current Revenue"
            value={formatCurrency(
              kpi?.current_revenue
            )}
          />

          <StatCard
            label="Revenue Change"
            value={
              kpi?.change_percent == null
                ? "Not Available"
                : formatPercent(
                    kpi.change_percent
                  )
            }
            negative={
              typeof kpi?.change_percent ===
                "number" &&
              kpi.change_percent < 0
            }
            positive={
              typeof kpi?.change_percent ===
                "number" &&
              kpi.change_percent > 0
            }
          />

        </div>

      </Section>

      <Section title="Revenue by Customer Segment">

        <SimpleBarChart
          data={analysis?.segments || []}
          labelKey="segment"
          valueKey="revenue"
          formatValue={(value) =>
            formatCurrency(value)
          }
        />

      </Section>

      <Section title="Revenue by Region">

        <SimpleBarChart
          data={analysis?.regions || []}
          labelKey="region"
          valueKey="revenue"
          formatValue={(value) =>
            formatCurrency(value)
          }
        />

      </Section>

    </div>
  );
}


/* ============================================================
   PRODUCT ANALYSIS
============================================================ */

function ProductAnalysis({
  analysis,
}: {
  analysis: any;
}) {
  const kpi = analysis?.kpi;

  return (
    <div className="space-y-6">

      <Section title="Product Performance">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Products"
            value={formatNumber(
              kpi?.product_count
            )}
          />

          <StatCard
            label="Average Price"
            value={formatCurrency(
              kpi?.average_price
            )}
          />

          <StatCard
            label="Average Margin"
            value={`${formatNumber(
              kpi?.average_margin_percent
            )}%`}
          />

          <StatCard
            label="Low Inventory"
            value={formatNumber(
              kpi?.low_inventory_products
            )}
          />

        </div>

      </Section>

      <Section title="Top Products by Margin">

        <ProductTable
          products={
            analysis?.top_products || []
          }
        />

      </Section>

    </div>
  );
}


/* ============================================================
   MARKETING ANALYSIS
============================================================ */

function MarketingAnalysis({
  analysis,
}: {
  analysis: any;
}) {
  const kpi = analysis?.kpi;

  return (
    <div className="space-y-6">

      <Section title="Marketing Performance">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Spend"
            value={formatCurrency(
              kpi?.total_spend
            )}
          />

          <StatCard
            label="Impressions"
            value={formatNumber(
              kpi?.impressions
            )}
          />

          <StatCard
            label="Clicks"
            value={formatNumber(
              kpi?.clicks
            )}
          />

          <StatCard
            label="Conversions"
            value={formatNumber(
              kpi?.conversions
            )}
          />

        </div>

      </Section>

      <Section title="Marketing Efficiency">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            label="CTR"
            value={`${formatNumber(
              kpi?.ctr_percent
            )}%`}
          />

          <StatCard
            label="Conversion Rate"
            value={`${formatNumber(
              kpi?.conversion_rate_percent
            )}%`}
          />

          <StatCard
            label="Conversions / Spend"
            value={formatNumber(
              kpi?.conversions_per_spend
            )}
          />

        </div>

      </Section>

      <Section title="Campaign Performance">

        <SimpleBarChart
          data={analysis?.campaigns || []}
          labelKey="campaign"
          valueKey="conversions"
          formatValue={(value) =>
            formatNumber(value)
          }
        />

      </Section>

    </div>
  );
}


/* ============================================================
   WEB ANALYTICS
============================================================ */

function WebAnalyticsAnalysis({
  analysis,
}: {
  analysis: any;
}) {
  const kpi = analysis?.kpi;

  return (
    <div className="space-y-6">

      <Section title="Website Performance">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Visitors"
            value={formatNumber(
              kpi?.visitors
            )}
          />

          <StatCard
            label="Product Views"
            value={formatNumber(
              kpi?.product_views
            )}
          />

          <StatCard
            label="Add to Cart"
            value={formatNumber(
              kpi?.add_to_cart
            )}
          />

          <StatCard
            label="Orders"
            value={formatNumber(
              kpi?.orders
            )}
          />

        </div>

      </Section>

      <Section title="Conversion Funnel">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            label="Visitor → Order"
            value={`${formatNumber(
              kpi?.visitor_conversion_percent
            )}%`}
          />

          <StatCard
            label="Cart → Order"
            value={`${formatNumber(
              kpi?.cart_to_order_percent
            )}%`}
          />

          <StatCard
            label="Average Error Rate"
            value={formatNumber(
              kpi?.average_error_rate
            )}
          />

        </div>

      </Section>

      <Section title="Visitors and Orders by Region">

        <SimpleBarChart
          data={analysis?.regions || []}
          labelKey="region"
          valueKey="orders"
          formatValue={(value) =>
            formatNumber(value)
          }
        />

      </Section>

    </div>
  );
}


/* ============================================================
   INVENTORY ANALYSIS
============================================================ */

function InventoryAnalysis({
  analysis,
}: {
  analysis: any;
}) {
  const kpi = analysis?.kpi;

  return (
    <div className="space-y-6">

      <Section title="Inventory Health">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Stock"
            value={formatNumber(
              kpi?.total_stock
            )}
          />

          <StatCard
            label="Low Stock Products"
            value={formatNumber(
              kpi?.low_stock_products
            )}
          />

          <StatCard
            label="Stockout Hours"
            value={formatNumber(
              kpi?.total_stockout_hours
            )}
          />

          <StatCard
            label="Avg Delivery Delay"
            value={`${formatNumber(
              kpi?.average_delivery_delay_days
            )} days`}
          />

        </div>

      </Section>

      <Section title="Inventory by Product">

        <SimpleBarChart
          data={analysis?.products || []}
          labelKey="product_id"
          valueKey="stock_level"
          formatValue={(value) =>
            formatNumber(value)
          }
        />

      </Section>

      <Section title="Stockout Hours by Product">

        <SimpleBarChart
          data={analysis?.products || []}
          labelKey="product_id"
          valueKey="stockout_hours"
          formatValue={(value) =>
            formatNumber(value)
          }
        />

      </Section>

    </div>
  );
}


/* ============================================================
   PRODUCT TABLE
============================================================ */

function ProductTable({
  products,
}: {
  products: any[];
}) {
  if (!products.length) {
    return (
      <p className="text-sm text-gray-500">
        No product data available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full text-left text-sm">

        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-3 font-semibold">
              Product
            </th>

            <th className="px-4 py-3 font-semibold">
              Price
            </th>

            <th className="px-4 py-3 font-semibold">
              Cost
            </th>

            <th className="px-4 py-3 font-semibold">
              Margin
            </th>

            <th className="px-4 py-3 font-semibold">
              Inventory
            </th>
          </tr>
        </thead>

        <tbody>

          {products.map(
            (product, index) => (
              <tr
                key={index}
                className="border-b"
              >

                <td className="px-4 py-3 font-medium">
                  {product.product_id}
                </td>

                <td className="px-4 py-3">
                  {formatCurrency(
                    product.price
                  )}
                </td>

                <td className="px-4 py-3">
                  {formatCurrency(
                    product.cost
                  )}
                </td>

                <td className="px-4 py-3 font-medium">
                  {formatNumber(
                    product.margin_percent
                  )}
                  %
                </td>

                <td className="px-4 py-3">
                  {formatNumber(
                    product.inventory
                  )}
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}


/* ============================================================
   EVIDENCE SECTION
============================================================ */

function EvidenceSection({
  evidence,
}: {
  evidence: any;
}) {
  return (
    <Section title="Analysis Evidence">

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl bg-gray-50 p-4">

          <p className="text-sm font-semibold text-gray-700">
            Evidence Quality
          </p>

          <div className="mt-3 space-y-2 text-sm text-gray-600">

            <p>
              Rows available:{" "}
              <span className="font-medium text-gray-900">
                {evidence?.dataset?.rows ??
                  evidence?.evidence_quality
                    ?.rows_available ??
                  "—"}
              </span>
            </p>

            <p>
              Columns available:{" "}
              <span className="font-medium text-gray-900">
                {evidence?.dataset?.columns
                  ?.length ??
                  evidence?.evidence_quality
                    ?.columns_available
                    ?.length ??
                  "—"}
              </span>
            </p>

          </div>

        </div>

        <div className="rounded-xl bg-gray-50 p-4">

          <p className="text-sm font-semibold text-gray-700">
            Critical Point
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Detected:{" "}
            <span className="font-medium text-gray-900">
              {evidence?.critical_point
                ?.detected
                ? "Yes"
                : "No"}
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Severity:{" "}
            <span className="font-medium text-gray-900">
              {evidence?.critical_point
                ?.severity || "NORMAL"}
            </span>
          </p>

        </div>

      </div>

    </Section>
  );
}


/* ============================================================
   SIMPLE BAR CHART
============================================================ */

function SimpleBarChart({
  data,
  labelKey,
  valueKey,
  formatValue,
}: {
  data: any[];
  labelKey: string;
  valueKey: string;
  formatValue?: (value: number) => string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
        No data available for this chart.
      </div>
    );
  }

  const sortedData = [...data]
    .sort(
      (a, b) =>
        Number(b[valueKey] ?? 0) -
        Number(a[valueKey] ?? 0)
    )
    .slice(0, 10);

  const maxValue = Math.max(
    ...sortedData.map((item) =>
      Number(item[valueKey] ?? 0)
    ),
    1
  );

  return (
    <div className="space-y-4">

      {sortedData.map(
        (item, index) => {

          const value = Number(
            item[valueKey] ?? 0
          );

          const width =
            (value / maxValue) * 100;

          return (
            <div key={index}>

              <div className="mb-1 flex items-center justify-between gap-4">

                <span className="truncate text-sm font-medium text-gray-700">
                  {item[labelKey]}
                </span>

                <span className="shrink-0 text-sm font-semibold text-gray-900">
                  {formatValue
                    ? formatValue(value)
                    : formatNumber(value)}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>

            </div>
          );
        }
      )}

    </div>
  );
}


/* ============================================================
   SECTION
============================================================ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <div className="mt-5">
        {children}
      </div>

    </div>
  );
}


/* ============================================================
   HELPERS
============================================================ */

function formatCurrency(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return `₹${Number(value).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}


function formatNumber(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return Number(value).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  );
}


function formatPercent(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return `${value > 0 ? "+" : ""}${value}%`;
}


function formatDataType(
  dataType: string
) {
  const names: Record<string, string> = {
    sales: "Sales",
    customers: "Customers",
    products: "Products",
    marketing: "Marketing",
    web_analytics: "Web Analytics",
    inventory: "Inventory",
  };

  return names[dataType] || dataType;
}