import PropTypes from 'prop-types';

export default function Input({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder = '',
  name,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors
          ${error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-border bg-surface-elevated'}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
        `}
      />
      {error && <span className="mt-1 text-sm text-danger">{error}</span>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
