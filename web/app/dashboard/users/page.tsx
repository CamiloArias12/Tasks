import { getUsersService } from '@/modules/user/services';
import Users from '@/modules/user/templates/users';
import { Suspense } from 'react';

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }>;
}

async function UsersContent({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || '';
  const role = params.role || '';
  const sortBy = params.sortBy || '';
  const sortOrder = params.sortOrder || 'ASC';

  const usersResult = await getUsersService({
    page,
    limit,
    search,
    role,
    sortBy,
    sortOrder,
  });

  if (usersResult.errors) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error cargando usuarios</h3>
          <ul className="text-red-600 text-sm">
            {usersResult.errors.map((error, index) => (
              <li key={index}>• {Array.isArray(error) ? error.join(', ') : error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  const pagination = {
    page: usersResult.data?.page || 1,
    totalPages: usersResult.data?.totalPages || 1,
    total: usersResult.data?.total || 0,
    limit: usersResult.data?.limit || 10,
  }
  return (
    <Users 
      data={usersResult.data?.users || []}
      pagination={pagination}
    />
  );
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <Suspense fallback={
      <div className="p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    }>
      <UsersContent searchParams={searchParams} />
    </Suspense>
  );
}
