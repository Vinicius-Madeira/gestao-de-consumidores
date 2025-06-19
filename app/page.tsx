"use client";

import FileUploader from "@/components/import-button";
import { useCompanies } from "@/hooks/useCompanies";
import { useEmployees } from "@/hooks/useEmployees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, User, Zap, Users, TrendingUp, Activity } from "lucide-react";
import { IconCurrencyReal } from "@tabler/icons-react";
import { formatConsumption, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/data-card";
import ExportButton from "@/components/export-button";

export const dynamic = "force-static";

export default function DashboardPage() {
  const {
    companies,
    loading: companiesLoading,
    refreshCompanies,
  } = useCompanies();
  const {
    employees,
    loading: employeesLoading,
    refreshEmployees,
  } = useEmployees();

  const handleImportComplete = () => {
    // Refresh both companies and employees data
    refreshCompanies();
    refreshEmployees();
  };

  if (companiesLoading || employeesLoading) {
    return (
      <main className="flex min-h-[99.8vh] h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">
              Carregando dashboard...
            </p>
          </div>
        </div>
      </main>
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
  const uniqueCities = new Set(companies.map((company) => company.city)).size;

  // Calculate averages
  const averagePeakConsumption =
    companies.length > 0 ? totalPeakConsumption / companies.length : 0;
  const averageOffPeakConsumption =
    companies.length > 0 ? totalOffPeakConsumption / companies.length : 0;
  const averageInvoiceValue =
    companies.length > 0 ? totalInvoiceValue / companies.length : 0;

  return (
    <main className="flex min-h-[99.8vh] h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do sistema de gestão de contatos e empresas
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton />
            <FileUploader onImportComplete={handleImportComplete} />
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DataCard
            title="Total de Empresas"
            icon={<Building className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="text-2xl font-bold">{companies.length}</div>
          </DataCard>

          <DataCard
            title="Total de Contatos"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="text-2xl font-bold">{employees.length}</div>
          </DataCard>

          <DataCard
            title="Cidades Presentes"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="text-2xl font-bold">{uniqueCities}</div>
          </DataCard>

          <DataCard
            title="Distribuidoras"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="text-2xl font-bold">{uniqueSuppliers}</div>
          </DataCard>
        </div>

        {/* Energy Consumption Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <DataCard
            title="Consumo Total de Energia"
            icon={<Zap className="h-4 w-4 text-orange-500" />}
          >
            <div className="text-2xl font-bold">
              {formatConsumption(totalPeakConsumption)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de todas as empresas
            </p>
            <div className="mt-2 pt-2 border-t">
              <div className="text-lg font-semibold text-muted-foreground">
                {formatConsumption(averagePeakConsumption)}
              </div>
              <p className="text-xs text-muted-foreground">Média por empresa</p>
            </div>
          </DataCard>

          <DataCard
            title="Consumo de Ponta"
            icon={<Zap className="h-4 w-4 text-blue-500" />}
          >
            <div className="text-2xl font-bold">
              {formatConsumption(totalOffPeakConsumption)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de todas as empresas
            </p>
            <div className="mt-2 pt-2 border-t">
              <div className="text-lg font-semibold text-muted-foreground">
                {formatConsumption(averageOffPeakConsumption)}
              </div>
              <p className="text-xs text-muted-foreground">Média por empresa</p>
            </div>
          </DataCard>

          <DataCard
            title="Valor das Faturas"
            icon={<IconCurrencyReal className="h-4 w-4 text-green-500" />}
          >
            <div className="text-2xl font-bold">
              {formatCurrency(totalInvoiceValue)}
            </div>
            <p className="text-xs text-muted-foreground">Soma das faturas</p>
            <div className="mt-2 pt-2 border-t">
              <div className="text-lg font-semibold text-muted-foreground">
                {formatCurrency(averageInvoiceValue)}
              </div>
              <p className="text-xs text-muted-foreground">Média por empresa</p>
            </div>
          </DataCard>
        </div>

        {/* Recent Companies and Employees Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Companies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Empresas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {companies.length > 0 ? (
                companies.slice(0, 5).map((company) => (
                  <div
                    key={company.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <Link
                        href={`/company/${company.id}`}
                        className="font-medium hover:underline"
                        prefetch={false}
                      >
                        {company.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {company.businessName}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline">{company.supplier}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {
                          employees.filter((e) => e.companyId === company.id)
                            .length
                        }{" "}
                        contatos
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma empresa cadastrada
                </p>
              )}
              {companies.length > 5 && (
                <div className="pt-2">
                  <Link href="/company" prefetch={false}>
                    <Button variant="outline" className="w-full">
                      Ver todas as {companies.length} empresas
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Employees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contatos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {employees.length > 0 ? (
                employees.slice(0, 5).map((employee) => {
                  const company = companies.find(
                    (c) => c.id === employee.companyId
                  );
                  return (
                    <div
                      key={employee.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {employee.email}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary">{employee.role}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {company?.name || "Empresa não encontrada"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum contato cadastrado
                </p>
              )}
              {employees.length > 5 && (
                <div className="pt-2">
                  <Link href="/employee" prefetch={false}>
                    <Button variant="outline" className="w-full">
                      Ver todos os {employees.length} contatos
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
