import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Header.module.scss';
import { UserHeader } from './UserHeader/UserHeader';

const Header = ({ currentName, editFlagFalse, flag }) => {
  return (
    <header className={classes.header}>
      <div className={classes.header__container}>
        <Link to="/articles" className={classes.header__title}>
          Realworld Blog
        </Link>
        <div className={classes.header__login_container}>
          {flag ? (
            <UserHeader editFlagFalse={editFlagFalse} currentName={currentName} />
          ) : (
            <>
              <Link to="/sign-in" className={classes.header__signIn}>
                Sign in
              </Link>
              <Link to="/sign-up" className={classes.header__signUp}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
