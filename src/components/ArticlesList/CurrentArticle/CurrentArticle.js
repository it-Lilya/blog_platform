import React, { useState, useEffect, useRef } from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

import classes from '../Article/Article.module.scss';
const CurrentArticle = ({ currentArticle }) => {
  const [markdownText, setMarkdownText] = useState('');
  const [loader, setLoader] = useState(true);
  const progressBar = useRef(null);
  const loadedRef = useRef(0);
  const [intervals, setIntervals] = useState();
  const [control, setControl] = useState(false);
  const [currentLike, setCurrentLike] = useState(classes.article__like__btn);
  const [favorite, setFavorite] = useState();
  const [count, setCount] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    setIntervals(() => setInterval(() => increase(), 10));
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
    if (currentArticle) {
      setCount(currentArticle.favoritesCount);
      const formattedText = currentArticle.body.replace(/\\n/g, '\n\n');
      setMarkdownText(formattedText);
      if (currentArticle.favorited === true && JSON.parse(localStorage.getItem('auth')) === true) {
        setCurrentLike(classes.article__like__btn__active);
        setFavorite(currentArticle.favorited);
      } else {
        setCurrentLike(classes.article__like__btn);
      }
      if (JSON.parse(localStorage.getItem('username')) === currentArticle.author.username) {
        setControl(false);
      } else {
        setControl(true);
      }
      setLoader(false);
    }
  }, [currentArticle]);
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
      fetch(`https://api.realworld.io/api/articles/${currentArticle.slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
        },
      }).then((res) => {
        if (res.ok) {
          document.querySelector(`.${classes.modal}`).style.display = 'none';
          navigate('/articles');
        }
      });
    }
  }
  const like = () => {
    setFavorite(!favorite);
    if (JSON.parse(localStorage.getItem('auth')) === true) {
      setCurrentLike(favorite ? classes.article__like__btn : classes.article__like__btn__active);
      if (!favorite === true) {
        setCount(count + 1);
        fetch(`https://api.realworld.io/api/articles/${currentArticle.slug}/favorite`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }).then(async (res) => {
          if (res.ok) {
            return res.json();
          } else {
            const data = await res.json();
            throw new Error(data.message);
          }
        });
      } else {
        setCount(count - 1);
        fetch(`https://api.realworld.io/api/articles/${currentArticle.slug}/favorite`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }).then(async (res) => {
          if (res.ok) {
            return res.json();
          } else {
            const data = await res.json();
            throw new Error(data.message);
          }
        });
      }
    }
  };
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
                  <div className={classes.article__title}>{currentArticle.title}</div>
                </a>
                <div className={classes.article__like__favorite}>
                  <button type="button" className={currentLike} onClick={(e) => like(e)}></button>
                  <div className={classes.article__likes}>{count}</div>
                </div>
              </div>
              <div className={classes.article__tags}>
                {currentArticle.tagList.map((tag, index) => (
                  <div
                    className={`${classes.article__tag} ${index === 0 ? classes.article__tag_active : ''}`}
                    key={tag}
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <div className={classes.article__text}>{currentArticle.description}</div>
              <MarkdownToJsx>{markdownText}</MarkdownToJsx>
            </div>
            <div className={classes.article__right__column}>
              <div className={classes.article__author}>
                <div className={classes.article__author__container}>
                  <div className={classes.article__author__name}>{currentArticle.author.username}</div>
                  <div className={classes.article__author__date_publication}>
                    {formatPublication(currentArticle.createdAt)}
                  </div>
                </div>
                <img
                  className={classes.article__author__avatar}
                  src={currentArticle.author.image}
                  alt={currentArticle.author.username}
                />
              </div>
              {control ? null : (
                <div className={classes.control__container}>
                  <button type="button" className={classes.control__delete} onClick={deletedArticle}>
                    Delete
                  </button>
                  <Link to={`/articles/${currentArticle.slug}/edit`} className={classes.control__edit}>
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
