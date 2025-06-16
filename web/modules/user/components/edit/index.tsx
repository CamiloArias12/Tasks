import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { FormUser } from '../form';
import { Button } from "@/modules/common/components/button";
import { useActionState } from "react";
import { updateUserForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";
import { useRouter } from "next/navigation";
import { User } from "../../types";
import { useState } from "react";
import { UserRes } from "@/modules/dashboard/types";

interface EditUserModalProps {
  user: UserRes
  children?: React.ReactNode;
}

export default function EditUserModal({ user, children }: EditUserModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const [response, dispatch] = useActionState(updateUserForm, {
    messages: [],
    errors: [],
  });

  useFormResponse({
    response,
    onEnd: () => {
      setIsSubmitting(false);
      onClose();
      router.refresh();
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (isSubmitting || !open) return;
    
    setIsSubmitting(true);
    console.log("formData update", formData);
    formData.set('id', user.id!);
    dispatch(formData);
  };

  return (
    <>
      {children ? (
        <div onClick={onOpen} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button onPress={onOpen} color="primary" size="sm">
          Editar
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
                Editar Usuario
              </ModalHeader>
              <form action={handleSubmit}>
                <ModalBody>
                  <FormUser user={user} />
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
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Usuario'}
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