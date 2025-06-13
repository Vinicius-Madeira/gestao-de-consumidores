"use client";

import { useState, useMemo } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { Company } from "@/schemas/CompanySchema";
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
  Search,
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
import { IconCurrencyReal } from "@tabler/icons-react";
import Link from "next/link";
import { CompanyForm } from "./CompanyForm";
import { formatConsumption, formatCurrency } from "@/lib/utils";
import DataCard from "@/components/data-card";

interface CompanyFilters {
  name: string;
  businessName: string;
  supplier: string;
  billingRateType: string;
  responsibleManager: string;
  minPeakConsumption: string;
  maxPeakConsumption: string;
  minOffPeakConsumption: string;
  maxOffPeakConsumption: string;
  minInvoiceValue: string;
  maxInvoiceValue: string;
}

export default function CompanyList() {
  const {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
  } = useCompanies();

  const [isCreating, setIsCreating] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CompanyFilters>({
    name: "",
    businessName: "",
    supplier: "",
    billingRateType: "",
    responsibleManager: "",
    minPeakConsumption: "",
    maxPeakConsumption: "",
    minOffPeakConsumption: "",
    maxOffPeakConsumption: "",
    minInvoiceValue: "",
    maxInvoiceValue: "",
  });

  // Get unique values for dropdown filters
  const uniqueSuppliers = useMemo(
    () => [...new Set(companies.map((c) => c.supplier))].filter(Boolean).sort(),
    [companies]
  );

  const uniqueBillingRates = useMemo(
    () =>
      [...new Set(companies.map((c) => c.billingRateType))]
        .filter(Boolean)
        .sort(),
    [companies]
  );

  // Filter companies based on current filters
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        company.businessName
          .toLowerCase()
          .includes(filters.businessName.toLowerCase()) &&
        (filters.supplier === "" || company.supplier === filters.supplier) &&
        (filters.billingRateType === "" ||
          company.billingRateType === filters.billingRateType) &&
        company
          .responsibleManager!.toLowerCase()
          .includes(filters.responsibleManager.toLowerCase()) &&
        (filters.minPeakConsumption === "" ||
          company.peakConsumption >= Number(filters.minPeakConsumption)) &&
        (filters.maxPeakConsumption === "" ||
          company.peakConsumption <= Number(filters.maxPeakConsumption)) &&
        (filters.minOffPeakConsumption === "" ||
          company.offPeakConsumption >=
            Number(filters.minOffPeakConsumption)) &&
        (filters.maxOffPeakConsumption === "" ||
          company.offPeakConsumption <=
            Number(filters.maxOffPeakConsumption)) &&
        (filters.minInvoiceValue === "" ||
          company.averageInvoiceValue >= Number(filters.minInvoiceValue)) &&
        (filters.maxInvoiceValue === "" ||
          company.averageInvoiceValue <= Number(filters.maxInvoiceValue))
      );
    });
  }, [companies, filters]);

  const handleFilterChange = (key: keyof CompanyFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      businessName: "",
      supplier: "",
      billingRateType: "",
      responsibleManager: "",
      minPeakConsumption: "",
      maxPeakConsumption: "",
      minOffPeakConsumption: "",
      maxOffPeakConsumption: "",
      minInvoiceValue: "",
      maxInvoiceValue: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

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

  const handleDelete = async (companyId: string) => {
    try {
      await deleteCompany(companyId);
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Nome da Empresa",
      cell: ({ row }) => (
        <Link href={`/company/${row.original.id}`}>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        </Link>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Razão Social",
      cell: ({ row }) => (
        <Link href={`/company/${row.original.id}`}>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.getValue("businessName")}
          </span>
        </Link>
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
          <span className="text-sm text-gray-400 italic">Não informado</span>
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

  // Calculate statistics (use filtered companies for stats)
  const totalPeakConsumption = filteredCompanies.reduce(
    (sum, company) => sum + company.peakConsumption,
    0
  );
  const totalOffPeakConsumption = filteredCompanies.reduce(
    (sum, company) => sum + company.offPeakConsumption,
    0
  );
  const totalInvoiceValue = filteredCompanies.reduce(
    (sum, company) => sum + company.averageInvoiceValue,
    0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie empresas e seus dados de consumo de energia
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600">
                ({filteredCompanies.length} de {companies.length} empresas)
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
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
                  Preencha todos os campos abaixo.
                </DialogDescription>
              </DialogHeader>
              <CompanyForm
                onSubmit={handleCreate}
                onCancel={() => setIsCreating(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards - now showing filtered data */}
      <div className="grid gap-4 md:grid-cols-4">
        <DataCard
          title={hasActiveFilters ? "Empresas Filtradas" : "Total de Empresas"}
          icon={<Building className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">{filteredCompanies.length}</div>
          {hasActiveFilters && (
            <p className="text-xs text-muted-foreground">
              de {companies.length} total
            </p>
          )}
        </DataCard>

        <DataCard
          title="Consumo de Ponta Total"
          icon={<Zap className="h-4 w-4 text-orange-500" />}
        >
          <div className="text-2xl font-bold">
            {formatConsumption(totalPeakConsumption)}
          </div>
        </DataCard>

        <DataCard
          title="Consumo Fora de Ponta Total"
          icon={<Zap className="h-4 w-4 text-blue-500" />}
        >
          <div className="text-2xl font-bold">
            {formatConsumption(totalOffPeakConsumption)}
          </div>
        </DataCard>

        <DataCard
          title="Valor Médio das Faturas"
          icon={<DollarSign className="h-4 w-4 text-green-500" />}
        >
          <div className="text-2xl font-bold">
            {formatCurrency(totalInvoiceValue)}
          </div>
        </DataCard>
      </div>

      {/* Data Table with Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Listagem de Empresas</CardTitle>
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
                  <Label htmlFor="filter-name">Nome da Empresa</Label>
                  <Input
                    id="filter-name"
                    placeholder="Filtrar por nome..."
                    value={filters.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-business-name">Razão Social</Label>
                  <Input
                    id="filter-business-name"
                    placeholder="Filtrar por razão social..."
                    value={filters.businessName}
                    onChange={(e) =>
                      handleFilterChange("businessName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-responsible">Responsável</Label>
                  <Input
                    id="filter-responsible"
                    placeholder="Filtrar por responsável..."
                    value={filters.responsibleManager}
                    onChange={(e) =>
                      handleFilterChange("responsibleManager", e.target.value)
                    }
                  />
                </div>
                <div id="select boxes" className="flex justify-center gap-8">
                  <div className="space-y-2">
                    <Label>Distribuidora</Label>
                    <Select
                      value={filters.supplier || "all"}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "supplier",
                          value === "all" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {uniqueSuppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Modalidade Tarifária</Label>
                    <Select
                      value={filters.billingRateType || "all"}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "billingRateType",
                          value === "all" ? "" : value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {uniqueBillingRates.map((rate) => (
                          <SelectItem key={rate} value={rate}>
                            {rate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dropdown Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>

              {/* Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Consumo de Ponta (kWh)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPeakConsumption}
                      onChange={(e) =>
                        handleFilterChange("minPeakConsumption", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPeakConsumption}
                      onChange={(e) =>
                        handleFilterChange("maxPeakConsumption", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Consumo Fora de Ponta (kWh)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minOffPeakConsumption}
                      onChange={(e) =>
                        handleFilterChange(
                          "minOffPeakConsumption",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxOffPeakConsumption}
                      onChange={(e) =>
                        handleFilterChange(
                          "maxOffPeakConsumption",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Valor Médio da Fatura (R$)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minInvoiceValue}
                      onChange={(e) =>
                        handleFilterChange("minInvoiceValue", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxInvoiceValue}
                      onChange={(e) =>
                        handleFilterChange("maxInvoiceValue", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>

        <CardContent>
          <DataTable columns={columns} data={filteredCompanies} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCompany}
        onOpenChange={() => setEditingCompany(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>Atualize os dados da empresa.</DialogDescription>
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
