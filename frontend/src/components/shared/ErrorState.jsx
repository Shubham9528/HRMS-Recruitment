import PropTypes from 'prop-types';
import Button from '../ui/Button';

export default function ErrorState({ title = 'Something went wrong', description, action, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface border border-danger/20 rounded-md">
      <div className="text-danger mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-display font-medium text-text-primary">{title}</h3>
      {description && <p className="mt-1 text-sm text-text-secondary max-w-md">{description}</p>}
      
      <div className="mt-6 flex space-x-3 items-center justify-center">
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Try Again
          </Button>
        )}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

ErrorState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  onRetry: PropTypes.func,
};
