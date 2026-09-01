from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

import os
import json

from dotenv import load_dotenv
from huggingface_hub import InferenceClient
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    print("WARNING: HF_TOKEN is not configured.")

llm_client = InferenceClient(
    api_key=HF_TOKEN
)

app = FastAPI(
    title="BusinessIntelligence.ai API",
    description="AI-powered KPI analysis backend",
    version="1.0.0"
)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# BASIC ROUTES
# =========================

@app.get("/")
def root():
    return {
        "message": "BusinessIntelligence.ai API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# =========================
# ANALYZE CSV
# =========================

def get_ai_feedback(evidence):
    if not HF_TOKEN:
        return {
            "error": "HF_TOKEN is not configured."
        }

    prompt = f"""
You are BusinessIntelligence.ai, an expert business intelligence analyst.

Analyze the quantitative business evidence provided below.

Your responsibilities:

1. Explain what changed in the KPI.
2. Determine whether the change is material.
3. Identify likely contributing factors.
4. Use only the evidence provided.
5. Do not invent facts.
6. Do not claim correlation is causation.
7. Give a confidence score from 0 to 100 for each possible cause.
8. Recommend practical business actions.
9. Clearly state uncertainty when the evidence is insufficient.
10. If there is no significant anomaly, say so instead of inventing a problem.

Return ONLY valid JSON in this format:

{{
    "summary": "Short executive summary",
    "severity": "NORMAL | MEDIUM | HIGH | CRITICAL",
    "likely_causes": [
        {{
            "cause": "Possible cause",
            "confidence": 0,
            "evidence": [
                "Evidence 1",
                "Evidence 2"
            ]
        }}
    ],
    "recommendations": [
        {{
            "action": "Recommended action",
            "priority": "LOW | MEDIUM | HIGH",
            "reason": "Why this action is recommended"
        }}
    ],
    "uncertainty": "What cannot be determined from the available data"
}}

BUSINESS EVIDENCE:

{json.dumps(evidence, indent=2)}
"""

    try:

        completion = llm_client.chat.completions.create(
            model="Qwen/Qwen3-8B",
            messages=[
                {
                    "role": "system",
                    "content": "You are a careful business intelligence analyst."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1200,
            temperature=0.2
        )

        response = completion.choices[0].message.content

        return response

    except Exception as e:

        return {
            "error": str(e)
        }

@app.post("/analyze")
async def analyze_data(
    file: UploadFile = File(...),
    data_type: str = Form(...)
):

    # -------------------------
    # Read CSV
    # -------------------------

    contents = await file.read()

    df = pd.read_csv(
        io.BytesIO(contents)
    )

    # Remove completely empty rows
    df = df.dropna(how="all")

    if df.empty:
        return {
            "success": False,
            "message": "CSV file contains no data."
        }

    # -------------------------
    # Basic information
    # -------------------------

    rows = len(df)

    columns = list(df.columns)

    # -------------------------
    # Initialize result
    # -------------------------

    result = {
        "success": True,
        "filename": file.filename,
        "data_type": data_type,
        "rows": rows,
        "columns": columns,
    }


    # =====================================================
    # SALES / REVENUE ANALYSIS
    # =====================================================

    if data_type == "sales":

        # Check revenue column

        if "revenue" not in df.columns:

            return {
                "success": False,
                "message": "Revenue column not found in sales CSV."
            }

        # Convert revenue to numeric

        df["revenue"] = pd.to_numeric(
            df["revenue"],
            errors="coerce"
        )

        df["revenue"] = df["revenue"].fillna(0)


        # -------------------------
        # Total revenue
        # -------------------------

        total_revenue = float(
            df["revenue"].sum()
        )


        # -------------------------
        # Average revenue
        # -------------------------

        average_revenue = float(
            df["revenue"].mean()
        )


        # -------------------------
        # Revenue change
        # -------------------------

        midpoint = len(df) // 2

        if midpoint > 0:

            first_half = df.iloc[:midpoint]

            second_half = df.iloc[midpoint:]

            first_average = float(
                first_half["revenue"].mean()
            )

            second_average = float(
                second_half["revenue"].mean()
            )

            if first_average != 0:

                revenue_change = (
                    (second_average - first_average)
                    / first_average
                ) * 100

            else:

                revenue_change = 0

        else:

            revenue_change = 0


        # -------------------------
        # Critical point
        # -------------------------

        if revenue_change <= -10:

            severity = "CRITICAL"

        elif revenue_change <= -5:

            severity = "HIGH"

        elif revenue_change <= -2:

            severity = "MEDIUM"

        else:

            severity = "NORMAL"


        anomaly = revenue_change <= -5


        # =================================================
        # REGION ANALYSIS
        # =================================================

        regions = []

        if "region" in df.columns:

            region_analysis = (
                df.groupby("region")["revenue"]
                .sum()
                .sort_values(ascending=False)
            )

            for region, revenue in region_analysis.items():

                regions.append({
                    "region": str(region),
                    "revenue": float(revenue)
                })


        # =================================================
        # PRODUCT ANALYSIS
        # =================================================

        products = []

        if "product_id" in df.columns:

            product_analysis = (
                df.groupby("product_id")["revenue"]
                .sum()
                .sort_values(ascending=False)
            )

            for product, revenue in product_analysis.items():

                products.append({
                    "product_id": str(product),
                    "revenue": float(revenue)
                })


        # =================================================
        # SALES CHANNEL ANALYSIS
        # =================================================

        channels = []

        if "sales_channel" in df.columns:

            channel_analysis = (
                df.groupby("sales_channel")["revenue"]
                .sum()
                .sort_values(ascending=False)
            )

            for channel, revenue in channel_analysis.items():

                channels.append({
                    "sales_channel": str(channel),
                    "revenue": float(revenue)
                })


        # =================================================
        # TOP REGION
        # =================================================

        if regions:

            top_region = regions[0]["region"]

            top_region_revenue = regions[0]["revenue"]

        else:

            top_region = "Not available"

            top_region_revenue = 0


        # =================================================
        # TOP PRODUCT
        # =================================================

        if products:

            top_product = products[0]["product_id"]

            top_product_revenue = products[0]["revenue"]

        else:

            top_product = "Not available"

            top_product_revenue = 0


        # =================================================
        # BUILD SALES RESULT
        # =================================================

        result["analysis"] = {

            "kpi": {
                "name": "Revenue",

                "total": round(
                    total_revenue,
                    2
                ),

                "average": round(
                    average_revenue,
                    2
                ),

                "change_percent": round(
                    revenue_change,
                    2
                )
            },

            "critical_point": {

                "detected": anomaly,

                "severity": severity
            },

            "top_region": {

                "name": top_region,

                "revenue": round(
                    top_region_revenue,
                    2
                )
            },

            "top_product": {

                "id": top_product,

                "revenue": round(
                    top_product_revenue,
                    2
                )
            },

            "regions": regions[:10],

            "products": products[:10],

            "channels": channels
        }


        # =================================================
        # EVIDENCE PACKAGE FOR LLM
        # =================================================

        result["llm_evidence"] = {

            "kpi": "Revenue",

            "revenue_change_percent": round(
                revenue_change,
                2
            ),

            "severity": severity,

            "total_revenue": round(
                total_revenue,
                2
            ),

            "top_region": top_region,

            "top_region_revenue": round(
                top_region_revenue,
                2
            ),

            "top_product": top_product,

            "top_product_revenue": round(
                top_product_revenue,
                2
            ),

            "regions": regions[:5],

            "products": products[:5],

            "channels": channels[:5]
        }

        # =====================================================
        # AI FEEDBACK
        # =====================================================


        ai_feedback = get_ai_feedback(
            result["llm_evidence"]
        )

        result["ai_feedback"] = ai_feedback


    # =====================================================
    # GENERIC DATASET
    # =====================================================

    else:

        numeric_columns = list(
            df.select_dtypes(
                include="number"
            ).columns
        )

        numeric_summary = {}

        for column in numeric_columns:

            numeric_summary[column] = {

                "total": float(
                    df[column].sum()
                ),

                "average": float(
                    df[column].mean()
                ),

                "minimum": float(
                    df[column].min()
                ),

                "maximum": float(
                    df[column].max()
                )
            }


        result["analysis"] = {

            "numeric_columns":
                numeric_summary
        }


    # =====================================================
    # DATA PREVIEW
    # =====================================================

    result["preview"] = (
        df.head(5)
        .fillna("")
        .to_dict(
            orient="records"
        )
    )


    return result