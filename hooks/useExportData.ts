"use client";

import { useState } from "react";
import { utils, writeFile } from "xlsx";
import { Company } from "@/schemas/CompanySchema";
import { Employee } from "@/schemas/EmployeeSchema";
import { companyOperations, employeeOperations } from "@/lib/dexie/db";
import { toast } from "sonner";

export const useExportData = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToXLSX = async () => {
    try {
      setIsExporting(true);

      // Fetch all data
      const [companies, employees] = await Promise.all([
        companyOperations.getAll(),
        employeeOperations.getWithCompanyData(),
      ]);

      // Transform companies data to match CSV format
      const companiesData = companies.map((company) => ({
        Empresa: company.name,
        Rua: company.street,
        Numero: parseInt(company.addressNumber),
        Estado: company.state,
        Cidade: company.city,
        Cep: parseInt(company.zipCode),
        Razao_Social: company.businessName,
        Cnpj: company.cnpj,
        Distribuidora: company.supplier,
        Modalidade_Tarifaria: company.billingRateType,
        Consumo_Ponta: company.peakConsumption,
        Consumo_Fora_Ponta: company.offPeakConsumption,
        Valor_Medio_Fatura: company.averageInvoiceValue,
        Gestor_Responsavel: company.responsibleManager || "",
      }));

      // Transform employees data to match CSV format
      const employeesData = employees.map((employee) => ({
        Identificador: employee.identifier,
        Nome: employee.name,
        Cargo: employee.role,
        Empresa: employee.company?.name || `Company ID: ${employee.companyId}`,
        Telefone: employee.phoneNumber,
        Email: employee.email,
      }));

      // Create workbook and worksheet
      const workbook = utils.book_new();
      const worksheet = utils.aoa_to_sheet([]);

      // Get column headers - EMPLOYEES FIRST
      const employeeHeaders = Object.keys(employeesData[0] || {});
      const companyHeaders = Object.keys(companiesData[0] || {});

      // Calculate positions - EMPLOYEES FIRST
      const employeeStartCol = 0;
      const companyStartCol = employeeHeaders.length + 1; // +1 for blank column gap

      // Add employee headers FIRST
      if (employeeHeaders.length > 0) {
        employeeHeaders.forEach((header, index) => {
          const cellAddress = utils.encode_cell({
            r: 0,
            c: employeeStartCol + index,
          });
          worksheet[cellAddress] = { v: header, t: "s" };
        });

        // Add employee data
        employeesData.forEach((row, rowIndex) => {
          employeeHeaders.forEach((header, colIndex) => {
            const cellAddress = utils.encode_cell({
              r: rowIndex + 1,
              c: employeeStartCol + colIndex,
            });
            const value = row[header as keyof typeof row];
            worksheet[cellAddress] = {
              v: value,
              t: typeof value === "number" ? "n" : "s",
            };
          });
        });
      }

      // Add company headers SECOND
      if (companyHeaders.length > 0) {
        companyHeaders.forEach((header, index) => {
          const cellAddress = utils.encode_cell({
            r: 0,
            c: companyStartCol + index,
          });
          worksheet[cellAddress] = { v: header, t: "s" };
        });

        // Add company data
        companiesData.forEach((row, rowIndex) => {
          companyHeaders.forEach((header, colIndex) => {
            const cellAddress = utils.encode_cell({
              r: rowIndex + 1,
              c: companyStartCol + colIndex,
            });
            const value = row[header as keyof typeof row];
            worksheet[cellAddress] = {
              v: value,
              t: typeof value === "number" ? "n" : "s",
            };
          });
        });
      }

      // Set the range for the worksheet
      const maxRows = Math.max(companiesData.length, employeesData.length) + 1; // +1 for headers
      const maxCols = companyStartCol + companyHeaders.length;

      worksheet["!ref"] = utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: maxRows - 1, c: maxCols - 1 },
      });

      // Add the worksheet to workbook
      utils.book_append_sheet(workbook, worksheet, "Dados");

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `gestao-contatos-export-${currentDate}.xlsx`;

      // Write file
      writeFile(workbook, filename);

      toast.success(
        `Dados exportados com sucesso! ${companies.length} empresas e ${employees.length} contatos exportados.`
      );

      return {
        success: true,
        companiesCount: companies.length,
        employeesCount: employees.length,
        filename,
      };
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erro ao exportar os dados");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsExporting(false);
    }
  };

  const exportFilteredData = async (
    companies: Company[],
    employees: Employee[]
  ) => {
    try {
      setIsExporting(true);

      // Transform companies data to match CSV format
      const companiesData = companies.map((company) => ({
        Empresa: company.name,
        Rua: company.street,
        Numero: parseInt(company.addressNumber),
        Estado: company.state,
        Cidade: company.city,
        Cep: parseInt(company.zipCode),
        Razao_Social: company.businessName,
        Cnpj: company.cnpj,
        Distribuidora: company.supplier,
        Modalidade_Tarifaria: company.billingRateType,
        Consumo_Ponta: company.peakConsumption,
        Consumo_Fora_Ponta: company.offPeakConsumption,
        Valor_Medio_Fatura: company.averageInvoiceValue,
        Gestor_Responsavel: company.responsibleManager || "",
      }));

      // Transform employees data to match CSV format
      const employeesData = employees.map((employee) => {
        return {
          Identificador: employee.identifier,
          Nome: employee.name,
          Cargo: employee.role,
          Empresa:
            // @ts-expect-error workaround
            employee.company?.name || `Company ID: ${employee.companyId}`,
          Telefone: employee.phoneNumber,
          Email: employee.email,
        };
      });

      // Create workbook and worksheet
      const workbook = utils.book_new();
      const worksheet = utils.aoa_to_sheet([]);

      // Get column headers
      const employeeHeaders = Object.keys(employeesData[0] || {});
      const companyHeaders = Object.keys(companiesData[0] || {});

      // Calculate positions
      const employeeStartCol = 0;
      const companyStartCol = employeeHeaders.length + 1; // Fixed: should be employeeHeaders.length + 1

      // Add employee headers
      if (employeeHeaders.length > 0) {
        employeeHeaders.forEach((header, index) => {
          const cellAddress = utils.encode_cell({
            r: 0,
            c: employeeStartCol + index,
          });
          worksheet[cellAddress] = { v: header, t: "s" };
        });

        // Add employee data
        employeesData.forEach((row, rowIndex) => {
          employeeHeaders.forEach((header, colIndex) => {
            const cellAddress = utils.encode_cell({
              r: rowIndex + 1,
              c: employeeStartCol + colIndex,
            });
            const value = row[header as keyof typeof row];
            worksheet[cellAddress] = {
              v: value,
              t: typeof value === "number" ? "n" : "s",
            };
          });
        });
      }

      // Add company headers
      if (companyHeaders.length > 0) {
        companyHeaders.forEach((header, index) => {
          const cellAddress = utils.encode_cell({
            r: 0,
            c: companyStartCol + index,
          });
          worksheet[cellAddress] = { v: header, t: "s" };
        });

        // Add company data
        companiesData.forEach((row, rowIndex) => {
          companyHeaders.forEach((header, colIndex) => {
            const cellAddress = utils.encode_cell({
              r: rowIndex + 1,
              c: companyStartCol + colIndex,
            });
            const value = row[header as keyof typeof row];
            worksheet[cellAddress] = {
              v: value,
              t: typeof value === "number" ? "n" : "s",
            };
          });
        });
      }

      // Set the range for the worksheet
      const maxRows = Math.max(companiesData.length, employeesData.length) + 1; // +1 for headers
      const maxCols = companyStartCol + companyHeaders.length;

      worksheet["!ref"] = utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: maxRows - 1, c: maxCols - 1 },
      });

      // Add the worksheet to workbook
      utils.book_append_sheet(workbook, worksheet, "Dados");

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `dados-filtrados-${currentDate}.xlsx`;

      // Write file
      writeFile(workbook, filename);

      toast.success(
        `Dados filtrados exportados! ${companies.length} empresas e ${employees.length} contatos exportados.`
      );

      return {
        success: true,
        companiesCount: companies.length,
        employeesCount: employees.length,
        filename,
      };
    } catch (error) {
      console.error("Error exporting filtered data:", error);
      toast.error("Erro ao exportar os dados filtrados");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToXLSX,
    exportFilteredData,
    isExporting,
  };
};
