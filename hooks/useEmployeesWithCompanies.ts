"use client";

import { useState, useEffect } from "react";
import { Company } from "@/schemas/CompanySchema";
import { Employee } from "@/schemas/EmployeeSchema";
import { employeeOperations } from "@/lib/dexie/db";

type EmployeeWithCompany = Employee & { company?: Company };

export const useEmployeesWithCompany = () => {
  const [employees, setEmployees] = useState<EmployeeWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployeesWithCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeOperations.getWithCompanyData();
      setEmployees(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load employees with company data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployeesWithCompany();
  }, []);

  return {
    employees,
    loading,
    error,
    refreshEmployees: loadEmployeesWithCompany,
  };
};
