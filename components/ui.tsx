
import React, { createContext, useContext, useState, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

// Card Components
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} {...props} />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`p-6 ${className}`} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={`text-lg font-semibold tracking-tight ${className}`} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}
export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2";
  const variantClasses = variant === 'default'
    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
    : "border border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-gray-400";
  return <button className={`${baseClasses} ${variantClasses} ${className}`} {...props} />;
};

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  const inputId = id || props.name;
  return (
    <div>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input id={inputId} className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`} {...props} />
    </div>
  );
};

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}
export const Select: React.FC<SelectProps> = ({ label, id, className, children, ...props }) => {
  const selectId = id || props.name;
  return (
    <div>
      {label && <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select id={selectId} className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
};


// Textarea Component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, id, className, ...props }) => {
  const textareaId = id || props.name;
  return (
    <div>
      {label && <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea id={textareaId} className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`} {...props} />
    </div>
  );
};


// Checkbox Component
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
  const checkboxId = id || props.name;
  return (
    <div className="flex items-center">
      <input id={checkboxId} type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" {...props} />
      <label htmlFor={checkboxId} className="ml-2 block text-sm text-gray-900">{label}</label>
    </div>
  );
};


// Label Component
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
    <label className={`text-sm font-medium text-gray-700 leading-none ${className}`} {...props} />
);


// Tabs Components
const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({ activeTab: '', setActiveTab: () => {} });

export const Tabs: React.FC<{ defaultValue: string; children: React.ReactNode }> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
};

export const TabList: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={`flex border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export const TabTrigger: React.FC<{ value: string; children: React.ReactNode } & HTMLAttributes<HTMLButtonElement>> = ({ value, children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium flex items-center
        ${isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
        focus:outline-none
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabContent: React.FC<{ value: string; children: React.ReactNode } & HTMLAttributes<HTMLDivElement>> = ({ value, children, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div {...props}>{children}</div> : null;
};

// Sidebar Components
export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 flex-shrink-0 hidden md:block">
      <nav className="flex flex-col space-y-1">{children}</nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}
export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active, onClick }) => {
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className={`
        flex items-center py-3 px-4 transition-colors duration-200
        ${active
          ? "bg-gray-700 text-white"
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
        }
      `}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </a>
  );
};
