import React, { useState, useEffect, useRef } from 'react';
import { Pagination } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import classes from './ArticlesList.module.scss';
import Article from './Article/Article';

const ArticlesList = ({ articles = [], gettingCurrentArticle, deleteCurrentArticle, allArticles }) => {
  const progressBar = useRef(null);
  const loadedRef = useRef(0);
  const [intervals, setIntervals] = useState();
  const [articlesList, setArticles] = useState(articles);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(localStorage.getItem('page') ? JSON.parse(localStorage.getItem('page')) : 1);

  useEffect(() => {
    setIntervals(() => setInterval(increase, 10));
    deleteCurrentArticle();
    fetchArticles(page);
    return () => clearInterval(intervals);
  }, []);

  useEffect(() => {
    if (!loader) {
      loadedRef.current = 100;
      clearInterval(intervals);
    }
  }, [loader]);

  const fetchArticles = (pageNumber) => {
    setLoader(true);
    if (JSON.parse(localStorage.getItem('auth')) === true) {
      if (pageNumber === 1) {
        fetch('https://api.realworld.io/api/articles', {
          headers: {
            Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setArticles(data.articles.slice(0, 5));
            setTimeout(() => setLoader(false), 150);
          });
      } else {
        fetch(`https://api.realworld.io/api/articles?limit=5&offset=${(pageNumber - 1) * 5}`, {
          headers: {
            Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setArticles(data.articles);
            setTimeout(() => setLoader(false), 150);
          });
      }
    } else {
      if (pageNumber === 1) {
        fetch('https://api.realworld.io/api/articles')
          .then((response) => response.json())
          .then((data) => {
            setArticles(data.articles.slice(0, 5));
            setTimeout(() => setLoader(false), 150);
          });
      } else {
        fetch(`https://api.realworld.io/api/articles?limit=5&offset=${(pageNumber - 1) * 5}`)
          .then((response) => response.json())
          .then((data) => {
            setArticles(data.articles);
            setTimeout(() => setLoader(false), 150);
          });
      }
    }
  };

  const increase = () => {
    if (loadedRef.current < 100) {
      loadedRef.current += 2;
      if (progressBar.current) {
        progressBar.current.style.width = `${loadedRef.current}%`;
      }
    } else {
      clearInterval(intervals);
    }
  };
  const editPage = (pageNumber) => {
    setPage(pageNumber);
    localStorage.setItem('page', pageNumber);
    fetchArticles(pageNumber);
  };
  return (
    <main className={classes.main}>
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
        <>
          <ul className={classes.main__container}>
            {articlesList.map((article, index) => (
              <div className={classes.main__element} key={uuidv4()} id={index}>
                <Article
                  className={classes.main__element}
                  article={article}
                  length={articlesList.length}
                  gettingCurrentArticle={gettingCurrentArticle}
                  // currentArticle={currentArticle}
                />
              </div>
            ))}
          </ul>
          {allArticles.length > 1 && <Pagination total={allArticles.length * 2} current={page} onChange={editPage} />}
        </>
      )}
    </main>
  );
};

export default ArticlesList;
