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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading projects...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black">
              My Projects
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your projects here.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
          >
            + New Project
          </Link>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </p>
        )}

        {projects.length === 0 && !error && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No projects yet
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first project to get started.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-black">
                {project.name}
              </h2>

              <p className="mt-3 line-clamp-3 text-gray-600">
                {project.description}
              </p>

              <div className="mt-5 space-y-2 text-sm text-gray-500">
                <p>
                  <strong>Industry:</strong> {project.industry}
                </p>

                <p>
                  <strong>Country:</strong> {project.country}
                </p>
              </div>

              <p className="mt-5 font-medium text-black">
                View Project →
              </p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}