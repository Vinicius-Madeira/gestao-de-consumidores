"use client";
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Upload } from "lucide-react";
import { useFetchCsv } from "@/hooks/useFetchCsv";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { getAllCompaniesFromCsv, getAllEmployeesFromCsv } from "@/lib/utils";
import { companyOperations, employeeOperations } from "@/lib/dexie/db";
import { toast } from "sonner";
import { CompanyCsv } from "@/schemas/CompanySchema";
import { EmployeeCsv } from "@/schemas/EmployeeSchema";

interface FileUploaderProps {
  onFilesChange?: (files: File[]) => void;
  acceptedTypes?: string[];
}

export default function FileUploader({
  onFilesChange,
  acceptedTypes = [".csv", ".xlsx"],
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<{
    companies: CompanyCsv[];
    employees: EmployeeCsv[];
  } | null>(null);
  const { csvData, parseCsv, resetCsvData } = useFetchCsv();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (acceptedTypes.length > 0) {
      const isValidType = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace("*", ".*"));
      });

      if (!isValidType) {
        return `Arquivo ${file.name} não é um formato suportado`;
      }
    }

    return null;
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setFile(selectedFile);
    setIsDialogOpen(true);
    setIsParsing(true);
    onFilesChange?.([selectedFile]);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setFile(null);
    setParsedData(null);
    resetCsvData();
    onFilesChange?.([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirm = async () => {
    if (!parsedData) return;

    setIsSaving(true);
    try {
      // Save companies first
      for (const company of parsedData.companies) {
        await companyOperations.create({
          addressNumber: company.Numero.toString(),
          averageInvoiceValue: company.Valor_Medio_Fatura,
          billingRateType: company.Modalidade_Tarifaria,
          businessName: company.Razao_Social,
          cnpj: company.Cnpj,
          city: company.Cidade,
          state: company.Estado,
          name: company.Empresa,
          zipCode: company.Cep.toString(),
          offPeakConsumption: company.Consumo_Fora_Ponta,
          peakConsumption: company.Consumo_Ponta,
          street: company.Rua,
          supplier: company.Distribuidora,
          responsibleManager: company.Gestor_Responsavel,
        });
      }

      // Save employees if available
      if (parsedData.employees.length > 0) {
        for (const employee of parsedData.employees) {
          const company = await companyOperations.searchByName(
            employee.Empresa
          );
          await employeeOperations.create({
            identifier: employee.Identificador,
            name: employee.Nome,
            role: employee.Cargo,
            companyId: company[0].id,
            phoneNumber: employee.Telefone,
            email: employee.Email,
          });
        }
      }

      toast.success(
        `${parsedData.companies.length} empresas e ${parsedData.employees.length} colaboradores importados com sucesso!`
      );

      setIsDialogOpen(false);
      setFile(null);
      setParsedData(null);
      resetCsvData();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Erro ao salvar os dados no banco");
    } finally {
      setIsSaving(false);
    }
  };

  // Parse CSV data when it's available
  useEffect(() => {
    if (csvData.length > 0 && isParsing) {
      try {
        const companyData = getAllCompaniesFromCsv(csvData[1]) || [];
        const employeeData = getAllEmployeesFromCsv(csvData[0]) || [];

        setParsedData({
          companies: companyData,
          employees: employeeData,
        });

        setIsParsing(false);
      } catch (error) {
        console.error("Error parsing CSV data:", error);
        toast.error("Erro ao processar o arquivo CSV");
        setIsParsing(false);
        setIsDialogOpen(false);
      }
    }
  }, [csvData, isParsing]);

  // Start parsing when file is selected
  useEffect(() => {
    if (file && isDialogOpen) {
      parseCsv(file);
    }
  }, [file, isDialogOpen, parseCsv]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
      />

      <Button
        onClick={openFileSelector}
        className="flex items-center gap-2 text-white"
      >
        <Upload className="h-4 w-4" />
        Importar CSV
      </Button>

      <Dialog
        open={isDialogOpen}
        onOpenChange={() => !isSaving && handleCancel()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Dados do CSV</DialogTitle>
            <DialogDescription>
              {file && `Arquivo: ${file.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isParsing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Processando arquivo...</span>
              </div>
            ) : parsedData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <span className="font-medium">Empresas encontradas:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {parsedData.companies.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <span className="font-medium">
                    Colaboradores encontrados:
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {parsedData.employees.length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Confirme para importar estes dados para o sistema.
                </p>
              </div>
            ) : null}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isParsing || !parsedData || isSaving}
              className="text-white"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                "Confirmar Importação"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
