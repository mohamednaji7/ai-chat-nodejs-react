import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import './errorPage.css';

const ErrorPage = () => {
  const error = useRouteError();
  
  const getErrorDetails = () => {
    if (isRouteErrorResponse(error)) {
      return {
        status: error.status,
        statusText: error.statusText,
        message: error.data?.message || 'No additional details'
      };
    }
    return {
      status: 500,
      statusText: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="error-page">
      <div className="error-content">
        <h1>Oops!</h1>
        <div className="error-status">
          <span className="status-code">{errorDetails.status}</span>
          <span className="status-text">{errorDetails.statusText}</span>
        </div>
        <p className="error-message">{errorDetails.message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;