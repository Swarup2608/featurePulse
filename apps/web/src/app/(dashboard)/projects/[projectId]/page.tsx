import { ProjectDetails } from "@/components/projects/project-details";

interface ProjectDetailsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { projectId } = await params;

  return <ProjectDetails projectId={projectId} />;
}
