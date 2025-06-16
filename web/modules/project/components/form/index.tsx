import { Input } from '@/modules/common/components/input';
import { Project } from '../../types';

interface FormProjectProps {
  project?: Project;
}

export function FormProject({ project }: FormProjectProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        name="name"
        label="Nombre del Proyecto"
        placeholder="Ingresa el nombre del proyecto"
        defaultValue={project?.name}
        required
      />
      
      <Input
        name="duration"
        label="Duración (días)"
        type="number"
        placeholder="30"
        defaultValue={project?.duration?.toString()}
        required
      />
      
      <Input
        name="startDate"
        label="Fecha de Inicio"
        type="date"
        defaultValue={project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
        required
      />
      
      <Input
        name="endDate"
        label="Fecha de Fin"
        type="date"
        defaultValue={project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''}
        required
      />
    </div>
  );
}
