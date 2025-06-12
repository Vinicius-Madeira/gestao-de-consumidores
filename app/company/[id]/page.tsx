"use client";

export const dynamic = "force-static";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCompany } from "@/hooks/useCompany";
import { useParams } from "next/navigation";
import { CompanyForm } from "../CompanyForm";
import { useState } from "react";
import { Company, Employee } from "@/lib/dexie/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
  User,
  Zap,
  MapPin,
  FileText,
  Truck,
  Settings,
} from "lucide-react";
import { IconCurrencyReal } from "@tabler/icons-react";
import { formatConsumption, formatCurrency } from "@/lib/utils";
import { useEmployees } from "@/hooks/useEmployees";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { EmployeeForm } from "@/app/employee/EmployeeForm";

export default function Page() {
  const params = useParams();
  const {
    company,
    updateCompany,
    loading: companyLoading,
  } = useCompany(Number(params.id));
  const {
    employees,
    updateEmployee,
    deleteEmployee,
    loading: employeesLoading,
  } = useEmployees(Number(params.id));
  const [editingCompany, setEditingCompany] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  async function handleCompanyUpdate(formData: FormData) {
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
      await updateCompany(updates);
      setEditingCompany(false);
    } catch (error) {
      console.error(`Failed to update company ${company?.id}:`, error);
    }
  }

  async function handleEmployeeUpdate(formData: FormData) {
    if (!editingEmployee?.id) return;

    const updates: Partial<Employee> = {
      identifier: formData.get("identifier") as string,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      companyId: Number(formData.get("companyId")),
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
    };

    try {
      await updateEmployee(editingEmployee.id, updates);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  }

  const handleEmployeeDelete = async (employeeId: number) => {
    try {
      await deleteEmployee(employeeId);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  if (companyLoading || employeesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Empresa não encontrada. Por favor, retorne à página de Empresas.</p>
      </div>
    );
  }

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "identifier",
      header: "ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-sm">
            {row.getValue("identifier")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Cargo",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("role")}</Badge>
      ),
    },
    {
      accessorKey: "companyId",
      header: "Empresa",
      cell: () => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{company.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Telefone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.getValue("phoneNumber")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const employee = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(employee.email)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Copiar Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>
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
                      Deseja remover este colaborador?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá excluir
                      permanentemente o colaborador &quot;{employee.name}&quot;
                      do banco de dados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleEmployeeDelete(employee.id!)}
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

  return (
    <div className="flex flex-1">
      <main className="flex min-h-[99.8vh] h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {company.name}
              </h1>
              <p className="text-muted-foreground">
                Responsável: {company.responsibleManager || "Não informado"}
              </p>
            </div>

            {/* Edit Company Dialog */}
            <Dialog open={editingCompany} onOpenChange={setEditingCompany}>
              <DialogTrigger asChild>
                <Button className="text-white">
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Empresa</DialogTitle>
                  <DialogDescription>
                    Atualize os dados da empresa.
                  </DialogDescription>
                </DialogHeader>
                {editingCompany && (
                  <CompanyForm
                    company={company}
                    onSubmit={handleCompanyUpdate}
                    onCancel={() => setEditingCompany(false)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Company Information Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Address Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Endereço</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-sm">
                  <div className="font-medium">
                    {company.street}, {company.addressNumber}
                  </div>
                  <div className="text-muted-foreground">
                    {company.city}, {company.state}
                  </div>
                  <div className="text-muted-foreground">
                    CEP: {company.zipCode}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Informações Corporativas
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-sm">
                  <div className="font-medium">CNPJ</div>
                  <div className="text-muted-foreground font-mono">
                    {company.cnpj}
                  </div>
                  <div className="font-medium mt-2">Razão Social</div>
                  <div className="text-muted-foreground">
                    {company.businessName}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supplier and Billing Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Distribuidora e Modalidade
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-sm">
                  <div className="font-medium">Distribuidora</div>
                  <div className="text-muted-foreground mt-1">
                    <Badge variant="outline">{company.supplier}</Badge>
                  </div>
                  <div className="font-medium mt-2">Modalidade Tarifária</div>
                  <div className="text-muted-foreground mt-1">
                    <Badge variant="secondary">{company.billingRateType}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Consumption Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Consumo de Ponta
                </CardTitle>
                <Zap className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatConsumption(company.peakConsumption)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Consumo Fora de Ponta
                </CardTitle>
                <Zap className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatConsumption(company.offPeakConsumption)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Médio da Fatura
                </CardTitle>
                <IconCurrencyReal className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(company.averageInvoiceValue)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle>Listagem de Colaboradores</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={employees} />
            </CardContent>
          </Card>

          {/* Edit Employee Dialog */}
          <Dialog
            open={!!editingEmployee}
            onOpenChange={() => setEditingEmployee(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Colaborador</DialogTitle>
                <DialogDescription>
                  Atualizar as informações do colaborador selecionado.
                  Certifique-se de que todos os campos obrigatórios estejam
                  preenchidos.
                </DialogDescription>
              </DialogHeader>
              {editingEmployee && (
                <EmployeeForm
                  employee={editingEmployee}
                  companies={[company]}
                  onSubmit={handleEmployeeUpdate}
                  onCancel={() => setEditingEmployee(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
