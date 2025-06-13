import { CompanyCsv, parseCompanyFromCsv } from "@/schemas/CompanySchema";
import { EmployeeCsv, parseEmployeeFromCsv } from "@/schemas/EmployeeSchema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency for display
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Format consumption with unit
export function formatConsumption(value: number) {
  return `${value.toLocaleString("pt-BR")} kWh`;
}

export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getAllCompaniesFromCsv(data: any[]): CompanyCsv[] | null {
  let allCompaniesParsed = true;

  const companiesData = data.map((company) => {
    if (!allCompaniesParsed) return null;
    const comp = parseCompanyFromCsv(company);
    if (!comp) {
      allCompaniesParsed = false;
      return null;
    }
    return comp;
  });

  if (!allCompaniesParsed) {
    console.error("Erro ao analisar algumas empresas do CSV");
    return null;
  }
  return companiesData as CompanyCsv[];
}

export function getAllEmployeesFromCsv(data: any[]): EmployeeCsv[] | null {
  let allEmployeesParsed = true;

  console.log(data);

  const employeesData = data.map((employee) => {
    if (!allEmployeesParsed) return null;
    const emp = parseEmployeeFromCsv(employee);
    if (!emp) {
      allEmployeesParsed = false;
      return null;
    }
    return emp;
  });

  if (!allEmployeesParsed) {
    console.error("Erro ao analisar alguns funcionários do CSV");
    return null;
  }
  return employeesData as EmployeeCsv[];
}
