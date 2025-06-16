import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { User } from "../../types";
import { UserRes } from "@/modules/dashboard/types";

interface FormUserProps {
  user?: UserRes;
}

export function FormUser({ user }: FormUserProps) {
  const roles = [
    { key: "admin", label: "Administrador" },
    { key: "user", label: "Usuario" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Input
        name="name"
        label="Nombre"
        placeholder="Ingresa el nombre"
        defaultValue={user?.name}
        required
      />
      
      <Input
        name="email"
        type="email"
        label="Correo Electrónico"
        placeholder="Ingresa el email"
        defaultValue={user?.email}
        required
      />
      
      <Input
        name="password"
        type="password"
        label={user ? "Nueva Contraseña (opcional)" : "Contraseña"}
        placeholder={user ? "Dejar vacío para mantener la actual" : "Ingresa la contraseña"}
        required={!user}
      />
      
      <Select
        name="role"
        label="Rol"
        placeholder="Selecciona un rol"
        defaultSelectedKeys={user ? [user.role] : []}
        required
      >
        {roles.map((role) => (
          <SelectItem key={role.key}>
            {role.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
