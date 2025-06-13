"use client";

import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { useExportData } from "@/hooks/useExportData";

interface ExportButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function ExportButton({
  variant = "outline",
  size = "default",
  className,
}: ExportButtonProps) {
  const { exportToXLSX, isExporting } = useExportData();

  const handleExport = async () => {
    await exportToXLSX();
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant={variant}
      size={size}
      className={className}
    >
      {isExporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Exportando...
        </>
      ) : (
        <>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Dados
        </>
      )}
    </Button>
  );
}
