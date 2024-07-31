import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import classes from './Article.module.scss';

const Article = ({ article, length, currentArticle }) => {
  const [classesDescription, setClassesDescription] = useState(classes.article__text);
  const [classesAuthor, setClassesAuthor] = useState(classes.article__author__container);
  useEffect(() => {
    if (length === 1) {
      setClassesDescription(classes.article__text + ' ' + classes.article__text__one);
      setClassesAuthor(classes.article__author__container + ' ' + classes.article__author__one);
    }
  }, []);
  const formatPublication = (date) => {
    const dates = new Date(date);
    let month = dates.toLocaleString('en', { month: 'long' });
    let day = dates.toLocaleString('en', { day: 'numeric' });
    let year = dates.toLocaleString('en', { year: 'numeric' });
    return `${month} ${day}, ${year}`;
  };
  return (
    <div className={classes.article}>
      <div className={classes.article__container}>
        <div className={classes.article__title__header}>
          <Link to={`/articles/${article.slug}`}>
            <div className={classes.article__title} onClick={() => currentArticle(article.slug)}>
              {article.title}
            </div>
          </Link>
          <div className={classes.article__likes}>{article.favoritesCount}</div>
        </div>
        <div className={classes.article__tags}>
          {article.tagList.map((tag, index) => (
            <div className={`${classes.article__tag} ${index === 0 ? classes.article__tag_active : ''}`} key={tag}>
              {tag}
            </div>
          ))}
        </div>
        <div className={classesDescription}>{article.description}</div>
        {length === 1 && <div className={classes.article__read_more}>{article.body}</div>}
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
