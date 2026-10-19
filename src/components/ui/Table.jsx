// components/ui/Table/index.jsx
"use client";

import { cn } from "@/lib/cn";
import { ChevronDown, ChevronUp } from "lucide-react";

function Table({ className, ...props }) {
  return (
    <table
      data-slot="table"
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-gray-100 border-b border-gray-200", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-gray-50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, selected, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-gray-100 transition-colors hover:bg-gray-50",
        selected && "bg-green-50/50",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  sortable,
  onSort,
  currentSort,
  children,
  ...props
}) {
  const isSorted = currentSort?.field === props["data-field"];
  const sortDirection = isSorted ? currentSort?.direction : null;

  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-4 py-3 text-left align-middle font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap",
        sortable && "cursor-pointer select-none hover:text-gray-900",
        className,
      )}
      onClick={sortable ? onSort : undefined}
      data-field={props["data-field"]}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="flex flex-col -space-y-1">
            <ChevronUp
              size={12}
              className={cn(
                "transition-colors",
                isSorted && sortDirection === "asc"
                  ? "text-green-600"
                  : "text-gray-400",
              )}
            />
            <ChevronDown
              size={12}
              className={cn(
                "transition-colors",
                isSorted && sortDirection === "desc"
                  ? "text-green-600"
                  : "text-gray-400",
              )}
            />
          </span>
        )}
      </div>
    </th>
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-4 py-3 align-middle whitespace-nowrap", className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-gray-500 mt-4 text-sm", className)}
      {...props}
    />
  );
}

// Enhanced Table with built-in features
function DataTable({
  columns = [],
  data = [],
  onRowClick,
  onSort,
  currentSort,
  isLoading = false,
  emptyMessage = "No data found",
  className,
  maxHeight = "800px",
  ...props
}) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            {columns.map((col, j) => (
              <div
                key={j}
                className="h-6 bg-gray-200 rounded"
                style={{ width: col.width || "100%" }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <p className="text-lg font-medium">{emptyMessage}</p>
        <p className="text-sm mt-1">Try adjusting your filters or search</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="overflow-x-auto overflow-y-auto custom-scrollbar"
        style={{
          maxHeight,
          width: "calc(100vw - 401px)",
        }}
      >
        <Table className={cn("min-w-max", className)} {...props}>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={col.key || col.field || index}
                  sortable={col.sortable}
                  onSort={() => onSort?.(col.field)}
                  currentSort={currentSort}
                  className={cn(
                    col.headerClassName,
                    col.sticky && "sticky left-0 z-20 bg-gray-100",
                  )}
                  style={{ width: col.width }}
                  data-field={col.field}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id || index}
                onClick={() => onRowClick?.(row)}
                className="cursor-pointer hover:bg-gray-50"
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={col.key || col.field || colIndex}
                    className={cn(
                      col.cellClassName,
                      col.sticky &&
                        "sticky left-0 z-20 bg-white group-hover:bg-gray-50",
                    )}
                  >
                    {col.render
                      ? col.render(row[col.field], row)
                      : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  DataTable,
};
