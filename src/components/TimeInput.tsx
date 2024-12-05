import React from 'react';

interface TimeInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const formatTimeDisplay = (time: string): string => {
  if (!time) return '';
  // If time is already in HH:mm format, return as is
  if (time.includes(':')) return time;
  // Convert "HHmm" to "HH:mm" format
  return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
};

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false
}) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(':', '');
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: newValue
      }
    };
    onChange(syntheticEvent);
  };

  return (
    <div id="time-input-container">
      <label id="time-input-container-label" className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id="time-input-container-input"
        type="time"
        name={name}
        value={formatTimeDisplay(value)}
        onChange={handleTimeChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required={required}
      />
    </div>
  );
};

export default TimeInput; 