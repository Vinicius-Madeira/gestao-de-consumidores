"use client";
import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, File } from "lucide-react";

interface FileUploaderProps {
  onFilesChange?: (files: File[]) => void;
  acceptedTypes?: string[];
}

export default function FileUploader({
  onFilesChange,
  acceptedTypes = [".csv", ".xlsx", ".xls"],
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
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
        return `File ${file.name} is not a supported format`;
      }
    }

    return null;
  };

  const processFiles = (fileList: FileList) => {
    const file = fileList[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(""), 3000);
      return;
    }

    // Replace the current file since we only allow 1
    setFiles([file]);
    onFilesChange?.([file]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const removeFile = () => {
    setFiles([]);
    onFilesChange?.([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${files.length >= 1 ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => files.length < 1 && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          multiple={false}
          disabled={files.length >= 1}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {isDragOver ? "Solte o arquivo aqui" : "Enviar arquivo"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Arraste e solte um arquivo aqui ou clique para selecionar
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Formatos suportados: {acceptedTypes.join(", ")}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* File Display */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Arquivo selecionado
          </h4>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <File className="w-10 h-10 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {files[0].name}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="ml-3 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label={`Remove ${files[0].name}`}
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
