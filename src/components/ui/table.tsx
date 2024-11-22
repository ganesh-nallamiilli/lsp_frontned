import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> & {
  Header: React.FC<TableProps>;
  Body: React.FC<TableProps>;
  Row: React.FC<TableProps>;
  Head: React.FC<TableProps>;
  Cell: React.FC<TableProps>;
} = ({ children, className = '' }) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full text-sm text-left ${className}`}>
        {children}
      </table>
    </div>
  );
};

Table.Header = ({ children, className = '' }) => (
  <thead className={`text-xs text-gray-700 uppercase bg-gray-50 ${className}`}>
    {children}
  </thead>
);

Table.Body = ({ children, className = '' }) => (
  <tbody className={className}>{children}</tbody>
);

Table.Row = ({ children, className = '' }) => (
  <tr className={`bg-white border-b hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

Table.Head = ({ children, className = '' }) => (
  <th className={`px-6 py-3 ${className}`}>{children}</th>
);

Table.Cell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 ${className}`}>{children}</td>
);

export { Table }; 