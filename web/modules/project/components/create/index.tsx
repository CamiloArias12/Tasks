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
import { createProjectForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAtom } from "jotai";
import { clientState } from "@/modules/auth/context/client";

export default function CreateProjectModal() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [client]=useAtom(clientState);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [response, dispatch] = useActionState(createProjectForm, {
    messages: [],
    errors: [],
  });
  
  useFormResponse({
    response,
    onEnd: () => {
      setIsSubmitting(false);
      router.refresh();
      onOpenChange();
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return; // Prevenir envíos múltiples
    
    setIsSubmitting(true);
    
    // Convertir las fechas al formato ISO
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

  return (
    <>
    { client?.role === 'admin' && (
      <Button onPress={onOpen} color="primary">
        Crear Proyecto
      </Button>
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
                Crear Nuevo Proyecto
              </ModalHeader>
              <form action={handleSubmit}>
                <ModalBody>
                  <FormProject />
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
                    {isSubmitting ? 'Creando...' : 'Crear Proyecto'}
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
