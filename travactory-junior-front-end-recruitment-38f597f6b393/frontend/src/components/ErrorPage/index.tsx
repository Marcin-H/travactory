import React from 'react';
import { useHistory } from 'react-router-dom';

const ErrorPage = () => {
  const history = useHistory();
  const handleRedirect = () => {
    history.replace('/');
  };

  return (
    <div>
      <h1>ErrorPage</h1>
      <h3>Something went wrong, please try again</h3>
      <button onClick={handleRedirect}>Try again!</button>
    </div>
  );
};

export default ErrorPage;
