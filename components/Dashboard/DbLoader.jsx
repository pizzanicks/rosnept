import React from 'react';

const Loader = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-balls">
        <div className="spinner-ball first-ball" />
        <div className="spinner-ball second-ball" />
        <div className="spinner-ball third-ball" />
      </div>
    </div>
  );
};

export default Loader;
