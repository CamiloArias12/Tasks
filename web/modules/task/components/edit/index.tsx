import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { FormTask } from '../form';
import { Button } from "@/modules/common/components/button";
import { useActionState } from "react";
import { updateTaskForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";
import { useRouter } from "next/navigation";
import { Task } from "../../types";
import { useState, useEffect } from "react";
import { UserRes } from "@/modules/dashboard/types";

interface EditTaskModalProps {
  task: Task;
  users?: UserRes[];
  children?: React.ReactNode;
  onTaskUpdated?: () => void;
}

export default function EditTaskModal({ task, users = [], children, onTaskUpdated }: EditTaskModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [response, dispatch] = useActionState(updateTaskForm, {
    messages: [],
    errors: [],
  });


  useFormResponse({
    response,
    onEnd: () => {
      setIsSubmitting(false);
      onTaskUpdated?.();
      onOpenChange();
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    formData.set('id', task.id!);

    const dueDate = formData.get('dueDate') as string;
    if (dueDate) {
      formData.set('dueDate', new Date(dueDate).toISOString());
    }

    const users = formData.getAll('users') as string[];
    formData.delete('users');
    users.forEach((user, index) => {
      formData.append(`users[${index}]`, user);
    });

    console.log('Submitting form data:', Object.fromEntries(formData.entries()));
    dispatch(formData);
  };

  const handleClose = () => {
    setIsSubmitting(false);
    onOpenChange();
  };

  return (
    <>
      {children ? (
        <div onClick={onOpen} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button onPress={onOpen} color="primary">Editar</Button>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={handleClose}
        placement="center"
        size="2xl"
        isDismissable={!isSubmitting}
        hideCloseButton={isSubmitting}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Tarea
              </ModalHeader>
              <form action={handleSubmit}>
                <ModalBody>
                  <FormTask task={task} projectId={task.projectId} users={users} />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    isDisabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                  >
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Tarea'}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}