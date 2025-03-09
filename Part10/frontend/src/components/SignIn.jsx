// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-native';
import useSignIn from '../hooks/useSignIn';
import { SignInContainer } from './SignInContainer';

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password });
      navigate('/');
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return <SignInContainer onSubmit={onSubmit} />;
};

export default SignIn;