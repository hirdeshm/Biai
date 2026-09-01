"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id: string;
  name: string;
  description: string;
  website: string;
  country: string;
  industry: string;
  created_at: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleDelete = async (
    e: React.MouseEvent,
    projectId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setDeletingId(projectId);
    setError("");

    const supabase = createClient();

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      setError(error.message);
      setDeletingId(null);
      return;
    }

    setProjects((prev) =>
      prev.filter((project) => project.id !== projectId)
    );

    setDeletingId(null);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-600">Loading projects...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              My Projects
            </h1>

            <p className="mt-2 text-slate-600">
              Manage your business intelligence projects.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            + New Project
          </Link>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </p>
        )}

        {/* Empty State */}
        {projects.length === 0 && !error && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No projects yet
            </h2>

            <p className="mt-2 text-slate-500">
              Create your first project to get started.
            </p>

            <Link
              href="/projects/new"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Create Project
            </Link>
          </div>
        )}

        {/* Projects */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => handleDelete(e, project.id)}
                disabled={deletingId === project.id}
                className="absolute right-4 top-4 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId === project.id ? "Deleting..." : "Delete"}
              </button>

              {/* Project Name */}
              <h2 className="pr-20 text-xl font-semibold text-slate-900">
                {project.name}
              </h2>

              {/* Description */}
              <p className="mt-3 line-clamp-3 text-slate-600">
                {project.description}
              </p>

              {/* Details */}
              <div className="mt-5 space-y-2 text-sm text-slate-500">
                <p>
                  <strong className="text-slate-700">Industry:</strong>{" "}
                  {project.industry}
                </p>

                <p>
                  <strong className="text-slate-700">Country:</strong>{" "}
                  {project.country}
                </p>
              </div>

              {/* View */}
              <p className="mt-5 font-medium text-blac-600 transition group-hover:text-blue-700">
                View Project →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}