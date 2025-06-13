"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/schemas/EmployeeSchema";
import { employeeOperations } from "@/lib/dexie/db";

export const useEmployees = (companyId?: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = companyId
        ? await employeeOperations.getByCompanyId(companyId)
        : await employeeOperations.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      setError(null);
      const id = await employeeOperations.create(employee);
      const newEmployee = { ...employee, id };
      setEmployees((prev) => [...prev, newEmployee]);
      return id;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create employee"
      );
      throw err;
    }
  };

  const updateEmployee = async (id: string, changes: Partial<Employee>) => {
    try {
      setError(null);
      await employeeOperations.update(id, changes);
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === id ? { ...employee, ...changes } : employee
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update employee"
      );
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      setError(null);
      await employeeOperations.delete(id);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete employee"
      );
      throw err;
    }
  };

  const searchEmployees = async (name: string) => {
    try {
      setError(null);
      const results = await employeeOperations.searchByName(name);
      return results;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search employees"
      );
      return [];
    }
  };

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    refreshEmployees: loadEmployees,
  };
};
