import React, { useState, useEffect, useRef } from 'react';
import { Pagination } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import classes from './ArticlesList.module.scss';
import Article from './Article/Article';

const ArticlesList = ({ articles = [], gettingCurrentArticle, deleteCurrentArticle, flag }) => {
  const progressBar = useRef(null);
  const [loaded, setLoaded] = useState(0);
  const [articlesList, setArticles] = useState(articles);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(localStorage.getItem('page') ? JSON.parse(localStorage.getItem('page')) : 1);

  useEffect(() => {
    fetchArticles(page);
    deleteCurrentArticle();
  }, []);

  useEffect(() => {
    if (!loader) {
      setLoaded(100);
    }
  }, [loader]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loaded < 100) {
        setLoaded((prev) => prev + 2);
      } else {
        clearInterval(interval);
      }
    }, 10);
    if (progressBar.current) {
      progressBar.current.style.width = `${loaded}%`;
    }
    return () => clearInterval(interval);
  }, [loaded]);

  // useEffect(() => {
  //   if (progressBar.current) {
  //     progressBar.current.style.width = `${loaded}%`;
  //   }
  // }, [loaded]);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('auth')) === false) {
      setLoaded(100);
      setLoader(false);
    }
  });
  const fetchArticles = async (pageNumber) => {
    setLoader(true);
    const auth = localStorage.getItem('auth') && JSON.parse(localStorage.getItem('auth')) === true;
    const url =
      pageNumber === 1
        ? 'https://api.realworld.io/api/articles'
        : `https://api.realworld.io/api/articles?limit=5&offset=${(pageNumber - 1) * 5}`;

    const res = await fetch(url, {
      headers: auth
        ? { Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}` }
        : { Accept: 'application/json' },
    });
    const data = await res.json();
    if (pageNumber === 1) {
      setArticles(data.articles.slice(0, 5));
    } else {
      setArticles(data.articles);
    }
    setLoader(false);
  };

  const editPage = (pageNumber) => {
    setPage(pageNumber);
    localStorage.setItem('page', pageNumber);
    fetchArticles(pageNumber);
  };

  useEffect(() => {
    setLoaded(0);
    setLoader(true);
  }, [flag]);

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
                />
              </div>
            ))}
          </ul>
          {JSON.parse(localStorage.getItem('articlesLength')) > 1 && (
            <Pagination
              total={JSON.parse(localStorage.getItem('articlesLength') * 2)}
              current={page}
              onChange={editPage}
            />
          )}
        </>
      )}
    </main>
  );
};

export default ArticlesList;
