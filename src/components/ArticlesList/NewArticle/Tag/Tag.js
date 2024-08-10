import React, { useState } from 'react';

import classes from './Tag.module.scss';

const Tag = ({ addingTag, deletedTag, id, val, constant }) => {
  const [classAdd, setClassAdd] = useState(classes.add);
  const addedTag = (e) => {
    addingTag(e);
    setClassAdd(`${classes.add__none}`);
    e.target.classList = classes.add__none;
  };
  return (
    <div className={classes.tag__container} id={id}>
      <input className={classes.tag} type="text" placeholder="Tag" defaultValue={val}></input>
      <button className={classes.delete} type="button" onClick={(e) => deletedTag(e)}>
        Delete
      </button>
      {constant ? (
        <button className={classAdd} type="button" onClick={(e) => addedTag(e)}>
          Add tag
        </button>
      ) : null}
    </div>
  );
};

export default Tag;
