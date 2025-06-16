'use client';

import { Button } from '@/modules/common/components/button';
import DataTable, { TableColumnConfig } from '@/modules/common/components/table';
import CreateProjectModal from '../components/create';
import EditProjectModal from '../components/edit';
import { Project } from '../types';
import { deleteProjectService } from '../services';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { startTransition, useActionState } from 'react';
import { deleteProjectForm } from '../services/actions';
import { form } from '@heroui/theme';
import { useFormResponse } from '@/modules/common/hooks/use-form-response';
import { clientState } from '@/modules/auth/context/client';
import { useAtom } from 'jotai';

export type ProjectsProps = {
  data: Project[];
};

export default function Projects(props: ProjectsProps) {
  const router = useRouter();
  const [response, dispatch] = useActionState(deleteProjectForm, {
    messages: [],
    errors: [],
  });
  const [client] = useAtom(clientState);

  const handleDelete =  (id: string) => {
    const formData = new FormData();
    formData.set('id', id);
    startTransition(() => {
      dispatch(formData);
    }
    );

  };
  useFormResponse({
    response,
    onEnd: () => {
      router.refresh();
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
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
      key: "duration",
      label: "Duración (días)",
      sortable: true,
      width: 150,
    },
    {
      key: "startDate",
      label: "Fecha Inicio",
      sortable: true,
      width: 130,
    },
    {
      key: "endDate",
      label: "Fecha Fin",
      sortable: true,
      width: 130,
    },
    {
      key: "actions",
      label: "ACCIONES",
      align: 'center',
      width: 200,
    },
  ];

  const handleProjectUpdated = () => {
    router.refresh();
  };

  return (
    <div className='p-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <CreateProjectModal />
      </div>

      <DataTable<Project>
        data={props.data}
        columns={columns}
        ariaLabel="Projects table"
        emptyContent="No se encontraron proyectos"
        renderCell={(item, columnKey) => {
          switch (columnKey) {
            case "name":
              return (
                <Link
                  href={`/dashboard/projects/${item.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  {item.name}
                </Link>
              );
            case "startDate":
            case "endDate":
              return formatDate(item[columnKey]);
            case "duration":
              return `${item.duration} días`;
            case "actions":
              return (
                <div className="flex gap-2 justify-center">
                  <Link href={`/dashboard/projects/${item.id}`}>
                    <Button size="sm" variant="ghost" color="secondary">
                      Ver
                    </Button>
                  </Link>
                  {client?.role === 'admin' && (
                    <>
                      <EditProjectModal project={item} onProjectUpdated={handleProjectUpdated} />
                      <Button
                        size="sm"
                        variant="ghost"
                        color="danger"
                        onPress={() => handleDelete(item.id!)}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </div>
              );
            default:
              return item[columnKey as keyof Project];
          }
        }}
      />
    </div>
  );
}
