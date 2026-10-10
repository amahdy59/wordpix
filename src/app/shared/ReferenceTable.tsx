import type { ReactNode } from "react";

export interface ReferenceColumn {
  key: string;
  label: string;
  rowHeader?: boolean;
}

/** Keep the same labeled fields in a semantic table or a narrow-screen list. */
export function ReferenceTable({
  caption,
  columns,
  rows,
  emptyMessage,
}: {
  caption: string;
  columns: readonly ReferenceColumn[];
  rows: readonly { id: string; cells: Record<string, ReactNode> }[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) return <p role="status">{emptyMessage}</p>;
  return (
    <div className="wp-reference-table min-w-0">
      <div className="wp-reference-wide overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full table-fixed border-collapse text-start text-base">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-3 py-3 text-start font-semibold text-foreground"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                {columns.map((column) =>
                  column.rowHeader ? (
                    <th
                      key={column.key}
                      scope="row"
                      className="break-words px-3 py-3 text-start font-semibold text-foreground"
                    >
                      {row.cells[column.key]}
                    </th>
                  ) : (
                    <td
                      key={column.key}
                      className="break-words px-3 py-3 leading-relaxed text-foreground"
                    >
                      {row.cells[column.key]}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul
        className="wp-reference-narrow divide-y divide-border rounded-xl border border-border bg-card"
        aria-label={caption}
      >
        {rows.map((row) => (
          <li key={row.id} className="p-3">
            <dl className="grid min-w-0 gap-2">
              {columns.map((column) => (
                <div key={column.key} className="min-w-0">
                  <dt className="text-sm font-semibold text-muted-foreground">{column.label}</dt>
                  <dd className="mt-1 break-words text-base leading-relaxed text-foreground">
                    {row.cells[column.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
