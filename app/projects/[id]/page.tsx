"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import QuantitativeDataUpload from "@/components/QuantitativeDataUpload";
import AnalyzeData from "@/components/AnalyzeData";

type Project = {
  id: string;
  name: string;
  description: string;
  website: string;
  country: string;
  industry: string;
};

type DataType =
  | "sales"
  | "customers"
  | "products"
  | "marketing"
  | "web_analytics"
  | "inventory";

type Dataset = {
  file: File;
  result: any;
};

export default function ProjectPage() {
  const params = useParams();

  const [project, setProject] =
    useState<Project | null>(null);

  /*
   * Store every uploaded/analyzed dataset separately.
   *
   * Example:
   *
   * {
   *   sales: {
   *     file: sales.csv,
   *     result: {...}
   *   },
   *
   *   inventory: {
   *     file: inventory.csv,
   *     result: {...}
   *   }
   * }
   */
  const [datasets, setDatasets] =
    useState<
      Partial<Record<DataType, Dataset>>
    >({});

  const [activeAnalysis, setActiveAnalysis] =
    useState<DataType | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (!error) {
        setProject(data);
      }
    };

    fetchProject();
  }, [params.id]);

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading project...</p>
      </main>
    );
  }

  /*
   * Called when a file is uploaded.
   *
   * We DO NOT analyze here.
   *
   * The Analyze button inside
   * QuantitativeDataUpload handles analysis.
   */
  const handleUpload = (
    file: File,
    dataType: string
  ) => {
    const type = dataType as DataType;

    setDatasets((previous) => ({
      ...previous,

      [type]: {
        file,
        result:
          previous[type]?.result ?? null,
      },
    }));
  };

  /*
   * Called when an individual dataset
   * finishes analysis.
   */
  const handleAnalyze = (
    dataType: string,
    result: any
  ) => {
    const type = dataType as DataType;

    setDatasets((previous) => {

      const existing = previous[type];

      if (!existing) {
        return previous;
      }

      return {
        ...previous,

        [type]: {
          ...existing,
          result,
        },
      };
    });

    // Automatically show the newly analyzed dataset
    setActiveAnalysis(type);
  };

  /*
   * Count uploaded datasets
   */
  const connectedCount =
    Object.keys(datasets).length;

  /*
   * Count analyzed datasets
   */
  const analyzedCount =
    Object.values(datasets).filter(
      (dataset) =>
        dataset?.result?.success
    ).length;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="mx-auto max-w-6xl">

        {/* ================================================== */}
        {/* PROJECT HEADER */}
        {/* ================================================== */}

        <section className="rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex flex-col justify-between gap-6 md:flex-row">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Project
              </p>

              <h1 className="mt-1 text-4xl font-bold text-black">
                {project.name}
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                {project.description}
              </p>

            </div>

            <div className="flex items-start">

              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                Active
              </span>

            </div>

          </div>

          {/* ================================================== */}
          {/* PROJECT METADATA */}
          {/* ================================================== */}

          <div className="mt-8 grid gap-4 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-sm text-gray-500">
                Industry
              </p>

              <p className="mt-1 font-medium text-black">
                {project.industry}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Country
              </p>

              <p className="mt-1 font-medium text-black">
                {project.country}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Website
              </p>

              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate font-medium text-blue-600 hover:underline"
              >
                {project.website}
              </a>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Project ID
              </p>

              <p className="mt-1 truncate text-sm font-medium text-black">
                {project.id}
              </p>
            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* DATA LINK LAYER */}
        {/* ================================================== */}

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <h2 className="text-2xl font-semibold text-black">
                  Data Link Layer
                </h2>

            

              </div>

              {/* Connected Counter */}

           

            </div>

          </div>


          {/* ================================================== */}
          {/* UPLOAD COMPONENT */}
          {/* ================================================== */}

          <QuantitativeDataUpload
            onUpload={handleUpload}
            onAnalyze={handleAnalyze}
          />


          {/* ================================================== */}
          {/* ANALYZED DATA SOURCES */}
          {/* ================================================== */}

          {analyzedCount > 0 && (

            <div className="mt-8">

              <div className="mb-5">

                <h3 className="text-xl font-semibold text-gray-900">
                  Analyzed Data Sources
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Select a data source to view its
                  analysis and visualizations.
                </p>

              </div>


              {/* ================================================== */}
              {/* SOURCE TABS */}
              {/* ================================================== */}

              <div className="flex flex-wrap gap-2">

                {Object.entries(datasets).map(
                  ([type, dataset]) => {

                    if (
                      !dataset?.result
                    ) {
                      return null;
                    }

                    const dataType =
                      type as DataType;

                    const isActive =
                      activeAnalysis ===
                      dataType;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setActiveAnalysis(
                            dataType
                          )
                        }
                        className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {getDataTypeName(
                          dataType
                        )}
                      </button>
                    );
                  }
                )}

              </div>


              {/* ================================================== */}
              {/* ACTIVE ANALYSIS */}
              {/* ================================================== */}

              {activeAnalysis &&
                datasets[
                  activeAnalysis
                ] && (

                  <AnalyzeData
                    file={
                      datasets[
                        activeAnalysis
                      ]!.file
                    }
                    dataType={
                      activeAnalysis
                    }
                    result={
                      datasets[
                        activeAnalysis
                      ]!.result
                    }
                  />

                )}

            </div>

          )}

        </section>


        {/* ================================================== */}
        {/* ANALYSIS STATUS */}
        {/* ================================================== */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Status
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {analyzedCount} of{" "}
                {connectedCount} connected data
                sources have been analyzed.
              </p>

            </div>

            <div className="text-right">

              <p className="text-2xl font-bold text-purple-600">
                {analyzedCount} /{" "}
                {connectedCount}
              </p>

              <p className="text-xs text-gray-500">
                Sources Analyzed
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}


/* ============================================================
   DATA TYPE DISPLAY NAME
============================================================ */

function getDataTypeName(
  dataType: DataType
) {
  const names: Record<
    DataType,
    string
  > = {
    sales: "Sales",
    customers: "Customers",
    products: "Products",
    marketing: "Marketing",
    web_analytics: "Web Analytics",
    inventory: "Inventory",
  };

  return names[dataType];
}