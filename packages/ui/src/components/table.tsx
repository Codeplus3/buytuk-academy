import React from "react";

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className, children, ...props }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-700">
    <table className={`min-w-full divide-y divide-slate-700 ${className || ""}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <thead className={`bg-slate-800 ${className || ""}`} {...props}>{children}</thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <tbody className={`bg-slate-900 divide-y divide-slate-700 ${className || ""}`} {...props}>{children}</tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, children, ...props }) => (
  <tr className={`hover:bg-slate-800/50 transition-colors ${className || ""}`} {...props}>{children}</tr>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-slate-300 ${className || ""}`} {...props}>{children}</td>
);

export const TableHeaderCell: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <th className={`px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider ${className || ""}`} {...props}>{children}</th>
);

Table.displayName = "Table";