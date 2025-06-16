import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { FormComment } from '../form';
import { Button } from "@/modules/common/components/button";
import { useActionState } from "react";
import { createCommentForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";
import { useState } from "react";

interface CreateCommentModalProps {
  taskId: string;
  userId: string;
  onCommentCreated?: () => void;
}

export default function CreateCommentModal({ taskId, userId, onCommentCreated }: CreateCommentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [response, dispatch] = useActionState(createCommentForm, {
    messages: [],
    errors: [],
  });
  
  useFormResponse({
    response,
    onEnd: () => {
      setIsSubmitting(false);
      onCommentCreated?.();
      onOpenChange();
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    dispatch(formData);
  };

  return (
    <>
      <Button onPress={onOpen} color="primary" size="sm">
        Agregar Comentario
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
              <ModalHeader className="flex flex-col gap-1">
                Nuevo Comentario
              </ModalHeader>
              <form action={handleSubmit}>
                <ModalBody>
                  <FormComment taskId={taskId} userId={userId} />
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
                    {isSubmitting ? 'Creando...' : 'Crear Comentario'}
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