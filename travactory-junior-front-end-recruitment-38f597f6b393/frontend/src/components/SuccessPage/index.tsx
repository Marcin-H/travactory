import React from 'react';
import { useHistory } from 'react-router-dom';

const SuccessPage = () => {
  const history = useHistory();
  const handleRedirect = () => {
    history.replace('/');
  };

  return (
    <>
      <h1>SuccessPage</h1>
      <h3>You have successfully booked your flight!</h3>
      <button onClick={handleRedirect}>Go back to flights list</button>
    </>
  );
};

export default SuccessPage;
