"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Helper function to generate page numbers
  const generatePageNumbers = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const delta = 2; // Number of pages to show around current page

    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show
    const start = Math.max(0, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      // @ts-expect-error TS2345
      range.push(i);
    }

    // Add first page and dots if necessary
    if (start > 0) {
      // @ts-expect-error TS2345
      rangeWithDots.push(0);
      if (start > 1) {
        // @ts-expect-error TS2345
        rangeWithDots.push("...");
      }
    }

    // Add the main range
    rangeWithDots.push(...range);

    // Add last page and dots if necessary
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        // @ts-expect-error TS2345
        rangeWithDots.push("...");
      }
      // @ts-expect-error TS2345
      rangeWithDots.push(totalPages - 1);
    }

    return rangeWithDots;
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination with Page Numbers */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </p>
            <p className="text-sm text-muted-foreground">
              ({table.getFilteredRowModel().rows.length} registros)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {generatePageNumbers().map((pageNumber, index) => (
                <div key={index}>
                  {pageNumber === "..." ? (
                    <span className="px-2 py-1 text-sm text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      variant={
                        pageNumber === table.getState().pagination.pageIndex
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="w-8 h-8 p-0 text-white"
                      onClick={() => table.setPageIndex(pageNumber as number)}
                    >
                      {(pageNumber as number) + 1}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
