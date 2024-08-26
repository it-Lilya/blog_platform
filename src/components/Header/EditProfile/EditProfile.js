import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import classes from './EditProfile.module.scss';

const EditProfile = ({ editName }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api.realworld.io/api/user', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.user);
        setValue('username', data.user.username);
        setValue('email', data.user.email);
      });
  }, [setValue]);

  const onSubmit = (formData) => {
    fetch('https://api.realworld.io/api/user', {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${data.token}`,
      },
      body: JSON.stringify({
        user: {
          ...data,
          ...formData,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('username', JSON.stringify(data.user.username.trim()));
          localStorage.setItem('image', JSON.stringify(data.user.image));
        }
        editName(formData.username);
      });
    setTimeout(() => {
      navigate('/articles');
    }, 100);
  };

  return (
    <div className={classes.edit__main}>
      <div className={classes.edit__container}>
        <h3 className={classes.edit__title}>Edit Profile</h3>
        <form className={classes.edit__form} onSubmit={handleSubmit(onSubmit)}>
          <label className={classes.edit__label}>
            Username
            <input
              className={`${classes.edit__input} ${errors.username ? classes.edit__input__warn : ''}`}
              type="text"
              placeholder="Username"
              minLength={5}
              {...register('username', {
                required: 'Username',
                pattern: {
                  value: /^.{6,20}$/,
                  message: 'Username must be between 6 and 20 characters long.',
                },
                validate: {
                  notEmpty: (value) => value.trim() !== '' || 'Username cannot be empty',
                },
              })}
            />
            {errors.username && <span className={classes.edit__warning}>{errors.username.message}</span>}
          </label>
          <label className={classes.edit__label}>
            Email address
            <input
              className={`${classes.edit__input} ${errors.email ? classes.edit__input__warn : ''}`}
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'Please enter a valid email address',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && <span className={classes.edit__warning}>{errors.email.message}</span>}
          </label>
          <label className={classes.edit__label}>
            New password
            <input
              className={`${classes.edit__input} ${errors.password ? classes.edit__input__warn : ''}`}
              type="password"
              placeholder="Password"
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'Your password needs to be at least 6 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'Your password needs to be less than 40 characters',
                },
                validate: {
                  notEmpty: (value) => value.trim() !== '' || 'Password cannot be empty',
                },
              })}
            />
            {errors.password && <span className={classes.edit__warning}>{errors.password.message}</span>}
          </label>
          <label className={`${classes.edit__label} ${classes.edit__avatar}`}>
            Avatar image(url)
            <input
              className={`${classes.edit__input} ${errors.image ? classes.edit__input__warn : ''}`}
              type="url"
              placeholder="Avatar image"
              {...register('image', {
                pattern: {
                  value: /^(https?:\/\/)?([^\s$.?#].[^\s]*)$/i,
                  message: 'The URL is incorrect',
                },
              })}
            />
            {errors.image && <span className={classes.edit__warning}>{errors.image.message}</span>}
          </label>
          <Button type="primary" className={classes.edit__save} htmlType="submit">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
