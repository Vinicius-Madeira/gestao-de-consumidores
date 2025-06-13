import { z } from "zod";

export const CompanySchema = z.object({
  id: z.string(), // PK
  name: z.string(),
  street: z.string(),
  addressNumber: z.string(),
  state: z.string(),
  city: z.string(),
  zipCode: z.string(),
  businessName: z.string(),
  cnpj: z.string(),
  supplier: z.string(),
  billingRateType: z.string(),
  peakConsumption: z.number(), // kWh
  offPeakConsumption: z.number(), // kWh
  averageInvoiceValue: z.number(), // R$
  responsibleManager: z.string().optional(), // May exist
});

export type Company = z.infer<typeof CompanySchema>;

export const CompanyCsvSchema = z.object({
  Empresa: z.string(),
  Rua: z.string(),
  Numero: z.number(),
  Estado: z.string(),
  Cidade: z.string(),
  Cep: z.number(),
  Razao_Social: z.string(),
  Cnpj: z.string(),
  Distribuidora: z.string(),
  Modalidade_Tarifaria: z.string(),
  Consumo_Ponta: z.number(), // kWh
  Consumo_Fora_Ponta: z.number(), // kWh
  Valor_Medio_Fatura: z.number(), // R$
  Gestor_Responsavel: z.string(), // May exist
});

export type CompanyCsv = z.infer<typeof CompanyCsvSchema>;

export function parseCompanyFromCsv(data: unknown): CompanyCsv | null {
  try {
    const result = CompanyCsvSchema.safeParse(data);
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Failed to parse company data:", error);
    return null;
  }
}
