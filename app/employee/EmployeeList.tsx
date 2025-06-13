"use client";

import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { useCompanies } from "@/hooks/useCompanies";
import { Employee } from "@/schemas/EmployeeSchema";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Phone,
  Mail,
  User,
  Building,
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
import { EmployeeForm } from "./EmployeeForm";

interface EmployeeListProps {
  companyId?: string;
}

export default function EmployeeList({ companyId }: EmployeeListProps) {
  const {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees(companyId);

  const { companies } = useCompanies();
  const [isCreating, setIsCreating] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Get company name for display
  const getCompanyName = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.name || `Company #${companyId}`;
  };

  const handleCreate = async (formData: FormData) => {
    const newEmployee: Omit<Employee, "id"> = {
      identifier: formData.get("identifier") as string,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      companyId: formData.get("companyId") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
    };

    try {
      await createEmployee(newEmployee);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create employee:", error);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingEmployee?.id) return;

    const updates: Partial<Employee> = {
      identifier: formData.get("identifier") as string,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      companyId: formData.get("companyId") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
    };

    try {
      await updateEmployee(editingEmployee.id, updates);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const handleDelete = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  // Define table columns
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {getCompanyName(row.getValue("companyId"))}
          </span>
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
                      onClick={() => handleDelete(employee.id!)}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">
            Carregando Colaboradores...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <strong>Erro:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {companyId ? "Company Employees" : "Colaboradores"}
          </h1>
          <p className="text-muted-foreground">Gerencie os colaboradores</p>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="text-black dark:text-white">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
              <DialogDescription>
                Preencha todos os campos abaixo.
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm
              companies={companies}
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Colaboradores
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Empresas
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(employees.map((e) => e.companyId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listagem de Colaboradores</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={employees} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingEmployee}
        onOpenChange={() => setEditingEmployee(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Colaborador</DialogTitle>
            <DialogDescription>
              Atualizar as informações do colaborador selecionado. Certifique-se
              de que todos os campos obrigatórios estejam preenchidos.
            </DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <EmployeeForm
              employee={editingEmployee}
              companies={companies}
              onSubmit={handleUpdate}
              onCancel={() => setEditingEmployee(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
