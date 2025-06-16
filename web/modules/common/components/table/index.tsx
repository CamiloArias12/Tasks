import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";

export type TableColumnConfig= {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'start' | 'center' | 'end';
}

export type DataTableProps<T = Record<string, any>> ={
  data: T[];
  columns: TableColumnConfig[];
  ariaLabel?: string;
  isLoading?: boolean;
  emptyContent?: React.ReactNode;
  selectionMode?: 'none' | 'single' | 'multiple';
  onSelectionChange?: (keys: Set<React.Key>) => void;
  selectedKeys?: Set<React.Key>;
  sortDescriptor?: {
    column: React.Key;
    direction: 'ascending' | 'descending';
  };
  onSortChange?: (descriptor: {
    column: React.Key;
    direction: 'ascending' | 'descending';
  }) => void;
  className?: string;
  renderCell?: (item: T, columnKey: React.Key) => React.ReactNode;
  getRowKey?: (item: T, index: number) => React.Key;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  ariaLabel = "Data table",
  isLoading = false,
  emptyContent = "No data available",
  selectionMode = 'none',
  onSortChange,
  className,
  renderCell,
  getRowKey,
}: DataTableProps<T>) {
  const defaultGetRowKey = (item: T, index: number): React.Key => {
    return item.key || item.id || index;
  };

  const rowKeyGenerator = getRowKey || defaultGetRowKey;

  const defaultRenderCell = (item: T, columnKey: React.Key): React.ReactNode => {
    return getKeyValue(item, String(columnKey));
  };

  const cellRenderer = renderCell || defaultRenderCell;

  return (
    <Table
      aria-label={ariaLabel}
      selectionMode={selectionMode}
      onSortChange={onSortChange}
      className={"w-full bg-white " + (className || "")}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={column.sortable}
            align={column.align}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={data} 
        isLoading={isLoading}
        emptyContent={emptyContent}
      >
        {(item) => (
          <TableRow key={rowKeyGenerator(item, data.indexOf(item))}>
            {(columnKey) => (
              <TableCell>
                {cellRenderer(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

