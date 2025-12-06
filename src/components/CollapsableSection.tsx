import { ChevronDown } from "lucide-react";

interface CollapsableSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CollapsableSection: React.FC<CollapsableSectionProps> = ({
  title,
  onToggle,
  isOpen,
}) => {
  return (
    <button
      className="flex w-full items-center justify-between p-2 text-2xl font-bold mb-4"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <span>{title}</span>
      <ChevronDown
        textAnchor="end"
        className={`w-5 h-5  transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      ></ChevronDown>
    </button>
  );
};
export default CollapsableSection;
