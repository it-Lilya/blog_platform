import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Header.module.scss';
// import SignIn from './SignIn/SignIn';
// import SignUp from './SignUp/SignUp';

const Header = () => {
  return (
    <header className={classes.header}>
      <div className={classes.header__container}>
        <div className={classes.header__title}>Realworld Blog</div>
        <div className={classes.header__login_container}>
          <Link to="/sign-in" className={classes.header__signIn}>
            Sign in
          </Link>
          <Link to="/sign-up" className={classes.header__signUp}>
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
