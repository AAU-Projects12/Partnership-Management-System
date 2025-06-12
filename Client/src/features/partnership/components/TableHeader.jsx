import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TableHeader = ({ columns, sortConfig, onSort }) => {
  const getNextSortDirection = (columnName) => {
    if (sortConfig?.column !== columnName) return 'asc';
    return sortConfig.direction === 'asc' ? 'desc' : 'asc';
  };

  const getSortIcon = (columnName) => {
    if (sortConfig?.column !== columnName) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" /> 
      : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="grid grid-cols-7 gap-4 p-4 border-b-0.5 text-gray-600 font-medium shadow-md">
      {columns.map((column) => (
        <div 
          key={column.key}
          className={`cursor-pointer flex items-center gap-1 hover:text-[#004165] transition-colors ${
            sortConfig?.column === column.key ? 'text-[#004165]' : ''
          } ${column.key === 'logo' ? 'justify-center' : ''}`}
          onClick={() => onSort(column.key, getNextSortDirection(column.key))}
        >
          {column.label}
          {getSortIcon(column.key)}
        </div>
      ))}
    </div>
  );
};

export default TableHeader;