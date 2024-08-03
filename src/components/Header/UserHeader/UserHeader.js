import React from 'react';
import { Link } from 'react-router-dom';

import classes from './UserHeader.module.scss';
export const UserHeader = ({ editFlag, currentName }) => {
  return (
    <div className={classes.container}>
      <Link className={classes.create}>Create article</Link>
      <Link to="/profile" className={classes.author}>
        <p className={classes.author__name}>{currentName}</p>
        <img className={classes.author__image} src={JSON.parse(localStorage.getItem('image'))}></img>
      </Link>
      <Link className={classes.logOut} onClick={() => editFlag()}>
        Log Out
      </Link>
    </div>
  );
};
