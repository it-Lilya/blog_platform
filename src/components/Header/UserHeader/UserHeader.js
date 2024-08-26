import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import classes from './UserHeader.module.scss';
export const UserHeader = ({ editFlagFalse, currentName }) => {
  const [img, setImg] = useState(JSON.parse(localStorage.getItem('image')));
  const location = useLocation();
  const basePath = location.pathname === '/' ? '/articles' : location.pathname;
  const firstSegment = basePath.split('/')[1];

  useEffect(() => {
    setTimeout(() => {
      setImg(JSON.parse(localStorage.getItem('image')));
    }, 700);
  });

  return (
    <div className={classes.container}>
      <Link to={`${firstSegment}/new-article`} className={classes.create}>
        Create article
      </Link>
      <Link to={`${firstSegment}/profile`} className={classes.author}>
        <p className={classes.author__name}>{currentName}</p>
        <img className={classes.author__image} src={img}></img>
      </Link>
      <Link className={classes.logOut} onClick={() => editFlagFalse()}>
        Log Out
      </Link>
    </div>
  );
};
