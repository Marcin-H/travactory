import { useCallback, useEffect, useState } from 'react';
import { getFlightDetails } from '../../api/Flights';
import './style.scss';

type FlightDetailsModalTypes = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  flightID: string;
};

type FlightDetailsDataType = {
  cabinClass?: string;
  freeBaggageAllowed?: boolean;
  remainingNumberOfSeats?: number;
  seatPitch?: number;
};

const FlightDetailsModal = ({ isOpen, setIsOpen, flightID }: FlightDetailsModalTypes) => {
  const [flightDetails, setFlightDetails] = useState<FlightDetailsDataType>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getFlightDetailsData = useCallback(async () => {
    try {
      const data: FlightDetailsDataType = await getFlightDetails(flightID);
      setFlightDetails(data);
      setIsLoading(false);
    } catch (e) {
      console.log('Error occured in get flights details', e);
      setIsLoading(false);
      setIsError(true);
    }
  }, [flightID]);

  useEffect(() => {
    if (!!isOpen) {
      getFlightDetailsData();
    }
  }, [isOpen, getFlightDetailsData]);

  const handleClose = () => {
    setIsLoading(true);
    setIsOpen(false);
  };

  const getModalContainer = (displayElement: JSX.Element) => {
    return (
      <div className="modal_container">
        <div className="modal_container__header">{displayElement}</div>
      </div>
    );
  };

  if (!!isLoading) {
    const loadingMsg = <h1>Loading flight details...</h1>;
    return getModalContainer(loadingMsg);
  }

  const handleError = () => {
    const errorMsg = (
      <div className="error">
        <h1>Error occured, please try again later</h1>
        <div className="modal_btn_container">
          <button className="modal_btn" onClick={() => setIsOpen(false)}>
            Go back to flights list{' '}
          </button>
        </div>
      </div>
    );
    return getModalContainer(errorMsg);
  };

  return (
    <>
      {!!isError ? (
        handleError()
      ) : (
        <div className="modal_container">
          <div className="modal_container__header">
            <h2>Flight details</h2>
          </div>
          <div className="modal_container__body">
            <table className="modal_container__body__table">
              <tbody>
                <tr>
                  <th>Cabin class</th>
                  <th>Free Baggage Allowed?</th>
                  <th>Remaining number of seats</th>
                  <th>Seat Pitch</th>
                </tr>
                <tr>
                  <td>{flightDetails?.cabinClass}</td>
                  <td>{flightDetails?.freeBaggageAllowed ? 'yes' : 'no'}</td>
                  <td>{flightDetails?.remainingNumberOfSeats}</td>
                  <td>{flightDetails?.seatPitch}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal_btn_container">
            <button className="modal_btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightDetailsModal;
