'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/modules/common/components/button';
import DataTable, { TableColumnConfig } from '@/modules/common/components/table';
import { Project } from '../types';
import { Task } from '@/modules/task/types';
import CreateTaskModal from '@/modules/task/components/create';
import EditTaskModal from '@/modules/task/components/edit';
import CommentsChat from '@/modules/comment/components/chat';
import { UserRes } from '@/modules/dashboard/types';
import { useState, useActionState, useCallback, useEffect } from 'react';
import { deleteTaskForm } from '@/modules/task/services/actions';
import { useFormResponse } from '@/modules/common/hooks/use-form-response';
import { useAtom } from 'jotai';
import { clientState } from '@/modules/auth/context/client';
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { FiSearch, FiFilter, FiX, FiCalendar } from 'react-icons/fi';

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  users?: UserRes[];
  currentUser?: UserRes;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export default function ProjectDetail({ project, tasks =[], users = [], currentUser, pagination }: ProjectDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [client] = useAtom(clientState);

  // Estado para controlar la hidratación
  const [isClient, setIsClient] = useState(false);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedUserId, setSelectedUserId] = useState(searchParams.get('userId') || '');
  const [selectedDueDate, setSelectedDueDate] = useState(searchParams.get('dueDate') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get('limit')) || 10);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(
    (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'ASC'
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [deleteResponse, deleteDispatch] = useActionState(deleteTaskForm, {
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
    updateFilters({
      search: value,
      status: selectedStatus,
      userId: selectedUserId,
      dueDate: selectedDueDate,
      limit: itemsPerPage
    });
  }, [selectedStatus, selectedUserId, selectedDueDate, itemsPerPage, updateFilters]);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
    updateFilters({
      search: searchTerm,
      status: value,
      userId: selectedUserId,
      dueDate: selectedDueDate,
      limit: itemsPerPage
    });
  }, [searchTerm, selectedUserId, selectedDueDate, itemsPerPage, updateFilters]);

  const handleUserIdChange = useCallback((value: string) => {
    setSelectedUserId(value);
    updateFilters({
      search: searchTerm,
      status: selectedStatus,
      userId: value,
      dueDate: selectedDueDate,
      limit: itemsPerPage
    });
  }, [searchTerm, selectedStatus, selectedDueDate, itemsPerPage, updateFilters]);

  const handleDueDateChange = useCallback((value: string) => {
    setSelectedDueDate(value);
    updateFilters({
      search: searchTerm,
      status: selectedStatus,
      userId: selectedUserId,
      dueDate: value,
      limit: itemsPerPage
    });
  }, [searchTerm, selectedStatus, selectedUserId, itemsPerPage, updateFilters]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateFilters({
      search: searchTerm,
      status: selectedStatus,
      userId: selectedUserId,
      dueDate: selectedDueDate,
      limit: itemsPerPage,
      page: page
    });
  }, [searchTerm, selectedStatus, selectedUserId, selectedDueDate, itemsPerPage, updateFilters]);

  const handleLimitChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    updateFilters({
      search: searchTerm,
      status: selectedStatus,
      userId: selectedUserId,
      dueDate: selectedDueDate,
      limit: limit
    });
  }, [searchTerm, selectedStatus, selectedUserId, selectedDueDate, updateFilters]);

  const handleSort = useCallback((column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortBy(column);
    setSortOrder(newSortOrder);
    updateFilters({
      search: searchTerm,
      status: selectedStatus,
      userId: selectedUserId,
      dueDate: selectedDueDate,
      limit: itemsPerPage,
      page: currentPage,
      sortBy: column,
      sortOrder: newSortOrder
    });
  }, [searchTerm, selectedStatus, selectedUserId, selectedDueDate, itemsPerPage, currentPage, sortBy, sortOrder, updateFilters]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedUserId('');
    setSelectedDueDate('');
    setCurrentPage(1);
    setItemsPerPage(10);
    setSortBy('');
    setSortOrder('ASC');

    router.push(`/dashboard/projects/${project.id}`);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      const formData = new FormData();
      formData.set('id', id);
      deleteDispatch(formData);
    }
  };

  const handleTaskCreated = () => {
    router.refresh();
  };

  const handleTaskUpdated = () => {
    router.refresh();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };

    const labels = {
      todo: 'Por Hacer',
      in_progress: 'En Progreso',
      completed: 'Completada',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name;
  };

  // Usar currentUser en lugar de client atom para evitar problemas de hidratación
  const isAdmin = currentUser?.role === 'admin';

  // Columnas de la tabla - siempre incluir actions column para evitar hidratación
  const taskColumns: TableColumnConfig[] = [
    {
      key: "title",
      label: "Título",
      sortable: true,
    },
    {
      key: "description",
      label: "Descripción",
      sortable: false,
    },
    {
      key: "status",
      label: "Estado",
      sortable: true,
    },
    {
      key: "dueDate",
      label: "Fecha Límite",
      sortable: true,
    },
    {
      key: "users",
      label: "Usuarios Asignados",
      sortable: false,
    },
    {
      key: "comments",
      label: "Comentarios",
      align: 'center',
    },
    {
      key: "actions",
      label: "Acciones",
      align: 'center' as "center",
    }
  ];

  const statuses = [
    { key: "todo", label: "Por Hacer" },
    { key: "in_progress", label: "En Progreso" },
    { key: "completed", label: "Completada" },
  ];

  const limitOptions = [
    { key: "5", label: "5 por página" },
    { key: "10", label: "10 por página" },
    { key: "25", label: "25 por página" },
    { key: "50", label: "50 por página" },
  ];

  const generatePageNumbers = () => {
    if (!pagination) return [];

    const { page: currentPage, totalPages } = pagination;
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

  // Solo mostrar el componente después de la hidratación para evitar diferencias
  if (!isClient) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Duración:</span> {project.duration} días
              </div>
              <div>
                <span className="font-semibold">Inicio:</span> {formatDate(project.startDate)}
              </div>
              <div>
                <span className="font-semibold">Fin:</span> {formatDate(project.endDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tareas del Proyecto</h2>
            {isAdmin && (
              <CreateTaskModal projectId={project.id!} users={users} onTaskCreated={handleTaskCreated} />
            )}
          </div>

          <div className="bg-white p-4 rounded-lg border mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Filtros</h3>
              {(searchTerm || selectedStatus || selectedUserId || selectedDueDate) && (
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Búsqueda */}
              <Input
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                startContent={<FiSearch className="w-4 h-4" />}
                isClearable
                onClear={() => handleSearch('')}
              />
              <Select
                placeholder="Estado"
                selectedKeys={selectedStatus ? [selectedStatus] : []}
                onSelectionChange={(keys) => {
                  const status = Array.from(keys)[0] as string;
                  handleStatusChange(status || '');
                }}
              >
                {statuses.map((status) => (
                  <SelectItem key={status.key}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                placeholder="Fecha límite"
                type="date"
                value={selectedDueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                startContent={<FiCalendar className="w-4 h-4" />}
                isClearable
                onClear={() => handleDueDateChange('')}
              />
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
            </div>

            {/* Información de resultados */}
            <div className="mt-4 text-sm text-gray-600">
              {pagination && (
                <span>
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} {' '}
                  de {pagination.total} tareas
                </span>
              )}
            </div>
          </div>

          <DataTable<Task>
            data={tasks}
            columns={taskColumns}
            ariaLabel="Tasks table"
            emptyContent={
              searchTerm || selectedStatus || selectedUserId || selectedDueDate
                ? "No se encontraron tareas con los filtros aplicados"
                : "No se encontraron tareas para este proyecto"
            }
            renderCell={(item, columnKey) => {
              switch (columnKey) {
                case "description":
                  return (
                    <div className="max-w-xs truncate" title={item.description}>
                      {item.description}
                    </div>
                  );
                case "status":
                  return getStatusBadge(item.status);
                case "dueDate":
                  return formatDate(item.dueDate);
                case "users":
                  return (
                    <div className="flex flex-wrap gap-1">
                      {item.users.map((userId, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {getUserName(userId)}
                        </span>
                      ))}
                    </div>
                  );
                case "comments":
                  return (
                    <Button
                      size="sm"
                      variant="ghost"
                      color="secondary"
                      onPress={() => setSelectedTask(item)}
                    >
                      Mensajes
                    </Button>
                  );
                case "actions":
                  return (
                    <div className="flex gap-2 justify-center">
                      {isAdmin ? (
                        <>
                          <EditTaskModal task={item} users={users} onTaskUpdated={handleTaskUpdated} />
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onPress={() => handleDeleteTask(item.id!)}
                          >
                            Eliminar
                          </Button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </div>
                  );
                default:
                  return item[columnKey as keyof Task];
              }
            }}
            sortDescriptor={sortBy ? {
              column: sortBy,
              direction: sortOrder.toLowerCase() as 'ascending' | 'descending'
            } : undefined}
            onSortChange={(descriptor) => {
              if (descriptor.column) {
                handleSort(descriptor.column as string);
              }
            }}
          />

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                size="sm"
                variant="ghost"
                isDisabled={pagination.page <= 1}
                onPress={() => handlePageChange(pagination.page - 1)}
              >
                Anterior
              </Button>

              {generatePageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={pageNum === pagination.page ? "solid" : "ghost"}
                  color={pageNum === pagination.page ? "primary" : "default"}
                  onPress={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                size="sm"
                variant="ghost"
                isDisabled={pagination.page >= pagination.totalPages}
                onPress={() => handlePageChange(pagination.page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>

        {selectedTask && (
          <CommentsChat
            task={selectedTask}
            currentUser={currentUser}
            users={users}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </div>
  );
}