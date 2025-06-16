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
import { createUserForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";
import { useRouter } from "next/navigation";
import { clientState } from "@/modules/auth/context/client";
import { useAtom } from "jotai";

export default function CreateUserModal() {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [response, dispatch] = useActionState(createUserForm, {
    messages: [],
    errors: [],
  });
  const [client] = useAtom(clientState);
  useFormResponse({
    response,
    onEnd: () => {
      router.refresh();
    },
  });

  const handleSubmit = (formData: FormData) => {
    console.log("formData", formData);
    dispatch(formData);
  onOpenChange();
  };

  return (
    <>
    { client?.role === 'admin' && (
      <Button onPress={onOpen} color="primary">
        Crear Usuario
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
                Crear Nuevo Usuario
              </ModalHeader>
              <form action={handleSubmit}>
                <ModalBody>
                  <FormUser />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                  >
                    Crear Usuario
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
