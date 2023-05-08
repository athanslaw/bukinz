import React, {useReducer, useMemo, createContext} from 'react';
import PropTypes from 'prop-types';

const initialState = {
  loading: false,
  success: false,
  isLoggedIn: false,
  user: null,
  error: null,
};

const initialContext = [{...initialState}, () => {}];

export const AuthContext = createContext(initialContext);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        isLoggedIn: true,
        user: action.payload.response,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        success: false,
        isLoggedIn: false,
        error: action.payload.error,
      };
    default:
      return {
        ...initialState,
      };
  }
};

export function AuthController(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

AuthController.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
