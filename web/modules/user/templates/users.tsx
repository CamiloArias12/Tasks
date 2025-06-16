'use client';

import { Button } from '@/modules/common/components/button';
import DataTable, { TableColumnConfig } from '@/modules/common/components/table';
import { UserRes } from '@/modules/dashboard/types';
import CreateUserModal from '../components/create';
import EditUserModal from '../components/edit';
import { startTransition, useActionState, useState, useCallback } from 'react';
import { deleteUserForm } from '../services/actions';
import { useFormResponse } from '@/modules/common/hooks/use-form-response';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export type UsersProps = {
  data: UserRes[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
};

export default function Users(props: UsersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get('limit')) || 10);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(
    (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'ASC'
  );

  const [deleteResponse, deleteDispatch] = useActionState(deleteUserForm, {
    messages: [],
    errors: [],
  });

  useFormResponse({
    response: deleteResponse,
    onEnd: () => {
      router.refresh();
    },
  });

  // Función para actualizar la URL con los filtros
  const updateFilters = useCallback((filters: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Resetear página cuando cambian los filtros (excepto cuando se cambia la página directamente)
    if (!filters.page) {
      params.set('page', '1');
      setCurrentPage(1);
    }

    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  // Handlers para los filtros
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value, role: selectedRole, limit: itemsPerPage });
  }, [selectedRole, itemsPerPage, updateFilters]);

  const handleRoleChange = useCallback((value: string) => {
    setSelectedRole(value);
    updateFilters({ search: searchTerm, role: value, limit: itemsPerPage });
  }, [searchTerm, itemsPerPage, updateFilters]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateFilters({ 
      search: searchTerm, 
      role: selectedRole, 
      limit: itemsPerPage, 
      page: page 
    });
  }, [searchTerm, selectedRole, itemsPerPage, updateFilters]);

  const handleLimitChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    updateFilters({ 
      search: searchTerm, 
      role: selectedRole, 
      limit: limit 
    });
  }, [searchTerm, selectedRole, updateFilters]);

  const handleSort = useCallback((column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortBy(column);
    setSortOrder(newSortOrder);
    updateFilters({ 
      search: searchTerm, 
      role: selectedRole, 
      limit: itemsPerPage,
      page: currentPage,
      sortBy: column,
      sortOrder: newSortOrder
    });
  }, [searchTerm, selectedRole, itemsPerPage, currentPage, sortBy, sortOrder, updateFilters]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setCurrentPage(1);
    setItemsPerPage(10);
    setSortBy('');
    setSortOrder('ASC');
    router.push('/dashboard/users');
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const formData = new FormData();
      formData.set('id', id);
      startTransition(() => {
        deleteDispatch(formData);
      });
    }
  };

  const columns: TableColumnConfig[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      width: 80,
    },
    {
      key: "name",
      label: "Nombre",
      sortable: true,
    },
    {
      key: "email",
      label: "Correo",
      sortable: true,
    },
    {
      key: "role",
      label: "Rol",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Fecha Creación",
      sortable: true,
    },
    {
      key: "actions",
      label: "Acciones",
      align: 'center',
    },
  ];

  const roles = [
    { key: "admin", label: "Administrador" },
    { key: "user", label: "Usuario" },
  ];

  const limitOptions = [
    { key: "5", label: "5 por página" },
    { key: "10", label: "10 por página" },
    { key: "25", label: "25 por página" },
    { key: "50", label: "50 por página" },
  ];

  const getRoleInSpanish = (role: string) => {
    const roleMap = {
      'admin': 'Administrador',
      'user': 'Usuario',
      'manager': 'Gerente',
      'employee': 'Empleado',
      'client': 'Cliente',
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const generatePageNumbers = () => {
    if (!props.pagination) return [];
    
    const { page: currentPage, totalPages } = props.pagination;
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className='p-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <CreateUserModal />
      </div>
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filtros</h3>
          {(searchTerm || selectedRole) && (
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={clearFilters}
              startContent={<FiX />}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            startContent={<FiSearch className="w-4 h-4" />}
            isClearable
            onClear={() => handleSearch('')}
          />
          <Select
            placeholder="Filtrar por rol"
            selectedKeys={selectedRole ? [selectedRole] : []}
            onSelectionChange={(keys) => {
              const role = Array.from(keys)[0] as string;
              handleRoleChange(role || '');
            }}
          >
            {roles.map((role) => (
              <SelectItem key={role.key}>
                {role.label}
              </SelectItem>
            ))}
          </Select>          
          <Select
            placeholder="Items por página"
            selectedKeys={[itemsPerPage.toString()]}
            onSelectionChange={(keys) => {
              const limit = Number(Array.from(keys)[0]);
              handleLimitChange(limit);
            }}
          >
            {limitOptions.map((option) => (
              <SelectItem key={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </Select>          
          <div className="flex items-center text-sm text-gray-600">
            {props.pagination && (
              <span>
                Mostrando {((props.pagination.page - 1) * props.pagination.limit) + 1} - {' '}
                {Math.min(props.pagination.page * props.pagination.limit, props.pagination.total)} {' '}
                de {props.pagination.total} usuarios
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <DataTable<UserRes>
        data={props.data}
        columns={columns}
        ariaLabel="Users table"
        emptyContent="No se encontraron usuarios"
        renderCell={(item, columnKey) => {
          switch (columnKey) {
            case "role":
              return getRoleInSpanish(item.role);
            case "actions":
              return (
                <div className="flex gap-2 justify-center">
                  <EditUserModal user={item} />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    color="danger"
                    onPress={() => handleDeleteUser(item.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              );
            default:
              return item[columnKey as keyof UserRes];
          }
        }}
        // Configuración de sorting
        sortDescriptor={{
          column: sortBy,
          direction: sortOrder.toLowerCase() as 'ascending' | 'descending'
        }}
        onSortChange={(descriptor) => {
          if (descriptor.column) {
            handleSort(descriptor.column as string);
          }
        }}
      />

      {/* Paginación */}
      {props.pagination && props.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            size="sm"
            variant="ghost"
            isDisabled={props.pagination.page <= 1}
            onPress={() => handlePageChange(props.pagination!.page - 1)}
          >
            Anterior
          </Button>
          
          {generatePageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              size="sm"
              variant={pageNum === props.pagination!.page ? "solid" : "ghost"}
              color={pageNum === props.pagination!.page ? "primary" : "default"}
              onPress={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
          
          <Button
            size="sm"
            variant="ghost"
            isDisabled={props.pagination.page >= props.pagination.totalPages}
            onPress={() => handlePageChange(props.pagination!.page + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
