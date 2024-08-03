import React from 'react';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import classes from './SignIn.module.scss';

const SignIn = ({ editFlag }) => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  function submitForm(data) {
    if (data.email !== '' && data.password !== '') {
      fetch('https://api.realworld.io/api/users/login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: data.email,
            password: data.password,
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('image', JSON.stringify(data.user.image));
          localStorage.setItem('username', JSON.stringify(data.user.username.trim()));
          localStorage.setItem('auth', JSON.stringify(true));
          editFlag();
          setTimeout(() => {
            navigate('/');
          }, 500);
        });
    } else {
      console.log('No');
    }
  }
  return (
    <div className={classes.entrance__main}>
      <div className={classes.entrance__container}>
        <h3 className={classes.entrance__title}>Sign In</h3>
        <div className={classes.entrance__form}>
          <label className={classes.entrance__label}>
            Email address
            <input
              className={classes.entrance__input}
              type="email"
              placeholder="Email address"
              {...register('email')}
            ></input>
          </label>
          <label className={classes.entrance__label}>
            Password
            <input
              className={classes.entrance__input}
              type="password"
              placeholder="Password"
              {...register('password')}
            ></input>
          </label>
          <Button type="primary" className={classes.entrance__login} onClick={handleSubmit(submitForm)}>
            Login
          </Button>
          <p className={classes.entrance__footnote}>
            Don’t have an account?{'\u00A0'}
            <Link to="/sign-up" className={classes.entrance__link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
