import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import classes from './Article.module.scss';
const Article = ({ article, length, gettingCurrentArticle }) => {
  const [classesDescription, setClassesDescription] = useState(classes.article__text);
  const [classesAuthor, setClassesAuthor] = useState(classes.article__author__container);
  const [currentLike, setCurrentLike] = useState(classes.article__like__btn);
  const [favorite, setFavorite] = useState();
  const [count, setCount] = useState(article.favoritesCount);
  useEffect(() => {
    if (length === 1) {
      setClassesDescription(classes.article__text + ' ' + classes.article__text__one);
      setClassesAuthor(classes.article__author__container + ' ' + classes.article__author__one);
    }
    setFavorite(article.favorited);
    if (article.favorited === true && JSON.parse(localStorage.getItem('auth')) === true) {
      setCurrentLike(classes.article__like__btn__active);
    } else {
      setCurrentLike(classes.article__like__btn);
    }
  }, []);
  const formatPublication = (date) => {
    const dates = new Date(date);
    let month = dates.toLocaleString('en', { month: 'long' });
    let day = dates.toLocaleString('en', { day: 'numeric' });
    let year = dates.toLocaleString('en', { year: 'numeric' });
    return `${month} ${day}, ${year}`;
  };
  const like = () => {
    setFavorite(!favorite);
    if (JSON.parse(localStorage.getItem('auth')) === true) {
      setCurrentLike(favorite ? classes.article__like__btn : classes.article__like__btn__active);
      if (!favorite === true) {
        setCount(count + 1);
        fetch(`https://api.realworld.io/api/articles/${article.slug}/favorite`, {
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
        fetch(`https://api.realworld.io/api/articles/${article.slug}/favorite`, {
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
    <div className={classes.article}>
      <div className={classes.article__container}>
        <div className={classes.article__title__header}>
          <Link
            to={`/articles/${article.slug}`}
            className={classes.article__title}
            onClick={() => gettingCurrentArticle(article.slug)}
          >
            {article.title}
          </Link>
          <div className={classes.article__like__favorite}>
            <button type="button" className={currentLike} onClick={(e) => like(e)}></button>
            <div className={classes.article__likes}>{count}</div>
          </div>
        </div>
        <div className={classes.article__tags}>
          {article.tagList.map((tag, index) => (
            <div className={`${classes.article__tag} ${index === 0 ? classes.article__tag_active : ''}`} key={tag}>
              {tag}
            </div>
          ))}
        </div>
        <div className={classesDescription}>{article.description}</div>
      </div>
      <div className={classes.article__author}>
        <div className={classesAuthor}>
          <div className={classes.article__author__name}>{article.author.username}</div>
          <div className={classes.article__author__date_publication}>{formatPublication(article.createdAt)}</div>
        </div>
        <img className={classes.article__author__avatar} src={article.author.image} alt={article.author.username} />
      </div>
    </div>
  );
};

export default Article;
