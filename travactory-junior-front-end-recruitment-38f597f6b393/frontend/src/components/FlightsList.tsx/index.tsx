import moment from 'moment';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { bookFlight, getFlightsList } from '../../api/Flights';
import { formatDuration } from '../../utils/duration';
import FlightDetailsModal from '../FlightDetailsModal';
import './style.scss';

type BoundsType = [
  {
    departure: { code: string; dateTime: string; name: string };
    destination: { code: string; dateTime: string; name: string };
    duration: string;
  },
];

type FlightsDataType = {
  airlineCode: string;
  bounds: BoundsType;
  price: { amount: number; currency: string };
  uuid: string;
};

enum sortOrder {
  asc = 'asc',
  desc = 'desc',
}

enum sortByOptions {
  price = 'price',
  date = 'date',
}

const FlightsList = () => {
  const [flightsList, setFlightsList] = useState<FlightsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flightID, setFlightID] = useState('');
  const [sortBy, setSortBy] = useState<string>(sortByOptions.price);
  const airlineURL = 'https://d1ufw0nild2mi8.cloudfront.net/images/airlines/V2/srp/result_desktop';
  const history = useHistory();

  useEffect(() => {
    getFlightsData();
  }, []);

  const getFlightsData = async () => {
    try {
      const data: FlightsDataType[] = await getFlightsList();
      const sortedData = data.sort((a, b) => a.price.amount - b.price.amount);
      setFlightsList(sortedData);
      setIsLoading(false);
    } catch (e) {
      console.log('Get flights data error', e);
      history.replace('/error');
    }
  };

  const getDuration = (duration: string) => {
    return formatDuration(duration);
  };

  const getDate = (time: string) => {
    const date = moment(time, 'YYYY-MM-DD HH:mm:ss');
    const dayOfWeek = date.format('ddd DD MMM');
    return dayOfWeek.toLowerCase();
  };

  const getTime = (dateTime: string) => {
    const time = moment(dateTime).utc().format('HH:mm');
    return time;
  };

  const getLogo = (airlineCode: string) => {
    const logo = `${airlineURL}/${airlineCode}.png`;
    return <img src={logo} alt={airlineCode} />;
  };

  const openFlightDetailsModal = (flightID: string) => {
    setFlightID(flightID);
    setIsModalOpen(true);
  };

  const handleBookFlight = async (flightID: string) => {
    try {
      setIsLoading(true);
      await bookFlight(flightID);
      history.replace('/success');
    } catch (e) {
      console.log(e);
      history.replace('/error');
    }
  };

  const handleChangeSort = (value: string) => {
    if (sortBy === sortByOptions.price) {
      if (value === sortOrder.asc) {
        const ascData = flightsList.sort((a, b) => a.price.amount - b.price.amount);
        return setFlightsList([...ascData]);
      }
      const descData = flightsList.reverse();
      return setFlightsList([...descData]);
    }
    if (sortBy === sortByOptions.date) {
      if (value === sortOrder.asc) {
        const ascData = flightsList.sort((a, b) => {
          return (
            new Date(a.bounds[0].departure.dateTime).getDate() - new Date(b.bounds[0].departure.dateTime).getDate()
          );
        });
        return setFlightsList([...ascData]);
      }
      const descData = flightsList.reverse();
      setFlightsList([...descData]);
    }
  };

  const getBoundsInformation = (airlineCode: string, bounds: BoundsType, uuid: string) => {
    return (
      <div className="flights_table__main">
        <div className="flight_details_btn_container">
          <button className="flight_details_btn" onClick={() => openFlightDetailsModal(uuid)}>
            Flight details
          </button>
        </div>
        {bounds.map((bound, index) => (
          <div key={index} className="flight_information">
            <div className="flight_information__logo">{getLogo(airlineCode)}</div>
            <div className="flight_information__data">
              <div className="flight_information__departure">
                <div className="flight_information__departure__code">{bound.departure.code}</div>
                <div className="flight_information__departure__time">{getTime(bound.departure.dateTime)}</div>
                <div className="flight_information__departure__date">{getDate(bound.departure.dateTime)}</div>
              </div>
              <div className="flight_information__timeline">
                <div>{getDuration(bound.duration)}</div>
                <div className="timeline-wrapper">
                  <div className="middle-line"></div>
                  <div className="boxleft">
                    <div className="boxCircle"></div>
                  </div>
                  <div className="boxRight">
                    <div className="boxCircle"></div>
                  </div>
                </div>
              </div>
              <div className="flight_information__destination">
                <div className="flight_information__destination__code">{bound.destination.code}</div>
                <div className="flight_information__destination__time">{getTime(bound.destination.dateTime)}</div>
                <div className="flight_information__destination__date">{getDate(bound.destination.dateTime)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!!isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className="sorting_options">
        <div>
          <label>Sort by</label>
          <select name="sortBy" onChange={(e) => setSortBy(e.target.value)}>
            <option value={sortByOptions.price}>PRICE</option>
            <option value={sortByOptions.date}>DATE</option>
          </select>
        </div>
        <div>
          <label>How would you like to sort?</label>
          <select name="order" onChange={(e) => handleChangeSort(e.target.value)}>
            <option value={sortOrder.asc}>ASC</option>
            <option value={sortOrder.desc}>DESC</option>
          </select>
        </div>
      </div>
      <div className="flights_table">
        <div>
          {flightsList.map((flight) => (
            <div key={flight.uuid} className="flights_table__row">
              {getBoundsInformation(flight.airlineCode, flight.bounds, flight.uuid)}
              <div className="arrow_container">
                <div className="arrow"></div>
              </div>
              <div className="flights_table__summary_area">
                <div className="flights_table__summary_area_mobile">
                  <div className="flights_table__summary_area__container">
                    <div className="flights_table__summary_area__container__sum">€ {flight.price.amount}</div>
                    <div className="flights_table__summary_area__container__shortcut"> p.p.</div>
                  </div>
                  <div className="flights_table__summary_area__btn_container">
                    <button className="flights_table__summary_area__btn" onClick={() => handleBookFlight(flight.uuid)}>
                      Book flight
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <FlightDetailsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} flightID={flightID} />}
    </>
  );
};

export default FlightsList;
