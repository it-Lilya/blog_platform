// eslint-disable-next-line import/order
import React, { useEffect, useState } from 'react';

import './App.css';

import { Routes, Route } from 'react-router-dom';

import Header from '../Header/Header';
// eslint-disable-next-line import/order
import ArticlesList from '../ArticlesList/ArticlesList';
// import Article from '../ArticlesList/Article/Article';

import EditProfile from '../Header/EditProfile/EditProfile';

import SignUp from './../Header/SignUp/SignUp';
import SignIn from './../Header/SignIn/SignIn';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allArticles, setAllArticles] = useState([]);
  // const [user, setUser] = useState();
  const [loader, setLoader] = useState(true);
  const [flag, setFlag] = useState(false);
  const [currentName, setCurrentName] = useState(JSON.parse(localStorage.getItem('username')));
  // const [currentArticleOne, setCurrentArticleOne] = useState();
  useEffect(() => {
    fetch('https://api.realworld.io/api/articles')
      .then((response) => response.json())
      .then((data) => {
        setAllArticles(data.articles);
        setArticles(data.articles.slice(0, 5));
        setLoader(false);
      });
  }, []);
  useEffect(() => {
    setCurrentName(JSON.parse(localStorage.getItem('username')));
  });
  function editPage(e) {
    setLoader(true);
    setCurrentPage(e);
    fetch(`https://api.realworld.io/api/articles?limit=5&offset=${(e - 1) * 5}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
        setTimeout(() => {
          setLoader(false);
        }, 200);
      });
  }
  function currentArticle(e) {
    setLoader(true);
    fetch(`https://api.realworld.io/api/articles/${e}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles([data.article]);
        setLoader(false);
      });
  }
  function editFlag() {
    setFlag(!flag);
  }
  function editName(value) {
    setCurrentName(value);
  }
  return (
    <div className="App">
      <Header flag={flag} editFlag={editFlag} currentName={currentName} />
      <Routes>
        <Route
          path="/"
          exec
          element={
            <ArticlesList
              articles={articles}
              page={currentPage}
              editPage={editPage}
              data={allArticles}
              loader={loader}
              currentArticle={currentArticle}
            />
          }
        />
        <Route
          path="/articles"
          exec
          element={
            <ArticlesList
              articles={articles}
              page={currentPage}
              editPage={editPage}
              data={allArticles}
              loader={loader}
              currentArticle={currentArticle}
            />
          }
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn editFlag={editFlag} />} />
        <Route
          path="articles/:id"
          exec
          element={
            <ArticlesList
              articles={articles}
              page={currentPage}
              editPage={editPage}
              data={allArticles}
              loader={loader}
              currentArticle={currentArticle}
            />
          }
        />
        <Route path="/profile" element={<EditProfile editName={editName} />} />
      </Routes>
    </div>
  );
};

export default App;
