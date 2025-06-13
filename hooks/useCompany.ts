"use client";

import { useState, useEffect } from "react";
import { Company } from "@/schemas/CompanySchema";
import { companyOperations } from "@/lib/dexie/db";

export const useCompany = (id?: string) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompany = async (companyId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyOperations.getById(companyId);
      setCompany(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load company");
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (changes: Partial<Company>) => {
    if (!company?.id) return;

    try {
      setError(null);
      await companyOperations.update(company.id, changes);
      setCompany((prev) => (prev ? { ...prev, ...changes } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update company");
      throw err;
    }
  };

  useEffect(() => {
    if (id) {
      loadCompany(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  return {
    company,
    loading,
    error,
    updateCompany,
    refreshCompany: () => id && loadCompany(id),
  };
};
