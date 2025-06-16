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
import { createTaskForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";
import { useState } from "react";
import { UserRes } from "@/modules/dashboard/types";

interface CreateTaskModalProps {
  projectId: string;
  users?: UserRes[];
  onTaskCreated?: () => void;
}

export default function CreateTaskModal({ projectId, users = [], onTaskCreated }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const [response, dispatch] = useActionState(createTaskForm, {
    messages: [],
    errors: [],
  });
  
  useFormResponse({
    response,
    onEnd: () => {
      setIsSubmitting(false);
      onTaskCreated?.();
      onClose();
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const dueDate = formData.get('dueDate') as string;
    if (dueDate) {
      formData.set('dueDate', new Date(dueDate).toISOString());
    }
    
    const users = formData.getAll('users') as string[];
    formData.delete('users');
    users.forEach((user, index) => {
      formData.append(`users[${index}]`, user);
    });
    
    dispatch(formData);
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Nueva Tarea
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"/>
                
              <form action={handleSubmit}>
                <ModalBody>
                  <FormTask projectId={projectId} users={users} />
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
                    {isSubmitting ? 'Creando...' : 'Crear Tarea'}
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