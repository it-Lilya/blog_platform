import React, { useState, useEffect, useRef } from 'react';
import { Pagination } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import classes from './ArticlesList.module.scss';
import Article from './Article/Article';

const ArticlesList = ({
  articles,
  gettingCurrentArticle,
  // editPage,
  // page,
  currentArticle,
  deleteCurrentArticle,
  allArticles,
}) => {
  const progressBar = useRef(null);
  const loadedRef = useRef(0);
  const [intervals, setIntervals] = useState();
  // const [allArticles, setAllArticles] = useState([]);
  const [articlesList, setArticles] = useState(articles);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  useEffect(() => setIntervals(() => setInterval(() => increase(), 10)), []);
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
    setLoader(true);
    fetch(`https://api.realworld.io/api/articles?limit=5&offset=${(page - 1) * 5}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles.slice(0, 5));
        setTimeout(() => {
          setLoader(false);
        }, 150);
      });
    deleteCurrentArticle();
  }, []);
  // useEffect(() => console.log(page), [page]);
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
  function editPage(e) {
    setLoader(true);
    setPage(e);
    fetch(`https://api.realworld.io/api/articles?limit=5&offset=${(e - 1) * 5}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
        setLoader(false);
      });
  }
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
            {articlesList.map((o) => {
              return (
                <div className={classes.main__element} key={uuidv4()}>
                  <Article
                    className={classes.main__element}
                    article={o}
                    length={articlesList.length}
                    gettingCurrentArticle={gettingCurrentArticle}
                    currentArticle={currentArticle}
                  />
                </div>
              );
            })}
          </ul>
          {articles.length > 1 && (
            <Pagination total={allArticles.length * 2} current={page} onChange={(e) => editPage(e)} />
          )}
        </>
      )}
    </main>
  );
};

export default ArticlesList;
