import PropTypes from 'prop-types';

export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-sm ${className}`}></div>
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
};
