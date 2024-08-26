import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import classes from './NewArticle.module.scss';
import Tag from './Tag/Tag';
const NewArticle = ({ gettingCurrentArticle, flagForForm }) => {
  const [arrTags, setArrTags] = useState([]);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      body: '',
      tagList: arrTags,
    },
  });
  useEffect(() => {
    if (!flagForForm) {
      setValue('title', JSON.parse(localStorage.getItem('article')).title);
      setValue('description', JSON.parse(localStorage.getItem('article')).description);
      setValue('body', JSON.parse(localStorage.getItem('article')).body);
      setValue('tagList', JSON.parse(localStorage.getItem('article')).tagList);
      setArrTags(JSON.parse(localStorage.getItem('article')).tagList);
    } else {
      setValue('title', '');
      setValue('description', '');
      setValue('body', '');
      setValue('tagList', arrTags);
      setArrTags([]);
    }
  }, []);
  const submitForm = (data) => {
    if (!flagForForm) {
      fetch(`https://api.realworld.io/api/articles/${JSON.parse(localStorage.getItem('article')).slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
        },
        body: JSON.stringify({ article: data }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            localStorage.setItem('article', JSON.stringify(data.article));
            gettingCurrentArticle(data.article.slug);
            setTimeout(() => {
              navigate(`/articles/${data.article.slug}`);
            }, 150);
          }
        });
    } else {
      fetch('https://api.realworld.io/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
        },
        body: JSON.stringify({ article: data }),
      })
        .then((res) => {
          if (res.status === 422) {
            if (!document.querySelector('span')) {
              document
                .querySelector('form')
                .insertBefore(createWarnElem('Title must be unique'), document.querySelector('form').lastChild);
            }
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            localStorage.setItem('article', JSON.stringify(data.article));
            gettingCurrentArticle(data.article.slug);
            setTimeout(() => {
              navigate(`/articles/${data.article.slug}`);
            }, 150);
          }
        });
    }
  };
  const addingTag = (e) => {
    const inp = e.target.closest('div').querySelectorAll('input[type="text"]')[
      e.target.closest('div').querySelectorAll('input[type="text"]').length - 1
    ];
    if (inp.value.trim().length !== 0) {
      setCount(count + 1);
      setArrTags((prevTags) => {
        const update = [...prevTags, inp.value.trim()];
        setValue('tagList', update);
        return update;
      });
      e.target.closest('div').querySelectorAll('input[type="text"]').value = '';
      e.target.style.display = 'none';
    }
  };
  const deletedTag = (e) => {
    setArrTags((prev) => {
      const update = prev.filter((tag) => tag !== e.target.closest('div').id);
      return update;
    });
  };
  useEffect(() => {
    setValue('tagList', arrTags);
  }, [arrTags, setValue]);
  function createWarnElem(text) {
    const warn = document.createElement('span');
    warn.className = classes.title__warning;
    warn.textContent = text;
    return warn;
  }
  return (
    <div className={classes.new__main}>
      <div className={classes.new__container}>
        <h3 className={classes.new__title}>{flagForForm ? 'Create new article' : 'Edit article'}</h3>
        <form className={classes.new__form}>
          <label className={classes.new__label}>
            Title
            <input
              className={classes.new__input}
              type="text"
              placeholder="Title"
              {...register('title', { required: true })}
            ></input>
          </label>
          <label className={classes.new__label}>
            Short description
            <input
              className={classes.new__input}
              type="text"
              placeholder="Description"
              {...register('description', { required: true })}
            ></input>
          </label>
          <label className={classes.new__label}>
            Text
            <textarea
              className={classes.new__textarea}
              placeholder="Text"
              {...register('body', { required: true })}
            ></textarea>
          </label>
          <div className={classes.new__tags_container}>
            Tags
            {arrTags.map((e) => (
              <Tag addingTag={addingTag} deletedTag={deletedTag} key={uuidv4()} id={e} val={e} constant={false} />
            ))}
            <Tag addingTag={addingTag} deletedTag={deletedTag} key={uuidv4()} constant={true} />
          </div>
          <Button type="primary" className={classes.new__button} onClick={handleSubmit(submitForm)}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewArticle;
