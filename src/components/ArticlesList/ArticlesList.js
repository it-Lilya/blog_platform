import React, { useState, useEffect, useRef } from 'react';
import { Pagination } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import classes from './ArticlesList.module.scss';
import Article from './Article/Article';

const ArticlesList = ({ articles, page, editPage, data, loader, currentArticle }) => {
  const progressBar = useRef(null);
  const loadedRef = useRef(0);
  const [intervals, setIntervals] = useState();
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
            {articles.map((o) => {
              return (
                // <Link to={`/articles/${i}`} key={i} style={{ textDecoration: 'none' }}>
                <div className={classes.main__element} key={uuidv4()}>
                  {/* <Link to={`/articles/${i}`} key={i} style={{ textDecoration: 'none' }}> */}
                  <Article
                    className={classes.main__element}
                    article={o}
                    length={articles.length}
                    currentArticle={currentArticle}
                  />
                  {/* </Link> */}
                </div>
              );
            })}
          </ul>
          {articles.length > 1 && <Pagination total={data.length * 2} current={page} onChange={(e) => editPage(e)} />}
        </>
      )}
    </main>
  );
};

export default ArticlesList;
