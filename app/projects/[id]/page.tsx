"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import QuantitativeDataUpload from "@/components/QuantitativeDataUpload";
import DataCharts from "@/components/DataCharts";
import AnalyzeData from "@/components/AnalyzeData";

type Project = {
  id: string;
  name: string;
  description: string;
  website: string;
  country: string;
  industry: string;
};

export default function ProjectPage() {
  const params = useParams();

  const [project, setProject] =
    useState<Project | null>(null);

  const [uploadedFile, setUploadedFile] =
    useState<File | null>(null);

  const [dataType, setDataType] =
    useState<string>("");



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

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="mx-auto max-w-6xl">

        {/* ================= PROJECT HEADER ================= */}

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

          {/* Project Metadata */}

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

        {/* ================= DATA LINK LAYER ================= */}

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black">
              Data Link Layer
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload quantitative business data for analysis.
            </p>
          </div>

          {/* ================= UPLOAD ================= */}

          <QuantitativeDataUpload
            onUpload={(uploadedFile, uploadedDataType) => {
              setUploadedFile(uploadedFile);
              setDataType(uploadedDataType);
            }}
          />

          {/* ================= CHARTS ================= */}

          {uploadedFile && (
            <DataCharts
              file={uploadedFile}
              analyze={false}
            />
          )}

        </section>


        {/* ================= AI ANALYSIS ================= */}

        {uploadedFile && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <AnalyzeData
              file={uploadedFile}
              dataType={dataType}
            />

          </section>
        )}

      </div>

    </main>
  );
}