import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Header from '../Header/Header';
import ArticlesList from '../ArticlesList/ArticlesList';
import EditProfile from '../Header/EditProfile/EditProfile';
import NewArticle from '../ArticlesList/NewArticle/NewArticle';
import PrivateRoute from '../ArticlesList/NewArticle/PrivateRoute';
import CurrentArticle from '../ArticlesList/CurrentArticle/CurrentArticle';

import SignUp from './../Header/SignUp/SignUp';
import SignIn from './../Header/SignIn/SignIn';

fetch('https://api.realworld.io/api/articles', {
  headers: {
    Accept: 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem('articlesLength', JSON.stringify(data.articlesCount));
  });
const App = () => {
  const [flag, setFlag] = useState(false);
  const [currentName, setCurrentName] = useState(JSON.parse(localStorage.getItem('username')));
  const [currentArticle, setCurrentArticle] = useState();
  // const navigate = useNavigate();
  useEffect(() => {
    setCurrentName(JSON.parse(localStorage.getItem('username')));
  });
  useEffect(() => {
    setFlag(JSON.parse(localStorage.getItem('auth')));
  }, []);
  function gettingCurrentArticle(e) {
    localStorage.setItem('currentArticle', JSON.stringify(e));
    if (localStorage.getItem('auth') && JSON.parse(localStorage.getItem('auth')) === true) {
      fetch(`https://api.realworld.io/api/articles/${e}`, {
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCurrentArticle(data.article));
    } else {
      fetch(`https://api.realworld.io/api/articles/${e}`)
        .then((res) => res.json())
        .then((data) => setCurrentArticle(data.article));
    }
    return currentArticle;
  }
  function editFlagFalse() {
    localStorage.setItem('auth', JSON.stringify(false));
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('image');
    localStorage.removeItem('user');
    setFlag(false);
  }

  function editFlagTrue() {
    localStorage.setItem('auth', JSON.stringify(true));
    setFlag(true);
  }

  function editName(value) {
    setCurrentName(value);
  }

  function deleteCurrentArticle() {
    setCurrentArticle();
  }

  return (
    <div className="App">
      <Header editFlagFalse={editFlagFalse} currentName={currentName} flag={flag} />
      <Routes>
        <Route
          path="/"
          exec
          element={
            <ArticlesList
              gettingCurrentArticle={gettingCurrentArticle}
              deleteCurrentArticle={deleteCurrentArticle}
              flag={flag}
            />
          }
        />
        <Route
          path="/articles"
          exec
          element={
            <ArticlesList
              gettingCurrentArticle={gettingCurrentArticle}
              deleteCurrentArticle={deleteCurrentArticle}
              flag={flag}
            />
          }
        />
        <Route path="/sign-up" element={<SignUp editFlagTrue={editFlagTrue} />} />
        <Route path="/sign-in" element={<SignIn editFlagTrue={editFlagTrue} />} />
        <Route path="/articles/:id" element={<CurrentArticle currentArticle={currentArticle} />} />
        <Route
          path="/articles/new-article"
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
        <Route path="/articles/profile" element={<EditProfile editName={editName} />} />
      </Routes>
    </div>
  );
};

export default App;
