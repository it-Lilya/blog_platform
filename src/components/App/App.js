// eslint-disable-next-line import/order
import React, { useEffect, useState } from 'react';

import './App.css';

import { Routes, Route } from 'react-router-dom';

import Header from '../Header/Header';
import ArticlesList from '../ArticlesList/ArticlesList';
import EditProfile from '../Header/EditProfile/EditProfile';
import NewArticle from '../ArticlesList/NewArticle/NewArticle';
import PrivateRoute from '../ArticlesList/NewArticle/PrivateRoute';
import CurrentArticle from '../ArticlesList/CurrentArticle/CurrentArticle';

import SignUp from './../Header/SignUp/SignUp';
import SignIn from './../Header/SignIn/SignIn';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [flag, setFlag] = useState(false);
  const [currentName, setCurrentName] = useState(JSON.parse(localStorage.getItem('username')));
  const [currentArticle, setCurrentArticle] = useState();
  const [allArticles, setAllArticles] = useState([]);
  useEffect(() => {
    fetch('https://api.realworld.io/api/articles')
      .then((response) => response.json())
      .then((data) => {
        setAllArticles(data.articles);
        setArticles(data.articles.slice(0, 5));
      });
  }, []);
  useEffect(() => {
    setCurrentName(JSON.parse(localStorage.getItem('username')));
  });
  function gettingCurrentArticle(e) {
    fetch(`https://api.realworld.io/api/articles/${e}`)
      .then((res) => res.json())
      .then((data) => {
        return setCurrentArticle(data.article);
      });
    return currentArticle;
  }
  function editFlag() {
    setFlag(!flag);
    localStorage.setItem('auth', JSON.stringify(!flag));
  }
  function editName(value) {
    setCurrentName(value);
  }
  function deleteCurrentArticle() {
    setCurrentArticle();
  }
  return (
    <div className="App">
      <Header editFlag={editFlag} currentName={currentName} />
      <Routes>
        <Route
          path="/"
          exec
          element={
            <ArticlesList
              articles={articles}
              gettingCurrentArticle={gettingCurrentArticle}
              currentArticle={currentArticle}
              deleteCurrentArticle={deleteCurrentArticle}
              allArticles={allArticles}
            />
          }
        />
        <Route
          path="/articles"
          exec
          element={
            <ArticlesList
              articles={articles}
              gettingCurrentArticle={gettingCurrentArticle}
              currentArticle={currentArticle}
              deleteCurrentArticle={deleteCurrentArticle}
              allArticles={allArticles}
            />
          }
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn editFlag={editFlag} />} />
        <Route path="/articles/:id" exec element={<CurrentArticle currentArticle={currentArticle} />} />
        <Route
          path="/new-article"
          element={
            <PrivateRoute>
              <NewArticle gettingCurrentArticle={gettingCurrentArticle} flagForForm={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/articles/:id/edit"
          element={
            <PrivateRoute>
              <NewArticle gettingCurrentArticle={gettingCurrentArticle} flagForForm={false} />
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<EditProfile editName={editName} />} />
      </Routes>
    </div>
  );
};

export default App;
