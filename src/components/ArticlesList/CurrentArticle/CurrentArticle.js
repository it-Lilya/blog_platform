import React, { useState, useEffect, useRef } from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

import classes from '../Article/Article.module.scss';
const CurrentArticle = ({ currentArticle }) => {
  const [markdownText, setMarkdownText] = useState('');
  const [loader, setLoader] = useState(true);
  const [intervals, setIntervals] = useState();
  const [control, setControl] = useState(false);
  const [currentLike, setCurrentLike] = useState(classes.article__like__btn);
  const [count, setCount] = useState();
  const [current, setCurrent] = useState(currentArticle);
  const progressBar = useRef(null);
  const loadedRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIntervals(() => setInterval(() => increase(), 10));
    if (localStorage.getItem('auth') && JSON.parse(localStorage.getItem('auth')) === true) {
      fetch(`https://api.realworld.io/api/articles/${JSON.parse(localStorage.getItem('currentArticle'))}`, {
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCurrent(data.article));
    } else {
      fetch(`https://api.realworld.io/api/articles/${JSON.parse(localStorage.getItem('currentArticle'))}`)
        .then((res) => res.json())
        .then((data) => setCurrent(data.article));
    }
  }, []);

  useEffect(() => {
    if (loader === false) {
      loadedRef.current = 100;
      setTimeout(() => {
        setIntervals(clearInterval(intervals));
      }, 0);
    } else {
      loadedRef.current = 0;
      setIntervals(() => setInterval(() => increase(), 10));
    }
  }, [loader]);

  useEffect(() => {
    if (current) {
      setCount(current.favoritesCount);
      const formattedText = current.body.replace(/\\n/g, '\n\n');
      setMarkdownText(formattedText);
      if (JSON.parse(localStorage.getItem('auth'))) {
        if (current.favorited === true) {
          setCurrentLike(classes.article__like__btn__active);
        } else {
          setCurrentLike(classes.article__like__btn);
        }
      }
      if (JSON.parse(localStorage.getItem('username')) === current.author.username) {
        setControl(false);
      } else {
        setControl(true);
      }
      setLoader(false);
    }
  }, [current]);

  function increase() {
    if (loadedRef.current < 100) {
      loadedRef.current = loadedRef.current + 2;
      if (progressBar.current) {
        progressBar.current.style.width = `${loadedRef.current}%`;
      }
    } else {
      loadedRef.current = '100%';
      setTimeout(() => {
        setIntervals(clearInterval(intervals));
      }, 25);
    }
    return loadedRef.current;
  }

  const formatPublication = (date) => {
    const dates = new Date(date);
    let month = dates.toLocaleString('en', { month: 'long' });
    let day = dates.toLocaleString('en', { day: 'numeric' });
    let year = dates.toLocaleString('en', { year: 'numeric' });
    return `${month} ${day}, ${year}`;
  };

  function deletedArticle() {
    document.querySelector(`.${classes.modal}`).style.display = 'block';
  }

  function choice(e) {
    let currentBtn;
    if (e.target.tagName === 'BUTTON') {
      currentBtn = e.target.firstChild;
    } else {
      currentBtn = e.target;
    }
    if (currentBtn.textContent === 'No') {
      document.querySelector(`.${classes.modal}`).style.display = 'none';
      return;
    } else {
      fetch(`https://api.realworld.io/api/articles/${current.slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }).then((res) => {
        if (res.ok) {
          document.querySelector(`.${classes.modal}`).style.display = 'none';
          window.scrollTo(0, 0);
          navigate('/articles');
        }
      });
    }
  }

  return (
    <div className={classes.main__container}>
      {loader ? (
        <div
          className={classes.progress}
          style={{ height: '10px', borderRadius: '0px', position: 'absolute', width: '100%', top: '0px', zIndex: '2' }}
        >
          <div
            ref={progressBar}
            role="progress"
            className={classes.progress__bar}
            aria-valuenow="20"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: '0%' }}
          ></div>
        </div>
      ) : (
        <div className={classes.one__article__container}>
          <div className={classes.article}>
            <div className={classes.article__container}>
              <div className={classes.article__title__header}>
                <a className={classes.article__header}>
                  <div className={classes.article__title}>{current.title}</div>
                </a>
                <div className={classes.article__like__favorite}>
                  <button type="button" className={currentLike}></button>
                  <div className={classes.article__likes}>{count}</div>
                </div>
              </div>
              <div className={classes.article__tags}>
                {current.tagList.map((tag, index) => (
                  <div
                    className={`${classes.article__tag} ${index === 0 ? classes.article__tag_active : ''}`}
                    key={tag}
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <div className={classes.article__text}>{current.description}</div>
              <MarkdownToJsx>{markdownText}</MarkdownToJsx>
            </div>
            <div className={classes.article__right__column}>
              <div className={classes.article__author}>
                <div className={classes.article__author__container}>
                  <div className={classes.article__author__name}>{current.author.username}</div>
                  <div className={classes.article__author__date_publication}>
                    {formatPublication(current.createdAt)}
                  </div>
                </div>
                <img
                  className={classes.article__author__avatar}
                  src={current.author.image}
                  alt={current.author.username}
                />
              </div>
              {control ? null : (
                <div className={classes.control__container}>
                  <button type="button" className={classes.control__delete} onClick={deletedArticle}>
                    Delete
                  </button>
                  <Link to={`/articles/${current.slug}/edit`} className={classes.control__edit}>
                    Edit
                  </Link>
                  <div className={classes.modal}>
                    <div className={classes.modal__container}>
                      <div className={classes.modal__image} />
                      <p className={classes.modal__text__warn}>Are you sure to delete this article?</p>
                    </div>
                    <div className={classes.modal__confirmation} onClick={(e) => choice(e)}>
                      <Button className={classes.modal__confirmation__no}>No</Button>
                      <Button className={classes.modal__confirmation__yes} type="primary">
                        Yes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentArticle;
