import { useContext } from 'react';
import Modal from 'react-modal';
import { Redirect, Route, Switch } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Agents from './Pages/Agents';
import CreateAgent from './Pages/Agents/CreateAgent';
import UpdateAgent from './Pages/Agents/UpdateAgent';
import Results from './Pages/ElectionResults';
import CreateResult from './Pages/ElectionResults/CreateResult';
import UpdateResult from './Pages/ElectionResults/UpdateResult';
import ElectionTypes from './Pages/ElectionTypes';
import EventsDashboard from './Pages/EventDashboard';
import EventRecord from './Pages/EventRecords';
import Event from './Pages/Events';
import CreateEvent from './Pages/Events/CreateEvent';
import UpdateEvent from './Pages/Events/UpdateEvent';
import Home from './Pages/Home';
import IncidentDashboard from './Pages/IncidentDashboard';
import IncidentGroup from './Pages/IncidentGroup';
import CreateIncidentGroup from './Pages/IncidentGroup/CreateIncidentGroup';
import UpdateIncidentGroup from './Pages/IncidentGroup/UpdateIncidentGroup';
import Incidents from './Pages/Incidents';
import CreateIncident from './Pages/Incidents/CreateIncident';
import UpdateIncident from './Pages/Incidents/UpdateIncident';
import Lgas from './Pages/Lgas';
import CreateLga from './Pages/Lgas/CreateLga';
import UpdateLga from './Pages/Lgas/UpdateLga';
import Login from './Pages/Login/Login';
import LoginMerchant from './Pages/Login/merchantOnboarding/Login_merchant';
import BusinessSetupComplete from './Pages/Login/merchantOnboarding/BusinessSetupComplete';
import MerchantSignup from './Pages/Login/merchantOnboarding/MerchantSignup';
import SetupBusinessDetails from './Pages/Login/merchantOnboarding/SetupBusinessDetails';
import SignupOtp from './Pages/Login/merchantOnboarding/signup-otp';
import SetupStaffing from './Pages/Login/merchantOnboarding/SetupStaffing';
import Parties from './Pages/Parties';
import CreateParty from './Pages/Parties/CreateParty';
import UpdateParty from './Pages/Parties/UpdateParty';
import PollingUnits from './Pages/PollingUnits';
import CreatePollingUnit from './Pages/PollingUnits/CreatePollingUnit';
import UpdatePollingUnit from './Pages/PollingUnits/UpdatePollingUnit';
import ResultDashboard from './Pages/ResultDashboard';
import ResultDashboardNational from './Pages/ResultDashboardNational';
import States from './Pages/States';
import CreateState from './Pages/States/CreateState';
import UpdateState from './Pages/States/UpdateState';
import Users from './Pages/Users';
import ChangeUserPassword from './Pages/Users/ChangeUserPassword';
import CreateUser from './Pages/Users/CreateUser';
import UpdateUser from './Pages/Users/UpdateUser';
import UpdateUserLga from './Pages/Users/UpdateUserLga';
import Wards from './Pages/Wards';
import CreateWard from './Pages/Wards/CreateWard';
import UpdateWard from './Pages/Wards/UpdateWard';
import { AgentController } from './contexts/AgentContext';
import { AuthContext } from './contexts/AuthContext';
import { IncidentController } from './contexts/IncidentContext';
import { LgaController } from './contexts/LgaContext';
import { PartyController } from './contexts/PartyContext';
import { PUController } from './contexts/PollingUnitContext';
import { ResultController } from './contexts/ResultContext';
import { StateController } from './contexts/StateContext';
import { UserController } from './contexts/UserContext';
import { WardController } from './contexts/WardContext';
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
      <Switch>
        <Route path="/login/login-merchant" component={LoginMerchant} />
        <Route path="/login/business-setup-complete" component={BusinessSetupComplete} />
        {/* <Route path="/login/merchant-signup" component={MerchantSignup} /> */}
        <Route path="/login/setup-business-details" component={SetupBusinessDetails} />
        <Route path="/login/setup-staffing" component={SetupStaffing} />
        <Route path="/login/signup-otp" component={SignupOtp} />
        <Route path="/login" component={Login} />
        {/* <Route path="/results" component={Results} /> */}
        <Route path="/login/merchant-signup" render ={routerProps => <UserController><MerchantSignup {...routerProps}/></UserController>} />
        <Route path="/users/create" render ={routerProps => <UserController><CreateUser {...routerProps}/></UserController>} />
        <Route path="/users/lga/:id" render ={routerProps => <UserController><UpdateUserLga {...routerProps}/></UserController>} />
        <Route path="/users/password/:id" render ={routerProps => <UserController><ChangeUserPassword {...routerProps}/></UserController>} />
        <Route path="/users/:id" render ={routerProps => <UserController><UpdateUser {...routerProps}/></UserController>} />
        <Route path="/users"  render ={routerProps => <UserController><Users {...routerProps}/></UserController>} />

        <AuthenticatedRoute path="/territories/states/create" component ={routerProps => <StateController><CreateState {...routerProps}/></StateController>} />
        <AuthenticatedRoute path="/territories/states/:id" component ={routerProps => <StateController><UpdateState {...routerProps}/></StateController>} />
        <AuthenticatedRoute path="/territories/states" component ={routerProps => <StateController><States {...routerProps}/></StateController>} />

        {/* <Route path="/territories/states/create"  render ={routerProps => <StateController><CreateState {...routerProps}/></StateController>} />
        <Route path="/territories/states/:id" render ={routerProps => <StateController><UpdateState {...routerProps}/></StateController>} />
        <Route path="/territories/states"  render ={routerProps => <StateController><States {...routerProps}/></StateController>} /> */}

        <AuthenticatedRoute path="/territories/lgas/create" component ={routerProps => <LgaController><CreateLga {...routerProps}/></LgaController>} />
        <AuthenticatedRoute path="/territories/lgas/:id" component ={routerProps => <LgaController><UpdateLga {...routerProps}/></LgaController>} />
        <AuthenticatedRoute path="/territories/lgas" component ={routerProps => <LgaController><Lgas {...routerProps}/></LgaController>} />

        {/* <Route path="/territories/lgas/create"  render ={routerProps => <LgaController><CreateLga {...routerProps}/></LgaController>} />
        <Route path="/territories/lgas/:id" render ={routerProps => <LgaController><UpdateLga {...routerProps}/></LgaController>} />
        <Route path="/territories/lgas"  render ={routerProps => <LgaController><Lgas {...routerProps}/></LgaController>} /> */}

        <AuthenticatedRoute path="/territories/wards/create" component ={routerProps => <WardController><CreateWard {...routerProps}/></WardController>} />
        <AuthenticatedRoute path="/territories/wards/:id" component ={routerProps => <WardController><UpdateWard {...routerProps}/></WardController>} />
        <AuthenticatedRoute path="/territories/wards" component ={routerProps => <WardController><Wards {...routerProps}/></WardController>} />

        {/* <Route path="/territories/wards/create"  render ={routerProps => <WardController><CreateWard {...routerProps}/></WardController>} />
        <Route path="/territories/wards/:id" render ={routerProps => <WardController><UpdateWard {...routerProps}/></WardController>} />
        <Route path="/territories/wards"  render ={routerProps => <WardController><Wards {...routerProps}/></WardController>} /> */}

        <AuthenticatedRoute path="/territories/polling-units/create" component ={routerProps => <PUController><CreatePollingUnit {...routerProps}/></PUController>} />
        <AuthenticatedRoute path="/territories/polling-units/:id" component ={routerProps => <PUController><UpdatePollingUnit {...routerProps}/></PUController>} />
        <AuthenticatedRoute path="/territories/polling-units" component ={routerProps => <PUController><PollingUnits {...routerProps}/></PUController>} />

        {/* <Route path="/territories/polling-units/create"  render ={routerProps => <PUController><CreatePollingUnit {...routerProps}/></PUController>} />
        <Route path="/territories/polling-units/:id" render ={routerProps => <PUController><UpdatePollingUnit {...routerProps}/></PUController>} />
        <Route path="/territories/polling-units"  render ={routerProps => <PUController><PollingUnits {...routerProps}/></PUController>} /> */}

        <AuthenticatedRoute path="/parties/create" component ={routerProps => <PartyController><CreateParty {...routerProps}/></PartyController>} />
        <AuthenticatedRoute path="/parties/:id" component ={routerProps => <PartyController><UpdateParty {...routerProps}/></PartyController>} />
        <AuthenticatedRoute path="/parties" component ={routerProps => <PartyController><Parties {...routerProps}/></PartyController>} />

        <AuthenticatedRoute path="/event/create" component ={routerProps => <PartyController><CreateEvent {...routerProps}/></PartyController>} />
        <AuthenticatedRoute path="/event/:id" component ={routerProps => <PartyController><UpdateEvent {...routerProps}/></PartyController>} />
        <AuthenticatedRoute path="/event" component ={routerProps => <PartyController><Event {...routerProps}/></PartyController>} />
        
        <AuthenticatedRoute path="/event-records" component ={routerProps => <PartyController><EventRecord {...routerProps}/></PartyController>} />

        {/* <Route path="/parties/create"  render ={routerProps => <PartyController><CreateParty {...routerProps}/></PartyController>} />
        <Route path="/parties/:id" render ={routerProps => <PartyController><UpdateParty {...routerProps}/></PartyController>} />
        <Route path="/parties"  render ={routerProps => <PartyController><Parties {...routerProps}/></PartyController>} /> */}

        <AuthenticatedRoute path="/agents/create" component ={routerProps => <AgentController><CreateAgent {...routerProps}/></AgentController>} />
        <AuthenticatedRoute path="/agents/:id" component ={routerProps => <AgentController><UpdateAgent {...routerProps}/></AgentController>} />
        <AuthenticatedRoute path="/agents" component ={routerProps => <AgentController><Agents {...routerProps}/></AgentController>} />

        {/* <Route path="/agents/create"  render ={routerProps => <AgentController><CreateAgent {...routerProps}/></AgentController>} />
        <Route path="/agents/:id" render ={routerProps => <AgentController><UpdateAgent {...routerProps}/></AgentController>} />
        <Route path="/agents"  render ={routerProps => <AgentController><Agents {...routerProps}/></AgentController>} /> */}

        {/* <Route path="/results/create"  render ={routerProps => <ResultController><CreateResult {...routerProps}/></ResultController>} />
        <Route path="/results/:id" render ={routerProps => <ResultController><UpdateResult {...routerProps}/></ResultController>} />
        <Route path="/results"  render ={routerProps => <ResultController><Results {...routerProps}/></ResultController>} /> */}

        <AuthenticatedRoute path="/results/create" component ={routerProps => <ResultController><CreateResult {...routerProps}/></ResultController>} />
        <AuthenticatedRoute path="/results/:id" component ={routerProps => <ResultController><UpdateResult {...routerProps}/></ResultController>} />
        <AuthenticatedRoute path="/results" component ={routerProps => <ResultController><Results {...routerProps}/></ResultController>} />
        
        <AuthenticatedRoute path="/electionTypes/:id" component ={routerProps => <ResultController><UpdateResult {...routerProps}/></ResultController>} />
        <AuthenticatedRoute path="/electionTypes" component ={routerProps => <ResultController><ElectionTypes {...routerProps}/></ResultController>} />

        <AuthenticatedRoute path="/incident-group/create" component ={routerProps => <StateController><CreateIncidentGroup {...routerProps}/></StateController>} />
        <AuthenticatedRoute path="/incident-group/:id" component ={routerProps => <StateController><UpdateIncidentGroup {...routerProps}/></StateController>} />
        <AuthenticatedRoute path="/incident-group" component ={routerProps => <StateController><IncidentGroup {...routerProps}/></StateController>} />

        {/* <Route path="/incidents/create"  render ={routerProps => <IncidentController><CreateIncident {...routerProps}/></IncidentController>} />
        <Route path="/incidents/:id" render ={routerProps => <IncidentController><UpdateIncident {...routerProps}/></IncidentController>} /> */}
        <AuthenticatedRoute path="/incidents/create" component ={routerProps => <IncidentController><CreateIncident {...routerProps}/></IncidentController>} />
        <AuthenticatedRoute path="/incidents/:id" component ={routerProps => <IncidentController><UpdateIncident {...routerProps}/></IncidentController>} />
        <AuthenticatedRoute path="/incidents" component ={routerProps => <IncidentController><Incidents {...routerProps}/></IncidentController>} />

        <AuthenticatedRoute path="/dashboard/home" component ={routerProps => <Home {...routerProps}/>} />
        <AuthenticatedRoute path="/dashboard/results" component ={routerProps => <ResultController><ResultDashboard {...routerProps}/></ResultController>} />
        <AuthenticatedRoute path="/dashboard/resultsNational" component ={routerProps => <ResultController><ResultDashboardNational {...routerProps}/></ResultController>} />
        <AuthenticatedRoute path="/dashboard/incidents" component ={routerProps => <IncidentController><IncidentDashboard {...routerProps}/></IncidentController>} />
        <AuthenticatedRoute path="/dashboard/events" component ={routerProps => <IncidentController><EventsDashboard {...routerProps}/></IncidentController>} />
        <AuthenticatedRoute path="/dashboard" component ={routerProps => <Home {...routerProps}/>} />
        <Redirect to="/login" />
      </Switch>
    </div>
  );
}

export default App;
