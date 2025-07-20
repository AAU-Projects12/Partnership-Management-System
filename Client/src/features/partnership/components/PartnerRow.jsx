import React from "react";
import { Trash2, Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const PartnerRow = ({ partner, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const getColumnWidth = (key) => {
    switch (key) {
      case "logo":
        return "w-12 sm:w-16 md:w-20";
      case "name":
        return "w-28 sm:w-40 md:w-48 lg:w-64"; // We'll override with max-width
      case "type":
        return "w-20 sm:w-28 md:w-32";
      case "duration":
        return "w-20 sm:w-28 md:w-32";
      case "contact":
        return "w-24 sm:w-32 md:w-40";
      case "status":
        return "w-20 sm:w-28 md:w-32";
      case "actions":
        return "w-24 sm:w-32 md:w-40";
      default:
        return "w-auto";
    }
  };

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 p-2 sm:p-3 md:p-4 border-b border-[#D9D9D9] items-center text-[10px] xs:text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-150">
      {/* Logo */}
      <div className={`${getColumnWidth("logo")} flex justify-center`}>
        <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full overflow-hidden bg-gray-200">
          <img
            src={"/placeholder.svg"}
            alt={partner.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>
      </div>

      {/* Name */}
      <div
        className={`${getColumnWidth(
          "name"
        )} overflow-hidden whitespace-nowrap`}
        style={{ maxWidth: "10rem" }} // force proper clipping of long names
      >
        <button
          onClick={() => navigate(`/partnership/${partner.id}`)}
          className="truncate w-full text-left font-medium text-[#004165] hover:underline"
          title={partner.name}
        >
          {partner.name}
        </button>
      </div>

      {/* Type */}
      <div className={`${getColumnWidth("type")} truncate`}>{partner.type}</div>

      {/* Duration */}
      <div className={`${getColumnWidth("duration")} truncate`}>
        {partner.duration}
      </div>

      {/* Contact */}
      <div className={`${getColumnWidth("contact")} truncate`}>
        {partner.contact}
      </div>

      {/* Status */}
      <div className={`${getColumnWidth("status")}`}>
        <StatusBadge status={partner.status} />
      </div>

      {/* Actions */}
      <div className={`${getColumnWidth("actions")} flex justify-end`}>
        <div className="flex gap-0.5 sm:gap-1 md:gap-2">
          <button
            className="p-0.5 sm:p-1 text-gray-500 hover:text-red-500 transition-colors"
            onClick={() => onDelete(partner.id)}
            title="Delete"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            className="p-0.5 sm:p-1 text-gray-500 hover:text-blue-500 transition-colors"
            onClick={() => navigate(`/edit-partnership/${partner.id}`)}
            title="Edit"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            className="p-0.5 sm:p-1 text-gray-500 hover:text-green-500 transition-colors"
            onClick={() => navigate(`/partnership/${partner.id}`)}
            title="View"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerRow;
