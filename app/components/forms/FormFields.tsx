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

// PhoneField — country-code dropdown + national number
interface PhoneFieldProps {
  name?: string;
  countryCodeName?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  name = "phoneNumber",
  countryCodeName = "phoneCountryCode",
  label = "Phone Number",
  placeholder = "8012345678",
  required = false,
  className = "",
  disabled = false,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-black mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex">
        <div className="relative flex-shrink-0">
          <Field name={countryCodeName}>
            {({ field }: { field: { name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void } }) => (
              <select
                {...field}
                disabled={disabled}
                aria-label="Country calling code"
                className={`appearance-none pl-3 pr-8 py-2 text-sm border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent ${disabled ? "cursor-not-allowed bg-gray-100" : ""}`}
              >
                {phoneCountryCodeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className={`h-3.5 w-3.5 ${disabled ? "text-gray-300" : "text-gray-400"}`} />
          </div>
        </div>

        <Field name={name}>
          {({
            field,
            form,
          }: {
            field: { name: string; value: string; onBlur: (e: React.FocusEvent<HTMLInputElement>) => void };
            form: { setFieldValue: (field: string, value: string) => void };
          }) => (
            <input
              {...field}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              disabled={disabled}
              placeholder={placeholder}
              className={`${baseInputStyles} rounded-l-none ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                form.setFieldValue(name, digitsOnly);
              }}
            />
          )}
        </Field>
      </div>

      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
      <ErrorMessage name={countryCodeName} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
};

/** Build E.164-style phone from dial code + national number (strips leading zeros). */
export const formatPhoneWithCountryCode = (
  countryCode: string,
  nationalNumber: string
): string => {
  const digits = (nationalNumber || "").replace(/\D/g, "").replace(/^0+/, "");
  return `${countryCode}${digits}`;
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
  { value: "Senegal", label: "Senegal" },
  { value: "Côte d'Ivoire", label: "Côte d'Ivoire" },
  { value: "Mali", label: "Mali" },
  { value: "Burkina Faso", label: "Burkina Faso" },
  { value: "Niger", label: "Niger" },
  { value: "Guinea", label: "Guinea" },
  { value: "Benin", label: "Benin" },
  { value: "Togo", label: "Togo" },
  { value: "Sierra Leone", label: "Sierra Leone" },
  { value: "Liberia", label: "Liberia" },
  { value: "Mauritania", label: "Mauritania" },
  { value: "Gambia", label: "Gambia" },
  { value: "Guinea-Bissau", label: "Guinea-Bissau" },
  { value: "Cape Verde", label: "Cape Verde" }
];

/** Dial codes aligned with countryOptions (value = E.164 prefix). */
export const phoneCountryCodeOptions: SelectOption[] = [
  { value: "+234", label: "+234" },
  { value: "+233", label: "+233" },
  { value: "+221", label: "+221" },
  { value: "+225", label: "+225" },
  { value: "+223", label: "+223" },
  { value: "+226", label: "+226" },
  { value: "+227", label: "+227" },
  { value: "+224", label: "+224" },
  { value: "+229", label: "+229" },
  { value: "+228", label: "+228" },
  { value: "+232", label: "+232" },
  { value: "+231", label: "+231" },
  { value: "+222", label: "+222" },
  { value: "+220", label: "+220" },
  { value: "+245", label: "+245" },
  { value: "+238", label: "+238" },
];

/** Map registration country name → dial code for syncing the phone dropdown. */
export const countryToPhoneCodeMap: Record<string, string> = {
  Nigeria: "+234",
  Ghana: "+233",
  Senegal: "+221",
  "Côte d'Ivoire": "+225",
  Mali: "+223",
  "Burkina Faso": "+226",
  Niger: "+227",
  Guinea: "+224",
  Benin: "+229",
  Togo: "+228",
  "Sierra Leone": "+232",
  Liberia: "+231",
  Mauritania: "+222",
  Gambia: "+220",
  "Guinea-Bissau": "+245",
  "Cape Verde": "+238",
};

// Country to states mapping
export const countryStatesMap: Record<string, SelectOption[]> = {
  "Nigeria": [
    { value: "Abia", label: "Abia" },
    { value: "Adamawa", label: "Adamawa" },
    { value: "Akwa Ibom", label: "Akwa Ibom" },
    { value: "Anambra", label: "Anambra" },
    { value: "Bauchi", label: "Bauchi" },
    { value: "Bayelsa", label: "Bayelsa" },
    { value: "Benue", label: "Benue" },
    { value: "Borno", label: "Borno" },
    { value: "Cross River", label: "Cross River" },
    { value: "Delta", label: "Delta" },
    { value: "Ebonyi", label: "Ebonyi" },
    { value: "Edo", label: "Edo" },
    { value: "Ekiti", label: "Ekiti" },
    { value: "Enugu", label: "Enugu" },
    { value: "FCT", label: "Federal Capital Territory (Abuja)" },
    { value: "Gombe", label: "Gombe" },
    { value: "Imo", label: "Imo" },
    { value: "Jigawa", label: "Jigawa" },
    { value: "Kaduna", label: "Kaduna" },
    { value: "Kano", label: "Kano" },
    { value: "Katsina", label: "Katsina" },
    { value: "Kebbi", label: "Kebbi" },
    { value: "Kogi", label: "Kogi" },
    { value: "Kwara", label: "Kwara" },
    { value: "Lagos", label: "Lagos" },
    { value: "Nasarawa", label: "Nasarawa" },
    { value: "Niger", label: "Niger" },
    { value: "Ogun", label: "Ogun" },
    { value: "Ondo", label: "Ondo" },
    { value: "Osun", label: "Osun" },
    { value: "Oyo", label: "Oyo" },
    { value: "Plateau", label: "Plateau" },
    { value: "Rivers", label: "Rivers" },
    { value: "Sokoto", label: "Sokoto" },
    { value: "Taraba", label: "Taraba" },
    { value: "Yobe", label: "Yobe" },
    { value: "Zamfara", label: "Zamfara" }
  ],
  "Ghana": [
    { value: "Ahafo", label: "Ahafo" },
    { value: "Ashanti", label: "Ashanti" },
    { value: "Bono", label: "Bono" },
    { value: "Bono East", label: "Bono East" },
    { value: "Central", label: "Central" },
    { value: "Eastern", label: "Eastern" },
    { value: "Greater Accra", label: "Greater Accra" },
    { value: "North East", label: "North East" },
    { value: "Northern", label: "Northern" },
    { value: "Oti", label: "Oti" },
    { value: "Savannah", label: "Savannah" },
    { value: "Upper East", label: "Upper East" },
    { value: "Upper West", label: "Upper West" },
    { value: "Volta", label: "Volta" },
    { value: "Western", label: "Western" },
    { value: "Western North", label: "Western North" }
  ],
  "Senegal": [
    { value: "Dakar", label: "Dakar" },
    { value: "Diourbel", label: "Diourbel" },
    { value: "Fatick", label: "Fatick" },
    { value: "Kaffrine", label: "Kaffrine" },
    { value: "Kaolack", label: "Kaolack" },
    { value: "Kédougou", label: "Kédougou" },
    { value: "Kolda", label: "Kolda" },
    { value: "Louga", label: "Louga" },
    { value: "Matam", label: "Matam" },
    { value: "Saint-Louis", label: "Saint-Louis" },
    { value: "Sédhiou", label: "Sédhiou" },
    { value: "Tambacounda", label: "Tambacounda" },
    { value: "Thiès", label: "Thiès" },
    { value: "Ziguinchor", label: "Ziguinchor" }
  ],
  "Côte d'Ivoire": [
    { value: "Bas-Sassandra", label: "Bas-Sassandra" },
    { value: "Comoé", label: "Comoé" },
    { value: "Denguélé", label: "Denguélé" },
    { value: "Gôh-Djiboua", label: "Gôh-Djiboua" },
    { value: "Lacs", label: "Lacs" },
    { value: "Lagunes", label: "Lagunes" },
    { value: "Montagnes", label: "Montagnes" },
    { value: "Sassandra-Marahoué", label: "Sassandra-Marahoué" },
    { value: "Savanes", label: "Savanes" },
    { value: "Vallée du Bandama", label: "Vallée du Bandama" },
    { value: "Woroba", label: "Woroba" },
    { value: "Yamoussoukro", label: "Yamoussoukro" },
    { value: "Zanzan", label: "Zanzan" }
  ],
  "Mali": [
    { value: "Bamako", label: "Bamako" },
    { value: "Gao", label: "Gao" },
    { value: "Kayes", label: "Kayes" },
    { value: "Kidal", label: "Kidal" },
    { value: "Koulikoro", label: "Koulikoro" },
    { value: "Ménaka", label: "Ménaka" },
    { value: "Mopti", label: "Mopti" },
    { value: "Ségou", label: "Ségou" },
    { value: "Sikasso", label: "Sikasso" },
    { value: "Taoudénit", label: "Taoudénit" },
    { value: "Tombouctou", label: "Tombouctou" }
  ],
  "Burkina Faso": [
    { value: "Boucle du Mouhoun", label: "Boucle du Mouhoun" },
    { value: "Cascades", label: "Cascades" },
    { value: "Centre", label: "Centre" },
    { value: "Centre-Est", label: "Centre-Est" },
    { value: "Centre-Nord", label: "Centre-Nord" },
    { value: "Centre-Ouest", label: "Centre-Ouest" },
    { value: "Centre-Sud", label: "Centre-Sud" },
    { value: "Est", label: "Est" },
    { value: "Hauts-Bassins", label: "Hauts-Bassins" },
    { value: "Nord", label: "Nord" },
    { value: "Plateau-Central", label: "Plateau-Central" },
    { value: "Sahel", label: "Sahel" },
    { value: "Sud-Ouest", label: "Sud-Ouest" }
  ],
  "Niger": [
    { value: "Agadez", label: "Agadez" },
    { value: "Diffa", label: "Diffa" },
    { value: "Dosso", label: "Dosso" },
    { value: "Maradi", label: "Maradi" },
    { value: "Niamey", label: "Niamey" },
    { value: "Tahoua", label: "Tahoua" },
    { value: "Tillabéri", label: "Tillabéri" },
    { value: "Zinder", label: "Zinder" }
  ],
  "Guinea": [
    { value: "Boké", label: "Boké" },
    { value: "Conakry", label: "Conakry" },
    { value: "Faranah", label: "Faranah" },
    { value: "Kankan", label: "Kankan" },
    { value: "Kindia", label: "Kindia" },
    { value: "Labé", label: "Labé" },
    { value: "Mamou", label: "Mamou" },
    { value: "Nzérékoré", label: "Nzérékoré" }
  ],
  "Benin": [
    { value: "Alibori", label: "Alibori" },
    { value: "Atacora", label: "Atacora" },
    { value: "Atlantique", label: "Atlantique" },
    { value: "Borgou", label: "Borgou" },
    { value: "Collines", label: "Collines" },
    { value: "Couffo", label: "Couffo" },
    { value: "Donga", label: "Donga" },
    { value: "Littoral", label: "Littoral" },
    { value: "Mono", label: "Mono" },
    { value: "Ouémé", label: "Ouémé" },
    { value: "Plateau", label: "Plateau" },
    { value: "Zou", label: "Zou" }
  ],
  "Togo": [
    { value: "Centrale", label: "Centrale" },
    { value: "Kara", label: "Kara" },
    { value: "Maritime", label: "Maritime" },
    { value: "Plateaux", label: "Plateaux" },
    { value: "Savanes", label: "Savanes" }
  ],
  "Sierra Leone": [
    { value: "Eastern Province", label: "Eastern Province" },
    { value: "Northern Province", label: "Northern Province" },
    { value: "North West Province", label: "North West Province" },
    { value: "Southern Province", label: "Southern Province" },
    { value: "Western Area", label: "Western Area" }
  ],
  "Liberia": [
    { value: "Bomi", label: "Bomi" },
    { value: "Bong", label: "Bong" },
    { value: "Gbarpolu", label: "Gbarpolu" },
    { value: "Grand Bassa", label: "Grand Bassa" },
    { value: "Grand Cape Mount", label: "Grand Cape Mount" },
    { value: "Grand Gedeh", label: "Grand Gedeh" },
    { value: "Grand Kru", label: "Grand Kru" },
    { value: "Lofa", label: "Lofa" },
    { value: "Margibi", label: "Margibi" },
    { value: "Maryland", label: "Maryland" },
    { value: "Montserrado", label: "Montserrado" },
    { value: "Nimba", label: "Nimba" },
    { value: "River Cess", label: "River Cess" },
    { value: "River Gee", label: "River Gee" },
    { value: "Sinoe", label: "Sinoe" }
  ],
  "Mauritania": [
    { value: "Adrar", label: "Adrar" },
    { value: "Assaba", label: "Assaba" },
    { value: "Brakna", label: "Brakna" },
    { value: "Dakhlet Nouadhibou", label: "Dakhlet Nouadhibou" },
    { value: "Gorgol", label: "Gorgol" },
    { value: "Guidimaka", label: "Guidimaka" },
    { value: "Hodh Ech Chargui", label: "Hodh Ech Chargui" },
    { value: "Hodh El Gharbi", label: "Hodh El Gharbi" },
    { value: "Inchiri", label: "Inchiri" },
    { value: "Nouakchott Nord", label: "Nouakchott Nord" },
    { value: "Nouakchott Ouest", label: "Nouakchott Ouest" },
    { value: "Nouakchott Sud", label: "Nouakchott Sud" },
    { value: "Tagant", label: "Tagant" },
    { value: "Tiris Zemmour", label: "Tiris Zemmour" },
    { value: "Trarza", label: "Trarza" }
  ],
  "Gambia": [
    { value: "Banjul", label: "Banjul" },
    { value: "Central River", label: "Central River" },
    { value: "Lower River", label: "Lower River" },
    { value: "North Bank", label: "North Bank" },
    { value: "Upper River", label: "Upper River" },
    { value: "West Coast", label: "West Coast" }
  ],
  "Guinea-Bissau": [
    { value: "Bafatá", label: "Bafatá" },
    { value: "Biombo", label: "Biombo" },
    { value: "Bissau", label: "Bissau" },
    { value: "Bolama", label: "Bolama" },
    { value: "Cacheu", label: "Cacheu" },
    { value: "Gabú", label: "Gabú" },
    { value: "Oio", label: "Oio" },
    { value: "Quinara", label: "Quinara" },
    { value: "Tombali", label: "Tombali" }
  ],
  "Cape Verde": [
    { value: "Barlavento Islands", label: "Barlavento Islands" },
    { value: "Sotavento Islands", label: "Sotavento Islands" }
  ]
};

// Default state options (all states from all countries)
export const stateOptions: SelectOption[] = Object.values(countryStatesMap).flat();

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