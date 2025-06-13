"use client";

import { useState, useEffect } from "react";
import { Company } from "@/schemas/CompanySchema";
import { companyOperations } from "@/lib/dexie/db";

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyOperations.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (company: Omit<Company, "id">) => {
    try {
      setError(null);
      const id = await companyOperations.create(company);
      const newCompany = { ...company, id };
      setCompanies((prev) => [...prev, newCompany]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create company");
      throw err;
    }
  };

  const updateCompany = async (id: string, changes: Partial<Company>) => {
    try {
      setError(null);
      await companyOperations.update(id, changes);
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === id ? { ...company, ...changes } : company
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update company");
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      setError(null);
      await companyOperations.delete(id);
      setCompanies((prev) => prev.filter((company) => company.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete company");
      throw err;
    }
  };

  const searchCompanies = async (name: string) => {
    try {
      setError(null);
      const results = await companyOperations.searchByName(name);
      return results;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search companies"
      );
      return [];
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    searchCompanies,
    refreshCompanies: loadCompanies,
  };
};
