import PropTypes from 'prop-types';
import { statusColors } from '../../utils/statusColors';

export default function Badge({ status, label }) {
  // Use lowercase status for lookup, fallback to default
  const normalizedStatus = status?.toLowerCase() || 'default';
  const colorClasses = statusColors[normalizedStatus] || statusColors.default;
  const displayLabel = label || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${colorClasses}`}>
      {displayLabel}
    </span>
  );
}

Badge.propTypes = {
  status: PropTypes.string.isRequired,
  label: PropTypes.string,
};
