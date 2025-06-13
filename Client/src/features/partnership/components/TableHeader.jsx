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

  const getColumnWidth = (key) => {
    switch (key) {
      case 'logo':
        return 'w-20'; // 80px
      case 'name':
        return 'w-48'; // 192px
      case 'type':
        return 'w-32'; // 128px
      case 'duration':
        return 'w-32'; // 128px
      case 'contact':
        return 'w-40'; // 160px
      case 'status':
        return 'w-32'; // 128px
      case 'actions':
        return 'w-32'; // 128px
      default:
        return 'w-auto';
    }
  };

  return (
    <div className="grid grid-cols-7 gap-4 p-4 border-b-0.5 text-gray-600 font-medium shadow-md">
      {columns.map((column) => {
        const widthClass = getColumnWidth(column.key);
        
        return (
          <div 
            key={column.key}
            className={`${widthClass} cursor-pointer flex items-center gap-1 hover:text-[#004165] transition-colors ${
              sortConfig?.column === column.key ? 'text-[#004165]' : ''
            } ${column.key === 'logo' ? 'justify-center' : ''}`}
            onClick={() => onSort(column.key, getNextSortDirection(column.key))}
          >
            {column.label}
            {getSortIcon(column.key)}
          </div>
        );
      })}
    </div>
  );
};

export default TableHeader;