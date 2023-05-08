import Modal from 'react-modal';
import { Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login/Login';
import BusinessSetupComplete from './Pages/Login/merchantOnboarding/BusinessSetupComplete';
import LoginMerchant from './Pages/Login/merchantOnboarding/Login_merchant';
import MerchantSignup from './Pages/Login/merchantOnboarding/MerchantSignup';
import SetupBusinessDetails from './Pages/Login/merchantOnboarding/SetupBusinessDetails';
import SetupStaffing from './Pages/Login/merchantOnboarding/SetupStaffing';
import SignupOtp from './Pages/Login/merchantOnboarding/signup-otp';
import Users from './Pages/Users';
import ChangeUserPassword from './Pages/Users/ChangeUserPassword';
import CreateUser from './Pages/Users/CreateUser';
import UpdateUser from './Pages/Users/UpdateUser';
import UpdateUserLga from './Pages/Users/UpdateUserLga';
import { UserController } from './contexts/UserContext';
import AuthenticatedRoute from './shared/AuthenticatedRoute';
import "./styles/main.css";

Modal.setAppElement("#root");

function App() {
  const handleContextMenu = (e) => {
    // e.preventDefault();
  };
  
  const handleKeyDown = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  };

  return (
    <div onContextMenu={handleContextMenu} onKeyDown={handleKeyDown}>
      <Router>
        <Route path="/login" component={Login} />
        <Route path="/onboarding/login-merchant" element={LoginMerchant} />
        <Route path="/onboarding/business-setup-complete" component={BusinessSetupComplete} />
        <Route path="/onboarding/setup-business-details" component={SetupBusinessDetails} />
        <Route path="/onboarding/setup-staffing" component={SetupStaffing} />
        <Route path="/onboarding/signup-otp" component={SignupOtp} />
        <Route path="/onboarding/merchant-signup" render ={routerProps => <UserController><MerchantSignup {...routerProps}/></UserController>} />
        <Route path="/users/create" render ={routerProps => <UserController><CreateUser {...routerProps}/></UserController>} />
        <Route path="/users/lga/:id" render ={routerProps => <UserController><UpdateUserLga {...routerProps}/></UserController>} />
        <Route path="/users/password/:id" render ={routerProps => <UserController><ChangeUserPassword {...routerProps}/></UserController>} />
        <Route path="/users/:id" render ={routerProps => <UserController><UpdateUser {...routerProps}/></UserController>} />
        <Route path="/users"  render ={routerProps => <UserController><Users {...routerProps}/></UserController>} />

        <AuthenticatedRoute path="/dashboard/home" component ={routerProps => <Home {...routerProps}/>} />
        <Redirect to="/login" />
      
      </Router>
    </div>
  );
}

export default App;
