import React, {useEffect, useState} from 'react';
import { Redirect, Route } from 'react-router';

const AuthenticatedRoute = ({component: Component, isLoggedIn, ...rest}) => {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  useEffect(() => {
    if(!token){
      localStorage.clear();
    }
  }, [token])
  return (
    <Route
      {...rest}
      render={
        (props) => (token?.length) > 0 
            ? <Component {...props} />
            : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

export default AuthenticatedRoute;