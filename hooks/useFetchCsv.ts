import { useState } from "react";
import { read, utils } from "xlsx";

export function useFetchCsv() {
  const [tables, setTables] = useState<any[][]>([]);

  async function parseCsv(file: File) {
    if (!file) return;

    const reader = new FileReader();

    const isCSV = file.name.endsWith(".csv");
    const readType = isCSV ? "readAsText" : "readAsArrayBuffer";

    reader.onload = (event) => {
      const data = event.target?.result;
      let workbook;

      try {
        if (isCSV && typeof data === "string") {
          workbook = read(data, { type: "string" });
        } else if (data instanceof ArrayBuffer) {
          workbook = read(data, { type: "array" });
        } else {
          throw new Error("Unsupported file format");
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const raw = utils.sheet_to_json<(string | number)[]>(worksheet, {
          header: 1,
          blankrows: false,
        });

        if (!raw.length) return;

        const numCols = Math.max(...raw.map((row) => row.length));
        const colIsEmpty = Array.from({ length: numCols }, (_, colIndex) =>
          raw.every((row) => {
            const cell = row[colIndex];
            return (
              cell === undefined ||
              cell === null ||
              (typeof cell === "string" && cell.trim() === "")
            );
          })
        );

        const columnGroups: number[][] = [];
        let currentGroup: number[] = [];

        for (let colIndex = 0; colIndex < numCols; colIndex++) {
          if (!colIsEmpty[colIndex]) {
            currentGroup.push(colIndex);
          } else {
            if (currentGroup.length) {
              columnGroups.push([...currentGroup]);
              currentGroup = [];
            }
          }
        }
        if (currentGroup.length) {
          columnGroups.push(currentGroup);
        }

        const headerRow = raw[0];
        const parsedTables: any[][] = [];

        columnGroups.forEach((group) => {
          const headers = group.map((i) => headerRow[i]);

          const rows = raw.slice(1).reduce((acc, row) => {
            const hasData = group.some((colIndex) => {
              const cell = row[colIndex];
              return (
                cell !== undefined &&
                cell !== null &&
                String(cell).trim() !== ""
              );
            });

            if (hasData) {
              const obj: Record<string, any> = {};
              group.forEach((colIndex, i) => {
                obj[headers[i]] = row[colIndex];
              });
              acc.push(obj);
            }

            return acc;
          }, [] as Record<string, any>[]);

          parsedTables.push(rows);
        });

        setTables(parsedTables);
      } catch (err) {
        console.error("Error parsing file:", err);
      }
    };

    reader[readType](file);
  }

  async function resetCsvData() {
    setTables([]);
  }

  return { csvData: tables, parseCsv, resetCsvData };
}
