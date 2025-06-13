import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "@/schemas/CompanySchema";
import { Employee } from "@/schemas/EmployeeSchema";

export const EmployeeForm = ({
  employee,
  companies,
  onSubmit,
  onCancel,
}: {
  employee?: Employee;
  companies?: Company[];
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}) => (
  <form action={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Identificador</Label>
        <Input
          id="identifier"
          name="identifier"
          defaultValue={employee?.identifier}
          placeholder="Cliente, Colaborador..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          defaultValue={employee?.name}
          placeholder="Insira o nome completo"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="role">Cargo</Label>
        <Input
          id="role"
          name="role"
          defaultValue={employee?.role}
          placeholder="Desenvolvedor..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyId">Empresa</Label>
        <Select name="companyId" defaultValue={employee?.companyId?.toString()}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a Empresa" />
          </SelectTrigger>
          <SelectContent>
            {companies?.map((company) => (
              <SelectItem key={company.id} value={company.id!.toString()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Número de Telefone</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          defaultValue={employee?.phoneNumber}
          placeholder="99999-9999"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={employee?.email}
          placeholder="seuemail@exemplo.com"
          required
        />
      </div>
    </div>

    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button className="text-white" type="submit">
        {employee ? "Atualizar" : "Criar"} Colaborador
      </Button>
    </div>
  </form>
);
