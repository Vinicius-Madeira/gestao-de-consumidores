import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Company } from "@/schemas/CompanySchema";

export const CompanyForm = ({
  company,
  onSubmit,
  onCancel,
}: {
  company?: Company;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}) => (
  <form action={onSubmit} className="space-y-6">
    {/* Basic Information */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Gerais</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Empresa</Label>
          <Input
            id="name"
            name="name"
            defaultValue={company?.name}
            placeholder="Insira o nome da empresa"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName">Razão Social</Label>
          <Input
            id="businessName"
            name="businessName"
            defaultValue={company?.businessName}
            placeholder="Insira a razão social"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            name="cnpj"
            defaultValue={company?.cnpj}
            placeholder="00.000.000/0000-00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier">Distribuidora</Label>
          <Input
            id="supplier"
            name="supplier"
            defaultValue={company?.supplier}
            placeholder="Enel..."
            required
          />
        </div>
      </div>
    </div>

    {/* Address Information */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            name="street"
            defaultValue={company?.street}
            placeholder="Rua Exemplo..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressNumber">Number</Label>
          <Input
            id="addressNumber"
            name="addressNumber"
            defaultValue={company?.addressNumber}
            placeholder="Número"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            defaultValue={company?.city}
            placeholder="São Paulo..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            defaultValue={company?.state}
            placeholder="SP..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input
            id="zipCode"
            name="zipCode"
            defaultValue={company?.zipCode}
            placeholder="11111-000"
            required
          />
        </div>
      </div>
    </div>

    {/* Billing Information */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Faturamento e Consumo</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingRateType">Modalidade Tarifária</Label>
          <Input
            id="billingRateType"
            name="billingRateType"
            defaultValue={company?.billingRateType}
            placeholder="Azul, Verde..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="averageInvoiceValue">
            Valor Médio da Fatura (R$)
          </Label>
          <Input
            id="averageInvoiceValue"
            name="averageInvoiceValue"
            type="number"
            step="0.01"
            defaultValue={company?.averageInvoiceValue}
            placeholder="R$"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="peakConsumption">Consumo de Ponta (kWh)</Label>
          <Input
            id="peakConsumption"
            name="peakConsumption"
            type="number"
            defaultValue={company?.peakConsumption}
            placeholder="(kWh)"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="offPeakConsumption">
            Consumo Fora de Ponta (kWh)
          </Label>
          <Input
            id="offPeakConsumption"
            name="offPeakConsumption"
            type="number"
            defaultValue={company?.offPeakConsumption}
            placeholder="(kWh)"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="responsibleManager">Gestor Responsável</Label>
        <Input
          id="responsibleManager"
          name="responsibleManager"
          defaultValue={company?.responsibleManager}
          placeholder="(Opcional)"
        />
      </div>
    </div>

    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button className="text-white" type="submit">
        {company ? "Atualizar" : "Criar"} Empresa
      </Button>
    </div>
  </form>
);
