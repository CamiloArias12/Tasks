import { getAllProjectsService } from "@/modules/project/services";
import Projects from "@/modules/project/templates/projects";

export default async function Page() {

  const projects=await getAllProjectsService();
  
  return (
    <Projects data={projects.data ?? []} />
  );

}
