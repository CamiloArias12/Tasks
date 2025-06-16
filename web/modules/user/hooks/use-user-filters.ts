import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface UserFilters {
  search: string;
  role: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export function useUserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<UserFilters>({
    search: searchParams.get('search') || '',
    role: searchParams.get('role') || '',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    sortBy: searchParams.get('sortBy') || '',
    sortOrder: (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'ASC',
  });

  const updateURL = useCallback((newFilters: Partial<UserFilters>) => {
    const params = new URLSearchParams();
    
    const updatedFilters = { ...filters, ...newFilters };
    
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`);
    setFilters(updatedFilters);
  }, [filters, router]);

  const clearFilters = useCallback(() => {
    const defaultFilters: UserFilters = {
      search: '',
      role: '',
      page: 1,
      limit: 10,
      sortBy: '',
      sortOrder: 'ASC',
    };
    
    setFilters(defaultFilters);
    router.push('/dashboard/users');
  }, [router]);

  return {
    filters,
    updateURL,
    clearFilters,
  };
}