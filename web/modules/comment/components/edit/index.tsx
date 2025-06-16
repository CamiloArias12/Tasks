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
import { updateCommentForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";
import { Comment } from "../../types";
import { useState } from "react";

interface EditCommentModalProps {
  comment: Comment;
  children?: React.ReactNode;
  onCommentUpdated?: () => void;
}

export default function EditCommentModal({ comment, children, onCommentUpdated }: EditCommentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [response, dispatch] = useActionState(updateCommentForm, {
    messages: [],
    errors: [],
  });
  
  useFormResponse({
    response,
    onEnd: () => {
      setIsSubmitting(false);
      onCommentUpdated?.();
      onOpenChange();
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    formData.set('id', comment.id!);
    dispatch(formData);
  };

  return (
    <>
      {children ? (
        <div onClick={onOpen} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button onPress={onOpen} color="primary" size="sm">Editar</Button>
      )}
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
                Editar Comentario
              </ModalHeader>
              <form action={handleSubmit}>
                <ModalBody>
                  <FormComment comment={comment} taskId={comment.taskId} userId={comment.userId} />
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
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Comentario'}
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