import { Input } from "@/modules/common/components/input";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { Task } from "../../types";
import { UserRes } from "@/modules/dashboard/types";

interface FormTaskProps {
  task?: Task;
  projectId: string;
  users?: UserRes[];
}

export function FormTask({ task, projectId, users = [] }: FormTaskProps) {
  const statusOptions = [
    { key: 'todo', label: 'Por Hacer' },
    { key: 'in_progress', label: 'En Progreso' },
    { key: 'completed', label: 'Completada' },
  ];

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  console.log('Task:', task);
  console.log('Original date:', task?.dueDate);
  console.log('Formatted date:', formatDateForInput(task?.dueDate));

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="projectId" value={projectId} />
      
      <Input
        name="title"
        label="Título de la Tarea"
        placeholder="Ingresa el título de la tarea"
        defaultValue={task?.title}
        required
      />
      
      <Textarea
        name="description"
        label="Descripción"
        placeholder="Describe la tarea..."
        defaultValue={task?.description}
        required
      />
      
      <Select
        name="status"
        label="Estado"
        placeholder="Selecciona el estado"
        defaultSelectedKeys={task?.status ? [task.status] : ['todo']}
      >
        {statusOptions.map((option) => (
          <SelectItem key={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
      
      <Input
        name="dueDate"
        label="Fecha de Vencimiento"
        type="date"
        defaultValue={formatDateForInput(task?.dueDate)}
        required
      />
      
      <Select
        name="users"
        label="Usuarios Asignados"
        placeholder="Selecciona los usuarios"
        selectionMode="multiple"
        defaultSelectedKeys={task?.users || []}
      >
        {users.map((user) => (
          <SelectItem key={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}