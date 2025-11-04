/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { ChevronDown } from 'lucide-react';

// Base input styles
const baseInputStyles = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent";

// TextField Component Interface
interface TextFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  as?: string;
  rows?: number;
  className?: string;
  prefix?: string;
  disabled?: boolean;
}

// TextField Component
export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  as,
  rows,
  className = "",
  prefix,
  disabled = false
}) => {
  const inputClasses = `${baseInputStyles} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-black mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {prefix ? (
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm min-w-0 flex-shrink-0">
            {prefix}
          </span>
          <Field
            name={name}
            type={type}
            as={as}
            rows={rows}
            disabled={disabled}
            className={`${inputClasses} rounded-l-none`}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <Field
          name={name}
          type={type}
          as={as}
          rows={rows}
          disabled={disabled}
          className={inputClasses}
          placeholder={placeholder}
        />
      )}
      
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
};

// SelectField Component Interface
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  className?: string;
  multiple?: boolean;
  size?: number;
  disabled?: boolean;
}

// SelectField Component
export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder = "Select an option",
  options,
  required = false,
  className = "",
  multiple = false,
  size,
  disabled = false
}) => {
  const selectClasses = `${baseInputStyles} ${!multiple ? 'appearance-none pr-10' : 'min-h-[120px]'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <Field
          name={name}
          as="select"
          multiple={multiple}
          size={size || (multiple ? 6 : undefined)}
          disabled={disabled}
          className={selectClasses}
        >
          {!multiple && (
            <option value="" className="text-[#A8A8A8]">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="py-1">
              {option.label}
            </option>
          ))}
        </Field>
        
        {!multiple && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className={`h-4 w-4 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
        )}
      </div>
      
      {multiple && (
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple options</p>
      )}
      
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
};

// FileField Component Interface
interface FileFieldProps {
  name: string;
  label: string;
  accept?: string;
  required?: boolean;
  className?: string;
  description?: string;
  icon?: React.ReactNode;
  maxSize?: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void, fieldName: string) => void;
  currentFile?: File | null;
  disabled?: boolean;
}

// FileField Component
export const FileField: React.FC<FileFieldProps> = ({
  name,
  label,
  accept = "image/*",
  required = false,
  className = "",
  description,
  icon = <span className="text-gray-400">📤</span>,
  maxSize = "Max 10 MB files are allowed",
  onFileChange,
  currentFile,
  disabled = false
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {description && (
        <p className="text-xs text-gray-500 mb-3">{description}</p>
      )}
      
      <Field name={name}>
        {({
          form: { setFieldValue }
        }: {
          form: { setFieldValue: (field: string, value: any) => void }
        }) => (
          <div className={`border-2 border-dashed rounded-lg p-8 text-center ${disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300'}`}>
            <div className="space-y-2">
              <div>{icon}</div>
              <div>
                <input
                  type="file"
                  id={name}
                  accept={accept}
                  disabled={disabled}
                  className="hidden"
                  onChange={(e) => onFileChange(e, setFieldValue, name)}
                />
                <label
                  htmlFor={name}
                  className={`${disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-mainGreen hover:text-mainGreen/80'} font-medium`}
                >
                  Upload {label}
                </label>
              </div>
              <p className="text-xs text-gray-400">{maxSize}</p>
              {currentFile && (
                <p className="text-sm text-mainGreen">✓ {currentFile.name}</p>
              )}
            </div>
          </div>
        )}
      </Field>
      
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
};

// Option arrays for the form
export const countryOptions: SelectOption[] = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "Ghana", label: "Ghana" },
  { value: "Kenya", label: "Kenya" }
];

export const stateOptions: SelectOption[] = [
  { value: "Lagos", label: "Lagos" },
  { value: "Abuja", label: "Abuja" },
  { value: "Ogun", label: "Ogun" }
];

export const unitOptions: SelectOption[] = [
  { value: "kilogram", label: "Kilogram (kg)" },
  { value: "tonne", label: "Tonne" },
];

export const unitOptionsLand: SelectOption[] = [
  { value: "acre", label: "Acres" },
  { value: "hectare", label: "Hectares" },
];

export const cropsOptions: SelectOption[] = [
  { value: "Rice", label: "Rice" },
  { value: "Maize", label: "Maize" },
  { value: "Cassava", label: "Cassava" },
  { value: "Yam", label: "Yam" },
  { value: "Plantain", label: "Plantain" },
  { value: "Tomato", label: "Tomato" },
  { value: "Pepper", label: "Pepper" },
  { value: "Onion", label: "Onion" },
  { value: "Sorghum", label: "Sorghum" },
  { value: "Millet", label: "Millet" },
  { value: "Beans", label: "Beans" },
  { value: "Groundnut", label: "Groundnut" },
  { value: "Cocoa", label: "Cocoa" },
  { value: "Palm Oil", label: "Palm Oil" }
];

export const businessTypes: SelectOption[] = [
  { value: "food processing", label: "Food Processing" },
  { value: "oil mill", label: "Oil  Mill" },
  { value: "flour mill", label: "Flour  Mill" },
  { value: "rice mill", label: "Rice  Mill" },
  { value: "cassava processing", label: "Cassava Processing" },
  { value: "fruit procesing", label: "Fruit Processing" },
 
];

export const farmingExperienceOptions: SelectOption[] = [
  { value: "Less than 1 year", label: "Less than 1 year" },
  { value: "1-2 years", label: "1-2 years" },
  { value: "2-10 years", label: "2-10 years" },
  { value: "More than 10 years", label: "More than 10 years" }
];

export const internetAccessOptions: SelectOption[] = [
  { value: "Smartphone with daily internet", label: "Smartphone with daily internet" },
  { value: "Smartphone with occasional internet", label: "Smartphone with occasional internet" },
  { value: "Computer/laptop", label: "Computer/laptop" },
  { value: "Internet cafe", label: "Internet cafe" },
  { value: "No regular internet access", label: "No regular internet access" }
];

export const currentSellingMethodOptions: SelectOption[] = [
  { value: "Local markets", label: "Local markets" },
  { value: "Middlemen/traders", label: "Middlemen/traders" },
  { value: "Direct to consumers", label: "Direct to consumers" },
  { value: "Cooperatives", label: "Cooperatives" },
  { value: "Online platforms", label: "Online platforms" },
  { value: "Processing companies", label: "Processing companies" }
];

export const bankOptions: SelectOption[] = [
  { value: "First Bank of Nigeria", label: "First Bank of Nigeria" },
  { value: "Zenith Bank", label: "Zenith Bank" },
  { value: "GTBank", label: "GTBank" },
  { value: "Access Bank", label: "Access Bank" },
  { value: "UBA", label: "UBA" },
  { value: "Fidelity", label: "Fidelity Bank" },
  { value: "FCMB", label: "FCMB" },
  { value: "Stanbic IBTC", label: "Stanbic IBTC" }
];