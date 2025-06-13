"use client";

import { useState, useMemo } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { useCompanies } from "@/hooks/useCompanies";
import { Employee } from "@/schemas/EmployeeSchema";
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
  Phone,
  Mail,
  User,
  Building,
  X,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EmployeeForm } from "./EmployeeForm";
import DataCard from "@/components/data-card";

interface EmployeeFilters {
  identifier: string;
  name: string;
  role: string;
  companyId: string;
  email: string;
}

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<EmployeeFilters>({
    identifier: "",
    name: "",
    role: "",
    companyId: "",
    email: "",
  });

  // Get unique values for dropdown filters
  const uniqueRoles = useMemo(
    () => [...new Set(employees.map((e) => e.role))].filter(Boolean).sort(),
    [employees]
  );

  const uniqueCompanies = useMemo(
    () =>
      [...new Set(employees.map((e) => e.companyId))].filter(Boolean).sort(),
    [employees]
  );

  // Filter employees based on current filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      return (
        employee.identifier
          .toLowerCase()
          .includes(filters.identifier.toLowerCase()) &&
        employee.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        employee.role.toLowerCase().includes(filters.role.toLowerCase()) &&
        (filters.companyId === "" ||
          employee.companyId === filters.companyId) &&
        employee.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    });
  }, [employees, filters]);

  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      identifier: "",
      name: "",
      role: "",
      companyId: "",
      email: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

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
          <p className="text-muted-foreground">
            Gerencie os colaboradores
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600">
                ({filteredEmployees.length} de {employees.length} colaboradores)
              </span>
            )}
          </p>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="text-white">
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
        <DataCard
          title={
            hasActiveFilters
              ? "Colaboradores Filtrados"
              : "Total de Colaboradores"
          }
          icon={<User className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">{filteredEmployees.length}</div>
          {hasActiveFilters && (
            <p className="text-xs text-muted-foreground">
              de {employees.length} total
            </p>
          )}
        </DataCard>

        <DataCard
          title="Total de Empresas"
          icon={<Building className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">
            {new Set(filteredEmployees.map((e) => e.companyId)).size}
          </div>
        </DataCard>

        <DataCard
          title="Cargos Únicos"
          icon={<User className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">
            {new Set(filteredEmployees.map((e) => e.role)).size}
          </div>
        </DataCard>
      </div>

      {/* Data Table with Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Listagem de Colaboradores</CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar Filtros
                </Button>
              )}
              <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filtros
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1">
                        {Object.values(filters).filter((v) => v !== "").length}
                      </Badge>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </div>

          {/* Filters Section */}
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <CollapsibleContent className="space-y-4 pt-4 border-t">
              {/* Basic Information Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-identifier">ID</Label>
                  <Input
                    id="filter-identifier"
                    placeholder="Filtrar por ID..."
                    value={filters.identifier}
                    onChange={(e) =>
                      handleFilterChange("identifier", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-name">Nome</Label>
                  <Input
                    id="filter-name"
                    placeholder="Filtrar por nome..."
                    value={filters.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-email">Email</Label>
                  <Input
                    id="filter-email"
                    placeholder="Filtrar por email..."
                    value={filters.email}
                    onChange={(e) =>
                      handleFilterChange("email", e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Select
                      value={filters.role || "all"}
                      onValueChange={(value) =>
                        handleFilterChange("role", value === "all" ? "" : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {uniqueRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Select
                      value={filters.companyId || "all"}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "companyId",
                          value === "all" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {uniqueCompanies.map((companyId) => (
                          <SelectItem key={companyId} value={companyId}>
                            {getCompanyName(companyId)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dropdown Filters */}
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>

        <CardContent>
          <DataTable columns={columns} data={filteredEmployees} />
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
