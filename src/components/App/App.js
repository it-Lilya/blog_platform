// eslint-disable-next-line import/order
import React, { useEffect, useState } from 'react';

import './App.css';

import { Routes, Route, useLocation } from 'react-router-dom';

import Header from '../Header/Header';
import ArticlesList from '../ArticlesList/ArticlesList';
// import Article from '../ArticlesList/Article/Article';

import SignUp from './../Header/SignUp/SignUp';
import SignIn from './../Header/SignIn/SignIn';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allArticles, setAllArticles] = useState([]);
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(true);
  const location = useLocation();
  // const [currentArticleOne, setCurrentArticleOne] = useState();
  useEffect(() => {
    try {
      fetch('https://api.realworld.io/api/users', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: `abracadabraasdad${Math.random() * 0.2543}`,
            email: `abracadabraasdad${Math.random() * 0.2543}`,
            password: `abracadabraasdad${Math.random() * 0.2543}`,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          localStorage.setItem('token', JSON.stringify(data.user.token));
        });
    } catch (error) {
      console.log(error);
    }
    fetch('https://api.realworld.io/api/articles')
      .then((response) => response.json())
      .then((data) => {
        setAllArticles(data.articles);
        setArticles(data.articles.slice(0, 5));
        setLoader(false);
      });
  }, []);
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
    console.log(user, location);
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
  return (
    <div className="App">
      <Header />
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
        <Route path="/sign-in" element={<SignIn />} />
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
      </Routes>
    </div>
  );
};

export default App;
