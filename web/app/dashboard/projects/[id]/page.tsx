import { getProjectService } from "@/modules/project/services";
import ProjectDetail from "@/modules/project/templates/project-detail";
import { notFound } from "next/navigation";
import { getAllUsersService, getUserInfoByTokenService } from "@/modules/dashboard/services";
import { Suspense } from 'react';
import { getTasksByProjectService } from "@/modules/task/services";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    userId?: string;
    dueDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }>;
}

async function ProjectContent({ params, searchParams }: ProjectPageProps) {
  const { id } = await params;
  const queryParams = await searchParams;
  
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 10;
  const search = queryParams.search || '';
  const status = queryParams.status || '';
  const userId = queryParams.userId || '';
  const dueDate = queryParams.dueDate || '';
  const sortBy = queryParams.sortBy || '';
  const sortOrder = queryParams.sortOrder || 'ASC';

  const [projectResponse, tasksResponse, usersResponse, currentUser] = await Promise.all([
    getProjectService(id),
    getTasksByProjectService(id, {
      page,
      limit,
      search,
      status,
      userId,
      dueDate,
      sortBy,
      sortOrder,
    }),
    getAllUsersService(),
    getUserInfoByTokenService()
  ]);

  if (!projectResponse.data || !tasksResponse.data || !usersResponse.data || !currentUser.data) {
    notFound();
  }
  const tasks = tasksResponse.data.tasks || [];
  const pagination = {
    page: tasksResponse.data?.page || 1,
    totalPages: tasksResponse.data?.totalPages || 1,
    total: tasksResponse.data?.total || 0,
    limit: tasksResponse.data?.limit || 10,
  }

  return (
    <ProjectDetail 
      project={projectResponse.data} 
      tasks={tasks}
      users={usersResponse.data} 
      currentUser={currentUser.data}
      pagination={pagination}
    />
  );
}

export default function ProjectPage({ params, searchParams }: ProjectPageProps) {
  return (
    <Suspense fallback={
      <div className="p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    }>
      <ProjectContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

