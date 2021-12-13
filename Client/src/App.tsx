import { Fragment, useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import { loadUser } from "./Context/AuthActions";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import SingleProduct from "./Pages/SingleProduct";
import Cart from "./Pages/Cart";
import AddressPage from "./Pages/AddressPage";
import PaymentMethod from "./Pages/PaymentMethod";
import PlaceOrder from "./Pages/PlaceOrder";
import Paypal from "./Pages/PayPal";

function App() {
  const { state, dispatch } = useContext(AuthContext);
  const { token } = state;
  useEffect(() => {
    if (token) {
      loadUser(token, dispatch);
    }
  }, [token, dispatch]);

  const DefaultContainer = () => (
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Home} />
      <Route exact path="/product/:id" component={SingleProduct} />
      <Route exact path="/cart" component={Cart} />
    </Fragment>
  );

  return (
    <Router>
      <Switch>
        <Route exact path="/Auth" component={Auth} />
        <Route exact path="/address" component={AddressPage} />
        <Route exact path="/payment" component={PaymentMethod} />
        <Route exact path="/PlaceOrder" component={PlaceOrder} />
        <Route exact path="/PayPal" component={Paypal} />
        <Route component={DefaultContainer} />
      </Switch>
    </Router>
  );
}

export default App;
