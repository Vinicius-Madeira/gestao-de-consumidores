import Dexie, { Table } from "dexie";

export interface Company {
  id?: number; // Chave primária auto-incrementável
  name: string;
  street: string;
  addressNumber: string;
  state: string;
  city: string;
  zipCode: string;
  businessName: string;
  cnpj: string;
  supplier: string;
  billingRateType: string;
  peakConsumption: number; // kWh
  offPeakConsumption: number; // kWh
  averageInvoiceValue: number; // R$
  responsibleManager: string; // May or may not exist, as it relates to an employee
}

export interface Employee {
  id?: number; // Chave primária auto-incrementável
  identifier: string;
  name: string;
  role: string;
  companyId: number; // Chave estrangeira para a tabela empresas
  phoneNumber: string;
  email: string;
}

export class MyAppDatabase extends Dexie {
  companies!: Table<Company>;
  employees!: Table<Employee>;

  constructor() {
    super("MyAppDatabase");
    this.version(1).stores({
      companies:
        "++id, name, cnpj, supplier, billingRateType, responsibleManager",
      employees: "++id, identifier, name, role, companyId, phoneNumber, email",
    });
  }
}

export const db = new MyAppDatabase();

// CRUD Operations for Companies
export const companyOperations = {
  // Create
  async create(company: Omit<Company, "id">): Promise<number> {
    return await db.companies.add(company);
  },

  // Read all
  async getAll(): Promise<Company[]> {
    return await db.companies.toArray();
  },

  // Read by ID
  async getById(id: number): Promise<Company | undefined> {
    return await db.companies.get(id);
  },

  // Read by CNPJ
  async getByCnpj(cnpj: string): Promise<Company | undefined> {
    return await db.companies.where("cnpj").equals(cnpj).first();
  },

  // Update
  async update(id: number, changes: Partial<Company>): Promise<number> {
    return await db.companies.update(id, changes);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await db.companies.delete(id);
  },

  // Delete multiple
  async deleteMultiple(ids: number[]): Promise<void> {
    await db.companies.bulkDelete(ids);
  },

  // Search by name
  async searchByName(name: string): Promise<Company[]> {
    return await db.companies
      .where("name")
      .startsWithIgnoreCase(name)
      .toArray();
  },

  // Get companies by supplier
  async getBySupplier(supplier: string): Promise<Company[]> {
    return await db.companies.where("supplier").equals(supplier).toArray();
  },
};

// CRUD Operations for Employees
export const employeeOperations = {
  // Create
  async create(employee: Omit<Employee, "id">): Promise<number> {
    return await db.employees.add(employee);
  },

  // Read all
  async getAll(): Promise<Employee[]> {
    return await db.employees.toArray();
  },

  // Read by ID
  async getById(id: number): Promise<Employee | undefined> {
    return await db.employees.get(id);
  },

  // Read by company ID
  async getByCompanyId(companyId: number): Promise<Employee[]> {
    return await db.employees.where("companyId").equals(companyId).toArray();
  },

  // Read by identifier
  async getByIdentifier(identifier: string): Promise<Employee | undefined> {
    return await db.employees.where("identifier").equals(identifier).first();
  },

  // Update
  async update(id: number, changes: Partial<Employee>): Promise<number> {
    return await db.employees.update(id, changes);
  },

  // Delete
  async delete(id: number): Promise<void> {
    await db.employees.delete(id);
  },

  // Delete by company ID (when deleting a company)
  async deleteByCompanyId(companyId: number): Promise<void> {
    await db.employees.where("companyId").equals(companyId).delete();
  },

  // Search by name
  async searchByName(name: string): Promise<Employee[]> {
    return await db.employees
      .where("name")
      .startsWithIgnoreCase(name)
      .toArray();
  },

  // Get employees with company data (JOIN-like operation)
  async getWithCompanyData(): Promise<(Employee & { company?: Company })[]> {
    const employees = await db.employees.toArray();
    const companiesMap = new Map<number, Company>();

    // Get all unique company IDs
    const companyIds = [...new Set(employees.map((emp) => emp.companyId))];

    // Fetch companies in bulk
    const companies = await db.companies
      .where("id")
      .anyOf(companyIds)
      .toArray();
    companies.forEach((company) => {
      if (company.id) companiesMap.set(company.id, company);
    });

    // Merge data
    return employees.map((employee) => ({
      ...employee,
      company: companiesMap.get(employee.companyId),
    }));
  },
};
