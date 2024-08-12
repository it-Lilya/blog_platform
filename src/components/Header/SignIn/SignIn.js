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
  function createWarnElem(text) {
    const warn = document.createElement('span');
    warn.className = classes.entry__warning;
    warn.textContent = text;
    return warn;
  }
  function submitForm(data) {
    if (document.querySelector('input[type="email"]').parentElement.querySelector('span')) {
      document
        .querySelector('input[type="email"]')
        .parentElement.removeChild(document.querySelector('input[type="email"]').parentElement.querySelector('span'));
    }
    if (document.querySelector('input[type="password"]').parentElement.querySelector('span')) {
      document
        .querySelector('input[type="password"]')
        .parentElement.removeChild(
          document.querySelector('input[type="password"]').parentElement.querySelector('span')
        );
    }
    if (data.email.trim().length !== 0 && data.password.trim().length !== 0) {
      try {
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
          .then((res) => {
            if (res.status === 403) {
              return errFunc();
            }
            return res.json();
          })
          .then((data) => {
            if (data) {
              localStorage.setItem('user', JSON.stringify(data.user));
              localStorage.setItem('image', JSON.stringify(data.user.image));
              localStorage.setItem('username', JSON.stringify(data.user.username.trim()));
              localStorage.setItem('auth', JSON.stringify(true));
              editFlag();
              setTimeout(() => {
                navigate('/articles');
              }, 100);
            }
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      if (data.email.trim().length === 0) {
        if (!document.querySelector('input[type="email"]').parentElement.querySelector('span')) {
          document.querySelector('input[type="email"]').parentElement.appendChild(createWarnElem('Enter login'));
        }
      }
      if (data.password.trim().length === 0) {
        if (!document.querySelector('input[type="password"]').parentElement.querySelector('span')) {
          document.querySelector('input[type="password"]').parentElement.appendChild(createWarnElem('Enter password'));
        }
      }
    }
  }
  function errFunc() {
    document
      .querySelector('input[type="password"]')
      .parentElement.appendChild(createWarnElem('This user is not registered!'));
  }
  return (
    <div className={classes.entrance__main}>
      <div className={classes.entrance__container}>
        <h3 className={classes.entrance__title}>Sign In</h3>
        <form className={classes.entrance__form}>
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
        </form>
      </div>
    </div>
  );
};

export default SignIn;
