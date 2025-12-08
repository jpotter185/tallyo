interface SelectorProps {
  data: string[];
  currentValue: string;
  setCurrentValue: (str: string) => void;
  displayString?: string | undefined;
  displayMap?: Map<string, string> | undefined;
}

const Selector: React.FC<SelectorProps> = ({
  data,
  currentValue,
  setCurrentValue,
  displayString,
  displayMap,
}) => {
  return (
    <div>
      <select
        id="selector"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        className="border border-gray-500 dark:border-neutral-800 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-500"
      >
        {data.map((entry) => {
          return (
            <option key={entry} value={entry}>
              {displayString
                ? displayString + " " + entry
                : displayMap
                  ? displayMap.get(entry)
                  : entry}
            </option>
          );
        })}
        ;
      </select>
    </div>
  );
};

export default Selector;
