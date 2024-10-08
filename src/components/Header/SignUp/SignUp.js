import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useForm } from 'react-hook-form';

import classes from './SignUp.module.scss';

const SignUp = ({ editFlagTrue }) => {
  const [check, setCheck] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  function createWarnElem(text) {
    const warn = document.createElement('span');
    warn.className = classes.registration__warning;
    warn.textContent = text;
    return warn;
  }
  const onSubmit = (data) => {
    if (check) {
      if (document.querySelectorAll('input[type="checkbox"]')[0].parentElement.querySelector('span')) {
        document
          .querySelectorAll('input[type="checkbox"]')[0]
          .parentElement.removeChild(
            document.querySelectorAll('input[type="checkbox"]')[0].parentElement.querySelector('span')
          );
      }
      try {
        fetch('https://api.realworld.io/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: {
              username: data.username,
              email: data.email,
              password: data.password,
            },
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              if (response.status === 422) {
                return errFunc();
              }
            }
          })
          .then((data) => {
            if (data.user) {
              editFlagTrue();
              localStorage.setItem('token', JSON.stringify(data.user.token));
              setTimeout(() => {
                navigate('/articles');
              });
            }
          })
          .catch((error) => console.error('Error:', error));
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      if (!document.querySelectorAll('input[type="checkbox"]')[0].parentElement.querySelector('span')) {
        document
          .querySelectorAll('input[type="checkbox"]')[0]
          .parentElement.appendChild(createWarnElem('Consent to the processing of personal data is required!'));
      }
    }
  };

  function errFunc() {
    document
      .querySelector('input[type="checkbox"]')
      .parentElement.appendChild(createWarnElem('This user is already registered!'));
  }

  return (
    <div className={classes.registration__main}>
      <div className={classes.registration__container}>
        <h3 className={classes.registration__title}>Create new account</h3>
        <form className={classes.registration__form} onSubmit={handleSubmit(onSubmit)}>
          <label className={classes.registration__label}>
            Username
            <input
              className={`${classes.registration__input} ${errors.username ? classes.registration__input__warn : ''}`}
              type="text"
              placeholder="Username"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 4 characters long',
                },
                maxLength: {
                  value: 20,
                  message: 'Username must be at most 20 characters long',
                },
              })}
            />
            {errors.username && <span className={classes.registration__warning}>{errors.username.message}</span>}
          </label>
          <label className={classes.registration__label}>
            Email address
            <input
              className={`${classes.registration__input} ${errors.email ? classes.registration__input__warn : ''}`}
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && <span className={classes.registration__warning}>{errors.email.message}</span>}
          </label>
          <label className={classes.registration__label}>
            Password
            <input
              className={`${classes.registration__input} ${errors.password ? classes.registration__input__warn : ''}`}
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
                maxLength: {
                  value: 40,
                  message: 'Password must be at most 40 characters long',
                },
              })}
            />
            {errors.password && <span className={classes.registration__warning}>{errors.password.message}</span>}
          </label>
          <label className={classes.registration__label}>
            Repeat password
            <input
              className={`${classes.registration__input} ${errors.repeatPassword ? classes.registration__input__warn : ''}`}
              type="password"
              placeholder="Repeat Password"
              {...register('repeatPassword', {
                required: 'Please repeat your password',
                validate: (value) => value === getValues('password') || 'Passwords do not match',
              })}
            />
            {errors.repeatPassword && (
              <span className={classes.registration__warning}>{errors.repeatPassword.message}</span>
            )}
          </label>
          <label className={`${classes.registration__label} ${classes.registration__line}`}>
            <input
              className={classes.registration__checkbox}
              type="checkbox"
              checked={check}
              onChange={() => setCheck(!check)}
            />
            I agree to the processing of my personal information
          </label>
          <Button type="primary" className={classes.registration__create} htmlType="submit">
            Create
          </Button>
          <p className={classes.registration__footnote}>
            Already have an account?{'\u00A0'}
            <Link to="/sign-in" className={classes.registration__link}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
