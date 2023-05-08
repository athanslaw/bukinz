import React, {useContext} from "react";
import { Breadcrumbs, Breadcrumb } from "react-breadcrumbs";
import Layout from "../../shared/Layout";
import { AuthContext } from '../../contexts/AuthContext';
import Dashboard from '../../shared/assets/icons/sr-dashboard.png';

const Home = ({match, location}) => {

    const [authState, dispatch] = useContext(AuthContext);
    
  
    return (
        <Layout location={location}>
            <Breadcrumb data={{
                title: 'Dashboard',
                pathname: match.path
            }}><img src={Dashboard} alt="image" style={{"width":"100%"}} />
            </Breadcrumb>
        </Layout>
    );
}

export default Home;
