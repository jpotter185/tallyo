import { ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface FooterProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Header: React.FC<FooterProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="font-mono px-1 border bg-sky-200 dark:bg-neutral-800 border border-gray-300 dark:border-gray-500">
      <div>Created by Jack Potter</div>
      <div className="flex">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <div>Contact</div>
          <ChevronRight
            textAnchor="end"
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          ></ChevronRight>
        </button>
      </div>
      {isOpen && (
        <div className="flex space-x-4 text-blue-600 dark:text-blue-400">
          <div className="hover:underline">
            <a href="https://github.com/jpotter185" target="_blank">
              Github
            </a>
          </div>
          <div className="hover:underline">
            <a href="https://www.linkedin.com/in/jack--potter" target="_blank">
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
