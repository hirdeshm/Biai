from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import numpy as np

import os
import json

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

llm_client = InferenceClient(
    api_key=HF_TOKEN
)

app = FastAPI(title="BusinessIntelligence.ai")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000",
                   "https://biai-beryl.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_TYPES = [
    "sales",
    "customers",
    "products",
    "marketing",
    "web_analytics",
    "inventory",
]

# ============================================================
# AI CROSS-SOURCE ANALYSIS
# ============================================================

def get_ai_business_insight(evidence):

    if not HF_TOKEN:
        return {
            "success": False,
            "error": "HF_TOKEN is not configured."
        }

    system_prompt = """
You are BusinessIntelligence.ai, an AI business intelligence
analyst.

Your job is to analyze structured business evidence from
multiple data sources and explain what is happening in the
business.

IMPORTANT RULES:

1. Never invent facts, metrics, causes, or relationships.

2. Only use evidence provided in the input.

3. Correlation does NOT mean causation.
   Do not claim that one factor caused another unless the
   evidence actually establishes causality.

4. If the evidence only supports an association, explicitly
   say that it is an association.

5. If there is insufficient evidence for a root cause,
   say so.

6. Do not manufacture a KPI change when change_percent is
   null.

7. Do not call a change "month-over-month", "week-over-week",
   or similar unless the evidence explicitly provides those
   periods.

8. Prioritize material business changes.

9. Compare evidence across data sources when possible.

10. Look for consistent signals across:
    - Sales
    - Customers
    - Products
    - Marketing
    - Web Analytics
    - Inventory

11. Recommendations must be connected to observed evidence.

12. Confidence must reflect evidence strength.
    Do not use high confidence when evidence is weak.

13. Clearly communicate uncertainty.

Return ONLY valid JSON.

Required JSON structure:

{
  "summary": "...",

  "what_changed": [
    {
      "metric": "...",
      "change": "...",
      "evidence": "..."
    }
  ],

  "likely_causes": [
    {
      "cause": "...",
      "confidence": 0,
      "evidence": [
        "..."
      ],
      "relationship": "association | strong_evidence | unknown"
    }
  ],

  "recommendations": [
    {
      "action": "...",
      "priority": "LOW | MEDIUM | HIGH",
      "reason": "..."
    }
  ],

  "uncertainty": [
    "..."
  ]
}
"""

    user_prompt = f"""
Analyze the following business evidence.

Do not use information outside this evidence.

BUSINESS EVIDENCE:

{json.dumps(evidence, indent=2, default=str)}

Identify:

1. What materially changed?
2. Which business areas are affected?
3. What evidence is consistent across multiple sources?
4. What are the strongest potential explanations?
5. What actions should the business take?
6. What remains uncertain?

Remember:

- Do not invent causes.
- Do not confuse correlation with causation.
- If there is insufficient evidence, explicitly state that.
"""

    try:

        response = llm_client.chat.completions.create(
            model="Qwen/Qwen3-8B",

            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],

            temperature=0.2,

            max_tokens=4000
        )

        content = response.choices[0].message.content

        # Remove markdown JSON fences if model adds them
        content = content.strip()

        if content.startswith("```json"):
            content = content[7:]

        elif content.startswith("```"):
            content = content[3:]

        if content.endswith("```"):
            content = content[:-3]

        content = content.strip()

        try:

            parsed = json.loads(content)

            return {
                "success": True,
                "result": parsed
            }

        except json.JSONDecodeError:

            return {
                "success": False,
                "error": "LLM returned invalid JSON.",
                "raw_response": content
            }

    except Exception as e:

        return {
            "success": False,
            "error": f"LLM request failed: {str(e)}"
        }
# ============================================================
# Helpers
# ============================================================

def safe_number(value):
    if pd.isna(value) or np.isinf(value):
        return 0

    return float(value)


def percentage_change(old, new):
    if old == 0:
        return 0

    return round(((new - old) / abs(old)) * 100, 2)


def basic_dataframe_info(df):
    return {
        "rows": int(len(df)),
        "columns": list(df.columns),
        "missing_values": {
            column: int(df[column].isna().sum())
            for column in df.columns
        }
    }
def build_evidence(
    data_type,
    analysis,
    df
):
    """
    Convert dataset-specific analysis into a
    standardized evidence package for cross-source AI reasoning.
    """

    return {
        "source": data_type,

        "dataset": {
            "rows": int(len(df)),
            "columns": list(df.columns)
        },

        "kpis": analysis.get("kpi", {}),

        "critical_point": analysis.get(
            "critical_point",
            {
                "detected": False,
                "severity": "NORMAL"
            }
        ),

        "dimensions": {
            "regions": analysis.get("regions", []),
            "products": analysis.get("products", []),
            "segments": analysis.get("segments", []),
            "channels": analysis.get("channels", []),
            "campaigns": analysis.get("campaigns", [])
        },

        "evidence_quality": {
            "rows_available": int(len(df)),
            "columns_available": list(df.columns),
            "missing_values": {
                column: int(df[column].isna().sum())
                for column in df.columns
            }
        }
    }


# ============================================================
# SALES
# ============================================================

def analyze_sales(df):

    required = [
        "revenue",
        "region",
        "product_id",
        "sales_channel"
    ]

    missing = [
        column for column in required
        if column not in df.columns
    ]

    if missing:
        return {
            "error": f"Missing columns: {missing}"
        }

    df["revenue"] = pd.to_numeric(
        df["revenue"],
        errors="coerce"
    ).fillna(0)

    total_revenue = df["revenue"].sum()

    average_revenue = df["revenue"].mean()

    # # Compare first half vs second half
    # midpoint = len(df) // 2

    # first_half = df.iloc[:midpoint]["revenue"].sum()
    # second_half = df.iloc[midpoint:]["revenue"].sum()

    change = None

    region_revenue = (
        df.groupby("region")["revenue"]
        .sum()
        .sort_values(ascending=False)
    )

    product_revenue = (
        df.groupby("product_id")["revenue"]
        .sum()
        .sort_values(ascending=False)
    )

    channel_revenue = (
        df.groupby("sales_channel")["revenue"]
        .sum()
        .sort_values(ascending=False)
    )

    critical = False

    return {
        "data_type": "sales",

        "kpi": {
            "name": "Revenue",
            "total": safe_number(total_revenue),
            "average": safe_number(average_revenue),
            "change_percent": change
        },

        "critical_point": {
            "detected": critical,
            "severity": "HIGH" if critical else "NORMAL"
        },

        "top_region": {
            "name": str(region_revenue.index[0])
            if len(region_revenue) else None,

            "revenue": safe_number(
                region_revenue.iloc[0]
            )
            if len(region_revenue)
            else 0
        },

        "top_product": {
            "id": str(product_revenue.index[0])
            if len(product_revenue)
            else None,

            "revenue": safe_number(
                product_revenue.iloc[0]
            )
            if len(product_revenue)
            else 0
        },

        "regions": [
            {
                "region": str(index),
                "revenue": safe_number(value)
            }
            for index, value
            in region_revenue.items()
        ],

        "products": [
            {
                "product_id": str(index),
                "revenue": safe_number(value)
            }
            for index, value
            in product_revenue.items()
        ],

        "channels": [
            {
                "sales_channel": str(index),
                "revenue": safe_number(value)
            }
            for index, value
            in channel_revenue.items()
        ]
    }


# ============================================================
# CUSTOMERS
# ============================================================

def analyze_customers(df):

    required = [
        "customer_id",
        "customer_segment",
        "region",
        "previous_revenue",
        "current_revenue"
    ]

    missing = [
        column
        for column in required
        if column not in df.columns
    ]

    if missing:
        return {
            "error": f"Missing columns: {missing}"
        }

    df["previous_revenue"] = pd.to_numeric(
        df["previous_revenue"],
        errors="coerce"
    ).fillna(0)

    df["current_revenue"] = pd.to_numeric(
        df["current_revenue"],
        errors="coerce"
    ).fillna(0)

    previous = float(
        df["previous_revenue"].sum()
    )

    current = float(
        df["current_revenue"].sum()
    )

    change = percentage_change(
        previous,
        current
    )

    customers = int(
        df["customer_id"].nunique()
    )

    segment_revenue = (
        df.groupby("customer_segment")[
            "current_revenue"
        ]
        .sum()
        .sort_values(ascending=False)
    )

    region_revenue = (
        df.groupby("region")[
            "current_revenue"
        ]
        .sum()
        .sort_values(ascending=False)
    )

    returning = 0

    if "customer_type" in df.columns:

        returning = int(
            (
                df["customer_type"]
                .astype(str)
                .str.strip()
                .str.lower()
                == "returning"
            ).sum()
        )

    return {

        "data_type": "customers",

        "kpi": {

            "name": "Customer Revenue",

            "previous_revenue":
                safe_number(previous),

            "current_revenue":
                safe_number(current),

            "change_percent":
                safe_number(change),

            "customer_count":
                customers,

            "returning_customers":
                returning
        },

        "critical_point": {

            "detected":
                abs(change) >= 10,

            "severity":
                "HIGH"
                if abs(change) >= 10
                else "NORMAL"
        },

        "segments": [

            {
                "segment": str(index),
                "revenue": safe_number(value)
            }

            for index, value
            in segment_revenue.items()
        ],

        "regions": [

            {
                "region": str(index),
                "revenue": safe_number(value)
            }

            for index, value
            in region_revenue.items()
        ]
    }

# ============================================================
# PRODUCTS
# ============================================================

def analyze_products(df):

    required = [
        "product_id",
        "price",
        "cost",
        "inventory"
    ]

    missing = [
        column for column in required
        if column not in df.columns
    ]

    if missing:
        return {
            "error": f"Missing columns: {missing}"
        }

    for column in [
        "price",
        "cost",
        "inventory"
    ]:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        ).fillna(0)

    df["margin"] = (
        df["price"] - df["cost"]
    )

    df["margin_percent"] = np.where(
        df["price"] != 0,
        (
            df["margin"]
            / df["price"]
        ) * 100,
        0
    )

    total_products = len(df)

    average_price = df["price"].mean()

    average_margin = df["margin_percent"].mean()

    low_inventory = df[
        df["inventory"] < 100
    ]

    top_products = (
        df.sort_values(
            "margin_percent",
            ascending=False
        )
        .head(10)
    )

    return {
        "data_type": "products",

        "kpi": {
            "name": "Product Performance",
            "product_count": total_products,
            "average_price": safe_number(
                average_price
            ),
            "average_margin_percent": safe_number(
                average_margin
            ),
            "low_inventory_products": int(
                len(low_inventory)
            )
        },

        "critical_point": {
            "detected": len(low_inventory) > 0,
            "severity":
                "MEDIUM"
                if len(low_inventory) > 0
                else "NORMAL"
        },

        "top_products": [
            {
                "product_id": str(
                    row["product_id"]
                ),
                "price": safe_number(
                    row["price"]
                ),
                "cost": safe_number(
                    row["cost"]
                ),
                "margin_percent": safe_number(
                    row["margin_percent"]
                ),
                "inventory": safe_number(
                    row["inventory"]
                )
            }
            for _, row in top_products.iterrows()
        ]
    }


# ============================================================
# MARKETING
# ============================================================

def analyze_marketing(df):

    required = [
        "spend",
        "impressions",
        "clicks",
        "conversions"
    ]

    # Clean column names
    df.columns = (
        df.columns
        .astype(str)
        .str.strip()
        .str.lower()
    )

    missing = [
        column
        for column in required
        if column not in df.columns
    ]

    if missing:
        return {
            "error": f"Missing columns: {missing}"
        }

    # Convert numeric columns safely
    for column in required:
        df[column] = (
            df[column]
            .astype(str)
            .str.replace(",", "", regex=False)
            .str.replace("%", "", regex=False)
            .str.strip()
        )

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        ).fillna(0)

    # -----------------------------------------
    # TOTALS
    # -----------------------------------------

    total_spend = float(
        df["spend"].sum()
    )

    total_impressions = int(
        df["impressions"].sum()
    )

    total_clicks = int(
        df["clicks"].sum()
    )

    total_conversions = int(
        df["conversions"].sum()
    )

    # -----------------------------------------
    # CTR
    # -----------------------------------------

    ctr = (
        (total_clicks / total_impressions) * 100
        if total_impressions > 0
        else 0
    )

    # -----------------------------------------
    # Conversion Rate
    # -----------------------------------------

    conversion_rate = (
        (total_conversions / total_clicks) * 100
        if total_clicks > 0
        else 0
    )

    # -----------------------------------------
    # Cost Per Conversion
    # -----------------------------------------

    cost_per_conversion = (
        total_spend / total_conversions
        if total_conversions > 0
        else 0
    )

    # -----------------------------------------
    # Campaign Performance
    # -----------------------------------------

    campaigns = []

    if "campaign" in df.columns:

        campaign_df = (
            df.groupby("campaign", dropna=False)
            .agg(
                spend=("spend", "sum"),
                impressions=("impressions", "sum"),
                clicks=("clicks", "sum"),
                conversions=("conversions", "sum")
            )
            .reset_index()
        )

        for _, row in campaign_df.iterrows():

            spend = float(row["spend"])
            impressions = float(row["impressions"])
            clicks = float(row["clicks"])
            conversions = float(row["conversions"])

            campaign_ctr = (
                clicks / impressions * 100
                if impressions > 0
                else 0
            )

            campaign_conversion_rate = (
                conversions / clicks * 100
                if clicks > 0
                else 0
            )

            campaign_cpa = (
                spend / conversions
                if conversions > 0
                else 0
            )

            campaigns.append({
                "campaign": str(row["campaign"]),
                "spend": safe_number(spend),
                "impressions": safe_number(impressions),
                "clicks": safe_number(clicks),
                "conversions": safe_number(conversions),
                "ctr_percent": round(
                    campaign_ctr,
                    2
                ),
                "conversion_rate_percent": round(
                    campaign_conversion_rate,
                    2
                ),
                "cost_per_conversion": round(
                    campaign_cpa,
                    2
                )
            })

    # -----------------------------------------
    # Region Performance
    # -----------------------------------------

    regions = []

    if "region" in df.columns:

        region_df = (
            df.groupby("region", dropna=False)
            .agg(
                spend=("spend", "sum"),
                impressions=("impressions", "sum"),
                clicks=("clicks", "sum"),
                conversions=("conversions", "sum")
            )
            .reset_index()
        )

        for _, row in region_df.iterrows():

            impressions = float(
                row["impressions"]
            )

            clicks = float(
                row["clicks"]
            )

            conversions = float(
                row["conversions"]
            )

            region_ctr = (
                clicks / impressions * 100
                if impressions > 0
                else 0
            )

            region_conversion_rate = (
                conversions / clicks * 100
                if clicks > 0
                else 0
            )

            regions.append({
                "region": str(row["region"]),
                "spend": safe_number(
                    row["spend"]
                ),
                "impressions": safe_number(
                    row["impressions"]
                ),
                "clicks": safe_number(
                    row["clicks"]
                ),
                "conversions": safe_number(
                    row["conversions"]
                ),
                "ctr_percent": round(
                    region_ctr,
                    2
                ),
                "conversion_rate_percent": round(
                    region_conversion_rate,
                    2
                )
            })

    # -----------------------------------------
    # Final Result
    # -----------------------------------------

    return {

        "data_type": "marketing",

        "kpi": {

            "name":
                "Marketing Performance",

            "total_spend":
                safe_number(total_spend),

            "impressions":
                safe_number(total_impressions),

            "clicks":
                safe_number(total_clicks),

            "conversions":
                safe_number(total_conversions),

            "ctr_percent":
                round(ctr, 2),

            "conversion_rate_percent":
                round(
                    conversion_rate,
                    2
                ),

            "cost_per_conversion":
                round(
                    cost_per_conversion,
                    2
                )
        },

        "critical_point": {
            "detected": False,
            "severity": "NORMAL"
        },

        "campaigns": campaigns,

        "regions": regions
    }
# ============================================================
# WEB ANALYTICS
# ============================================================

def analyze_web_analytics(df):

    required = [
        "visitors",
        "product_views",
        "add_to_cart",
        "orders"
    ]

    # Clean column names
    df.columns = (
        df.columns
        .astype(str)
        .str.strip()
        .str.lower()
    )

    missing = [
        column
        for column in required
        if column not in df.columns
    ]

    if missing:
        return {
            "error": f"Missing columns: {missing}"
        }

    # -----------------------------------------
    # Convert numeric columns
    # -----------------------------------------

    for column in required:

        df[column] = (
            df[column]
            .astype(str)
            .str.replace(",", "", regex=False)
            .str.replace("%", "", regex=False)
            .str.strip()
        )

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        ).fillna(0)

    # -----------------------------------------
    # TOTALS
    # -----------------------------------------

    total_visitors = float(
        df["visitors"].sum()
    )

    total_product_views = float(
        df["product_views"].sum()
    )

    total_add_to_cart = float(
        df["add_to_cart"].sum()
    )

    total_orders = float(
        df["orders"].sum()
    )

    # -----------------------------------------
    # Conversion Metrics
    # -----------------------------------------

    visitor_conversion_rate = (
        total_orders / total_visitors * 100
        if total_visitors > 0
        else 0
    )

    cart_to_order_rate = (
        total_orders / total_add_to_cart * 100
        if total_add_to_cart > 0
        else 0
    )

    view_to_cart_rate = (
        total_add_to_cart / total_product_views * 100
        if total_product_views > 0
        else 0
    )

    # -----------------------------------------
    # Error Rate
    # -----------------------------------------

    error_rate = 0

    if "error_rate" in df.columns:

        df["error_rate"] = (
            df["error_rate"]
            .astype(str)
            .str.replace("%", "", regex=False)
            .str.strip()
        )

        df["error_rate"] = pd.to_numeric(
            df["error_rate"],
            errors="coerce"
        ).fillna(0)

        # If values are decimals such as 0.01,
        # convert to percentage.
        error_rate_values = df["error_rate"]

        if (
            len(error_rate_values) > 0
            and error_rate_values.max() <= 1
        ):
            error_rate = (
                error_rate_values.mean() * 100
            )
        else:
            error_rate = (
                error_rate_values.mean()
            )

    # -----------------------------------------
    # Region Performance
    # -----------------------------------------

    regions = []

    if "region" in df.columns:

        region_df = (
            df.groupby(
                "region",
                dropna=False
            )
            .agg(
                visitors=("visitors", "sum"),
                product_views=(
                    "product_views",
                    "sum"
                ),
                add_to_cart=(
                    "add_to_cart",
                    "sum"
                ),
                orders=("orders", "sum")
            )
            .reset_index()
        )

        for _, row in region_df.iterrows():

            visitors = float(
                row["visitors"]
            )

            product_views = float(
                row["product_views"]
            )

            add_to_cart = float(
                row["add_to_cart"]
            )

            orders = float(
                row["orders"]
            )

            region_conversion = (
                orders / visitors * 100
                if visitors > 0
                else 0
            )

            region_cart_rate = (
                add_to_cart /
                product_views * 100
                if product_views > 0
                else 0
            )

            regions.append({
                "region": str(
                    row["region"]
                ),

                "visitors": safe_number(
                    visitors
                ),

                "product_views": safe_number(
                    product_views
                ),

                "add_to_cart": safe_number(
                    add_to_cart
                ),

                "orders": safe_number(
                    orders
                ),

                "conversion_rate_percent":
                    round(
                        region_conversion,
                        2
                    ),

                "view_to_cart_rate_percent":
                    round(
                        region_cart_rate,
                        2
                    )
            })

    # -----------------------------------------
    # Final Result
    # -----------------------------------------

    return {

        "data_type":
            "web_analytics",

        "kpi": {

            "name":
                "Web Analytics Performance",

            "visitors":
                safe_number(
                    total_visitors
                ),

            "product_views":
                safe_number(
                    total_product_views
                ),

            "add_to_cart":
                safe_number(
                    total_add_to_cart
                ),

            "orders":
                safe_number(
                    total_orders
                ),

            "visitor_conversion_rate_percent":
                round(
                    visitor_conversion_rate,
                    2
                ),

            "cart_to_order_rate_percent":
                round(
                    cart_to_order_rate,
                    2
                ),

            "view_to_cart_rate_percent":
                round(
                    view_to_cart_rate,
                    2
                ),

            "error_rate_percent":
                round(
                    error_rate,
                    2
                )
        },

        "critical_point": {
            "detected": False,
            "severity": "NORMAL"
        },

        "regions": regions
    }
# ============================================================
# INVENTORY
# ============================================================

def analyze_inventory(df):

    required = [
        "product_id",
        "stock_level",
        "safety_stock",
        "stockout_hours",
        "delivery_delay_days"
    ]

    missing = [
        column for column in required
        if column not in df.columns
    ]

    if missing:
        return {
            "error": f"Missing columns: {missing}"
        }

    for column in [
        "stock_level",
        "safety_stock",
        "stockout_hours",
        "delivery_delay_days"
    ]:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        ).fillna(0)

    df["below_safety_stock"] = (
        df["stock_level"]
        < df["safety_stock"]
    )

    low_stock_count = int(
        df["below_safety_stock"].sum()
    )

    total_stock = df["stock_level"].sum()

    total_stockout_hours = (
        df["stockout_hours"].sum()
    )

    average_delay = (
        df["delivery_delay_days"].mean()
    )

    product_inventory = (
        df.groupby("product_id")
        .agg({
            "stock_level": "sum",
            "safety_stock": "sum",
            "stockout_hours": "sum",
            "delivery_delay_days": "mean"
        })
        .reset_index()
    )

    return {
        "data_type": "inventory",

        "kpi": {
            "name": "Inventory Health",
            "total_stock": safe_number(
                total_stock
            ),
            "low_stock_products":
                low_stock_count,
            "total_stockout_hours":
                safe_number(
                    total_stockout_hours
                ),
            "average_delivery_delay_days":
                round(
                    safe_number(
                        average_delay
                    ),
                    2
                )
        },

        "critical_point": {
            "detected":
                low_stock_count > 0
                or total_stockout_hours > 0,

            "severity":
                "HIGH"
                if total_stockout_hours > 0
                else (
                    "MEDIUM"
                    if low_stock_count > 0
                    else "NORMAL"
                )
        },

        "products": [
            {
                "product_id": str(
                    row["product_id"]
                ),
                "stock_level": safe_number(
                    row["stock_level"]
                ),
                "safety_stock": safe_number(
                    row["safety_stock"]
                ),
                "stockout_hours":
                    safe_number(
                        row["stockout_hours"]
                    ),
                "delivery_delay_days":
                    round(
                        safe_number(
                            row[
                                "delivery_delay_days"
                            ]
                        ),
                        2
                    )
            }
            for _, row
            in product_inventory.iterrows()
        ]
    }


# ============================================================
# MAIN ANALYZER
# ============================================================

def analyze_data(df, data_type):

    if data_type == "sales":
        return analyze_sales(df)

    elif data_type == "customers":
        return analyze_customers(df)

    elif data_type == "products":
        return analyze_products(df)

    elif data_type == "marketing":
        return analyze_marketing(df)

    elif data_type == "web_analytics":
        return analyze_web_analytics(df)

    elif data_type == "inventory":
        return analyze_inventory(df)

    return {
        "error": f"Unsupported data type: {data_type}"
    }


# ============================================================
# /analyze
# ============================================================

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    data_type: str = Form(...)
):

    contents = await file.read()

    try:

        df = pd.read_csv(
            io.BytesIO(contents)
        )

    except Exception as e:

        return {
            "success": False,
            "error": f"Unable to read CSV: {str(e)}"
        }

    if data_type not in DATA_TYPES:
        return {
            "success": False,
            "error": f"Unsupported data type: {data_type}"
        }

    analysis = analyze_data(
        df.copy(),
        data_type
    )

    if "error" in analysis:
        return {
            "success": False,
            "filename": file.filename,
            "data_type": data_type,
            "error": analysis["error"]
        }

    evidence = build_evidence(
            data_type=data_type,
            analysis=analysis,
            df=df
        )

    return {
            "success": True,
            "filename": file.filename,
            "data_type": data_type,
            "rows": len(df),
            "columns": list(df.columns),

            # Dataset-specific analysis
            "analysis": analysis,

            # Standardized evidence for AI
            "evidence": evidence
            }
# ============================================================
# /analyze-all
# ============================================================
@app.post("/analyze-all")
async def analyze_all(data: dict):
    if not data:
        return {
            "success": False,
            "error": "No analyzed data was provided."
        }

    valid_evidence = {}

    for data_type in DATA_TYPES:

        if data_type not in data:
            continue

        dataset = data[data_type]

        if not dataset:
            continue

        # Frontend is already sending the evidence object
        if isinstance(dataset, dict):

            # Case 1:
            # frontend sent:
            # { "evidence": {...} }
            if dataset.get("evidence") is not None:

                valid_evidence[data_type] = dataset["evidence"]

            # Case 2:
            # frontend directly sent:
            # { "source": ..., "dataset": ..., "kpis": ... }
            elif dataset.get("source") is not None:

                valid_evidence[data_type] = dataset

            # Case 3:
            # fallback if analysis object was sent
            elif dataset.get("analysis") is not None:

                valid_evidence[data_type] = dataset["analysis"]

    if not valid_evidence:
        return {
            "success": False,
            "error": "No valid analyzed evidence was provided."
        }

    print(
        "Valid evidence sources:",
        list(valid_evidence.keys())
    )

    # -----------------------------------------
    # SEND EVIDENCE TO QWEN
    # -----------------------------------------

    try:

        ai_result = get_ai_business_insight(
            valid_evidence
        )

    except Exception as e:

        print(
            "AI analysis error:",
            str(e)
        )

        return {
            "success": False,
            "error": f"AI analysis failed: {str(e)}"
        }

    return {
        "success": True,
        "source_count": len(valid_evidence),
        "sources_analyzed": list(
            valid_evidence.keys()
        ),
        "evidence": valid_evidence,
        "ai_analysis": ai_result
    }