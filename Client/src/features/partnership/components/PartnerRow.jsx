import React from "react";
import { Trash2, Edit, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const PartnerRow = ({ partner, onDelete, onEdit }) => {
  const navigate = useNavigate();

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
    <div className="grid grid-cols-7 gap-4 p-4 border-b border-[#D9D9D9] items-center text-sm hover:bg-gray-50 transition-colors duration-150">
      {/* Logo */}
      <div className={`${getColumnWidth('logo')} flex justify-center`}>
        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
          <img
            src={partner.logo || "/placeholder.svg"}
            alt={partner.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>
      </div>

      {/* Name */}
      <div className={`${getColumnWidth('name')} font-medium text-[#004165] cursor-pointer truncate`}>
        <button onClick={() => navigate(`/partnership/${partner.id}`)}>
          {partner.name}
        </button>
      </div>

      {/* Type */}
      <div className={`${getColumnWidth('type')} truncate`}>{partner.type}</div>

      {/* Duration */}
      <div className={`${getColumnWidth('duration')} truncate`}>{partner.duration}</div>

      {/* Contact */}
      <div className={`${getColumnWidth('contact')} truncate`}>{partner.contact}</div>

      {/* Status */}
      <div className={`${getColumnWidth('status')}`}>
        <StatusBadge status={partner.status} />
      </div>

      {/* Actions */}
      <div className={`${getColumnWidth('actions')} flex gap-2 justify-end`}>
        <button
          className="p-1 text-gray-500 hover:text-red-500 transition-colors"
          onClick={() => onDelete(partner.id)}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
          onClick={() => navigate(`/edit-partnership/${partner.id}`)}
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          className="p-1 text-gray-500 hover:text-green-500 transition-colors"
          onClick={() => navigate(`/partnership/${partner.id}`)}
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PartnerRow;
