import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { FormProject } from '../form';
import { Button } from "@/modules/common/components/button";
import { useActionState } from "react";
import { updateProjectForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";
import { Project } from "../../types";
import { useState } from "react";

interface EditProjectModalProps {
  project: Project;
  children?: React.ReactNode;
  onProjectUpdated?: () => void;
}

export default function EditProjectModal({ project, children, onProjectUpdated }: EditProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const [response, dispatch] = useActionState(updateProjectForm, {
    messages: [],
    errors: [],
  });
  
  useFormResponse({
    response,
    onEnd: () => {
      onClose();
      setIsSubmitting(false);
      onProjectUpdated?.();
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return; 
    
    setIsSubmitting(true);
    
    formData.set('id', project.id!);
    
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    
    if (startDate) {
      formData.set('startDate', new Date(startDate).toISOString());
    }
    if (endDate) {
      formData.set('endDate', new Date(endDate).toISOString());
    }
    
    dispatch(formData);
  };

  const handleClose = () => {
    setIsSubmitting(false);
    onClose();
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
                Editar Proyecto
              </ModalHeader>
              <form action={handleSubmit}>
                <ModalBody>
                  <FormProject project={project} />
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
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Proyecto'}
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