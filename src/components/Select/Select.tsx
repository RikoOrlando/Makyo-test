import {
  ChangeEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import classNames from "classnames";
import ReactDOM from "react-dom";

const IconCheck = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className={className}
      viewBox="0 0 16 16"
    >
      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
    </svg>
  );
};

const IconSelect = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      className={className}
    >
      <path
        fill-rule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
      />
    </svg>
  );
};

const IconSearch = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      className={className}
    >
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
    </svg>
  );
};

const IconXCircle = (props: {
  className?: string;
  onClick?: (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => void;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      {...props}
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
    </svg>
  );
};
const Label = ({ label, keyword }: { label: string; keyword: string }) => {
  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = label.split(regex);
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={index}>{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
};
interface Option {
  value: string | number;
  label: string;
}

type Value = string | (string | number)[] | number;

interface OptionFiltered {
  value: string | number;
  label: string;
  customLabel: ReactNode;
}
interface SelectProps {
  options?: Option[];
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  mode?: "single" | "multiple";
  value?: Value;
  onChange?: (value: Value) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  id?: string;
  withSearch?: boolean;
  labelRender?: (label: Option) => ReactNode;
  getPopupContainer?: () => HTMLElement | null;
  customFilter?: (option: Option, keyword: string) => boolean;
}

export default function Select({
  options = [],
  onOpenChange,
  open,
  mode = "single",
  value,
  placeholder,
  searchPlaceholder,
  id,
  onChange,
  withSearch = true,
  labelRender,
  getPopupContainer,
  customFilter,
}: SelectProps) {
  const selectRef = useRef(null);
  const [stateOpen, setStateOpen] = useState(false);
  const [stateValue, setStateValue] = useState<Value>("");
  const [keyword, setKeyword] = useState("");
  const safeValue = useMemo(() => {
    if (value !== undefined) return value;
    return stateValue;
  }, [value, stateValue]);
  const isOpen = useMemo(() => {
    if (open !== undefined) return open;
    return stateOpen;
  }, [stateOpen, open]);

  const handleChangeValue = (val: string | (string | number)[] | number) => {
    if (onChange) onChange(val);
    setStateValue(val);
  };

  const handleSelectOption = (itemValue: string | number) => {
    if (mode === "single") {
      handleChangeOpen(false);
      handleChangeValue(itemValue);
      return;
    } else {
      const safeValueOption = Array.isArray(safeValue) ? safeValue : [];
      const isIncluded = safeValueOption.includes(itemValue);
      const nextValues = isIncluded
        ? safeValueOption.filter((el) => el !== itemValue)
        : [...safeValueOption, itemValue];
      handleChangeValue(nextValues);
    }
  };
  const handleChangeOpen = (nextOpen: boolean) => {
    if (onOpenChange) return onOpenChange(nextOpen);
    setStateOpen(nextOpen);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  const handleClearKeyword = () => {
    setKeyword("");
  };
  // for clean up search every showing options
  useEffect(() => {
    if (isOpen) {
      setKeyword("");
    }
  }, [isOpen]);

  const filteredOptions: OptionFiltered[] = useMemo(() => {
    return options
      .reduce((acc, option) => {
        const filterCondition = customFilter
          ? customFilter(option, keyword)
          : option.label.toLowerCase().includes(keyword.toLowerCase());
        if (filterCondition) {
          return [
            ...acc,
            {
              ...option,
              customLabel: <Label label={option.label} keyword={keyword} />,
            },
          ];
        }
        return acc;
      }, [] as OptionFiltered[])
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [keyword, options]);
  const isEmpty = useMemo(() => {
    if (Array.isArray(safeValue)) return !safeValue.length;
    return !String(safeValue);
  }, [safeValue]);
  const getLabel = (val: string | number) => {
    return options.find((el) => el.value === val)?.label;
  };
  const handleRemoveItem = (val: string | number) => {
    if (Array.isArray(safeValue)) {
      handleChangeValue(safeValue.filter((el) => el !== val));
      return;
    }
    handleChangeValue([]);
  };
  useOutsideClick(selectRef, () => handleChangeOpen(false), isOpen);
  const renderOptions = (isPortal: boolean) => {
    return (
      <div
        aria-label="Dropdown menu"
        className={classNames(
          "border border-solid w-full mt-2 shadow-md rounded bg-white z-[1100]",
          {
            absolute: !isPortal,
          }
        )}
      >
        {withSearch && (
          <div className="flex items-center border-b border-solid border-stone-300 p-2 gap-2 ">
            <IconSearch className="text-stone-400" />
            <input
              placeholder={searchPlaceholder}
              className="flex-1 outline-none"
              value={keyword}
              onChange={handleSearch}
            />
            {!!keyword && (
              <IconXCircle
                onClick={handleClearKeyword}
                className="text-stone-400 cursor-pointer"
              />
            )}
          </div>
        )}
        <ul
          role="menu"
          aria-labelledby={id}
          aria-orientation="vertical"
          className="leading-10 overflow-y-auto max-h-[300px]"
        >
          {filteredOptions?.map((item) => (
            <li key={item.value} onClick={() => handleSelectOption(item.value)}>
              {labelRender ? (
                labelRender(item)
              ) : (
                <div
                  className={classNames(
                    "px-4 py-1 hover:bg-slate-50 cursor-pointer duration-200 ease-in-out flex items-center justify-between",
                    {
                      "bg-slate-50": Array.isArray(safeValue)
                        ? safeValue.includes(item.value)
                        : safeValue === item.value,
                    }
                  )}
                >
                  <span>{item.customLabel}</span>
                  {(Array.isArray(safeValue)
                    ? safeValue.includes(item.value)
                    : safeValue === item.value) && (
                    <IconCheck className="text-green-400" />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div ref={selectRef} className="relative">
      <button
        id={id}
        aria-label="Toggle dropdown"
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
        onClick={() => handleChangeOpen(true)}
        className={classNames(
          "flex justify-between items-center gap-5 w-full py-2 px-4 border rounded border-solid min-h-[42px]"
        )}
      >
        {placeholder && isEmpty && (
          <span className="text-stone-300">{placeholder}</span>
        )}
        {!isEmpty &&
          (Array.isArray(safeValue) ? (
            <div className="flex gap-1 flex-wrap">
              {safeValue.map((val) => (
                <div
                  className="border text-sm px-2 py-1 rounded-[20px] whitespace-nowrap flex items-center gap-1"
                  key={val}
                >
                  {getLabel(val)}
                  <IconXCircle
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(val);
                    }}
                    className="text-stone-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          ) : (
            getLabel(safeValue)
          ))}
        <IconSelect
          className={classNames("duration-500 ease-in-out ml-auto", {
            "rotate-180": isOpen,
          })}
        />
      </button>
      {isOpen && (
        <>
          {getPopupContainer && getPopupContainer()
            ? ReactDOM.createPortal(
                renderOptions(true),
                getPopupContainer() as HTMLElement
              )
            : renderOptions(false)}
        </>
      )}
    </div>
  );
}
