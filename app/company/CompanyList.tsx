/* eslint-disable @typescript-eslint/no-unused-vars */
// components/CompanyList.tsx
"use client";

import { useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { Company } from "@/lib/dexie/db";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Building,
  Zap,
  DollarSign,
  User,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CompanyList() {
  const {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    searchCompanies,
  } = useCompanies();

  const [isCreating, setIsCreating] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleCreate = async (formData: FormData) => {
    const newCompany: Omit<Company, "id"> = {
      name: formData.get("name") as string,
      street: formData.get("street") as string,
      addressNumber: formData.get("addressNumber") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      zipCode: formData.get("zipCode") as string,
      businessName: formData.get("businessName") as string,
      cnpj: formData.get("cnpj") as string,
      supplier: formData.get("supplier") as string,
      billingRateType: formData.get("billingRateType") as string,
      peakConsumption: Number(formData.get("peakConsumption")),
      offPeakConsumption: Number(formData.get("offPeakConsumption")),
      averageInvoiceValue: Number(formData.get("averageInvoiceValue")),
      responsibleManager: formData.get("responsibleManager") as string,
    };

    try {
      await createCompany(newCompany);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create company:", error);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingCompany?.id) return;

    const updates: Partial<Company> = {
      name: formData.get("name") as string,
      street: formData.get("street") as string,
      addressNumber: formData.get("addressNumber") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      zipCode: formData.get("zipCode") as string,
      businessName: formData.get("businessName") as string,
      cnpj: formData.get("cnpj") as string,
      supplier: formData.get("supplier") as string,
      billingRateType: formData.get("billingRateType") as string,
      peakConsumption: Number(formData.get("peakConsumption")),
      offPeakConsumption: Number(formData.get("offPeakConsumption")),
      averageInvoiceValue: Number(formData.get("averageInvoiceValue")),
      responsibleManager: formData.get("responsibleManager") as string,
    };

    try {
      await updateCompany(editingCompany.id, updates);
      setEditingCompany(null);
    } catch (error) {
      console.error("Failed to update company:", error);
    }
  };

  const handleDelete = async (companyId: number) => {
    try {
      await deleteCompany(companyId);
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Format consumption with unit
  const formatConsumption = (value: number) => {
    return `${value.toLocaleString("pt-BR")} kWh`;
  };

  // Define table columns - only showing specified properties
  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Nome da Empresa",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Razão Social",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.getValue("businessName")}
        </span>
      ),
    },
    {
      accessorKey: "supplier",
      header: "Distribuidora",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("supplier")}</Badge>
      ),
    },
    {
      accessorKey: "billingRateType",
      header: "Modalidade Tarifária",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("billingRateType")}</Badge>
      ),
    },
    {
      accessorKey: "peakConsumption",
      header: "Consumo de Ponta",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-mono">
            {formatConsumption(row.getValue("peakConsumption"))}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "offPeakConsumption",
      header: "Consumo Fora de Ponta",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-mono">
            {formatConsumption(row.getValue("offPeakConsumption"))}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "averageInvoiceValue",
      header: "Valor Médio da Fatura",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="text-sm font-mono">
            {formatCurrency(row.getValue("averageInvoiceValue"))}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "responsibleManager",
      header: "Responsável",
      cell: ({ row }) => {
        const manager = row.getValue("responsibleManager") as string;
        return manager ? (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{manager}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Not assigned</span>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const company = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(company.cnpj)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar CNPJ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditingCompany(company)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Deseja remover esta empresa?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá excluir
                      permanentemente a empresa &quot;{company.name}&quot; do
                      banco de dados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(company.id!)}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
                    >
                      Deletar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Company form component
  const CompanyForm = ({
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
              placeholder="Enter company name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessName">Razão Social</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={company?.businessName}
              placeholder="Enter business name"
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
              placeholder="Enter CNPJ"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier">Distribuidora</Label>
            <Input
              id="supplier"
              name="supplier"
              defaultValue={company?.supplier}
              placeholder="Enter supplier"
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
              placeholder="Enter street address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressNumber">Number</Label>
            <Input
              id="addressNumber"
              name="addressNumber"
              defaultValue={company?.addressNumber}
              placeholder="Number"
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
              placeholder="Enter city"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              name="state"
              defaultValue={company?.state}
              placeholder="Enter state"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">CPF</Label>
            <Input
              id="zipCode"
              name="zipCode"
              defaultValue={company?.zipCode}
              placeholder="Enter ZIP code"
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
              placeholder="Enter billing rate type"
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
              placeholder="Enter average invoice value"
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
              placeholder="Enter peak consumption"
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
              placeholder="Enter off-peak consumption"
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
            placeholder="Enter responsible manager (optional)"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalPeakConsumption = companies.reduce(
    (sum, company) => sum + company.peakConsumption,
    0
  );
  const totalOffPeakConsumption = companies.reduce(
    (sum, company) => sum + company.offPeakConsumption,
    0
  );
  const totalInvoiceValue = companies.reduce(
    (sum, company) => sum + company.averageInvoiceValue,
    0
  );
  const uniqueSuppliers = new Set(companies.map((company) => company.supplier))
    .size;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie empresas e seus dados de consumo de energia
          </p>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="text-white">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Empresa</DialogTitle>
              <DialogDescription>
                Crie uma nova empresa para gerenciar seus dados de consumo de
                energia. Preencha todas as informações necessárias.
              </DialogDescription>
            </DialogHeader>
            <CompanyForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Empresas
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consumo de Ponta Total
            </CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatConsumption(totalPeakConsumption)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consumo Fora de Ponta Total
            </CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatConsumption(totalOffPeakConsumption)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Médio das Faturas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalInvoiceValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Company Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={companies} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCompany}
        onOpenChange={() => setEditingCompany(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update the company information. Make sure all required fields are
              filled.
            </DialogDescription>
          </DialogHeader>
          {editingCompany && (
            <CompanyForm
              company={editingCompany}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCompany(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
