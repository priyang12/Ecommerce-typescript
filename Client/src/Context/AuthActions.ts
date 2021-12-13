import {
  LOGIN_SUCCESS,
  AUTH_ERROR,
  LOAD_USER,
  SET_LOADING,
  LOG_OUT,
} from './Authtypes';

import axios, { AxiosError } from 'axios';
import setAuthToken from '../Utils/setAuthToken';
import { AuthActions } from './AuthReducer';
import React from 'react';

export const loadUser = async (
  token: any,
  dispatch: React.Dispatch<AuthActions>
) => {
  if (token) {
    setAuthToken(token);
    try {
      setLoading(dispatch);
      console.log(axios.defaults);

      const { data }: any = await axios.get('/api/users');
      dispatch({
        type: LOAD_USER,
        payload: data,
      });
    } catch (err: any | AxiosError) {
      let ErrorMessage = 'Server Error Try Again Later';
      if (err as AxiosError) {
        ErrorMessage = err.response.data?.msg;
      }

      dispatch({
        type: AUTH_ERROR,
        payload: ErrorMessage,
      });
    }
  }
};
export const LoginUser = async (
  user: any,
  dispatch: React.Dispatch<AuthActions>
) => {
  try {
    setLoading(dispatch);
    const { data }: any = await axios.post('/api/users/login', user);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem('token', data.token);
    loadUser(data.token, dispatch);
  } catch (err: any | AxiosError) {
    let ErrorMessage = 'Server Error Try Again Later';
    if (err as AxiosError) {
      ErrorMessage = err.response.data?.msg;
    }

    dispatch({
      type: AUTH_ERROR,
      payload: ErrorMessage,
    });
  }
};
export const RegisterUser = async (
  user: any,
  dispatch: React.Dispatch<AuthActions>
) => {
  try {
    setLoading(dispatch);
    const { data }: any = await axios.post('/api/users/register', user);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem('token', data.token);

    loadUser(data.token, dispatch);
  } catch (err: any | AxiosError) {
    let ErrorMessage = 'Server Error Try Again Later';
    if (err as AxiosError) {
      ErrorMessage = err.response.data?.msg;
    }
    dispatch({
      type: AUTH_ERROR,
      payload: ErrorMessage,
    });
  }
};

export const Logout = (dispatch: React.Dispatch<AuthActions>) => {
  try {
    setLoading(dispatch);
    localStorage.clear();
    dispatch({
      type: LOG_OUT,
      payload: null,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
      payload: 'Server Error Reload ',
    });
  }
};
export const setLoading = (dispatch: React.Dispatch<AuthActions>) => {
  dispatch({
    type: SET_LOADING,
    payload: null,
  });
};
