import { z } from "zod";

export const EmployeeSchema = z.object({
  id: z.string(), // PK
  identifier: z.string(),
  name: z.string(),
  role: z.string(),
  companyId: z.string(), // FK
  phoneNumber: z.string(),
  email: z.string().email(),
});

export type Employee = z.infer<typeof EmployeeSchema>;

export const EmployeeCsvSchema = z.object({
  Identificador: z.string(),
  Nome: z.string(),
  Cargo: z.string(),
  Empresa: z.string(),
  Telefone: z.string(),
  Email: z.string().email(),
});

export type EmployeeCsv = z.infer<typeof EmployeeCsvSchema>;

export function parseEmployeeFromCsv(data: unknown): EmployeeCsv | null {
  try {
    const result = EmployeeCsvSchema.safeParse(data);
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Failed to parse employee data:", error);
    return null;
  }
}
