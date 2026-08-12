import PropTypes from 'prop-types';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface border border-border rounded-md">
      <h3 className="text-lg font-display font-medium text-text-primary">{title}</h3>
      {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};
