import { Redirect, Route, Switch } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import Flights from './Flights';
import SuccessPage from './SuccessPage';

const Routes = () => {
  return (
    <Switch>
      <Route path="/flights">
        <Flights />
      </Route>
      <Route path="/success">
        <SuccessPage />
      </Route>
      <Route path="/error">
        <ErrorPage />
      </Route>
      <Route path="*">
        <Redirect to="flights" />
      </Route>
    </Switch>
  );
};

export default Routes;
