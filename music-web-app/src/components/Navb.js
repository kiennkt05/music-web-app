import React from "react";

const Nav = ({ setLibraryStatus, libraryStatus }) => {
  return (
    <nav>
      <button
        onClick={() => {
          setLibraryStatus(!libraryStatus);
        }}
      >
        <img
          className="library-icon"
          src={`${process.env.PUBLIC_URL}/library.png`}
          alt="Library"
          style={{ filter: "invert(1)" }}
        />
      </button>
      <h1>Music Player</h1>
      <div className="account">
        <button
          onClick={() => {
            alert("Sign up for free!");
          }}
        >
          <h2>Sign Up</h2>
        </button>
        <button
          onClick={() => {
            alert("Log in to your account!");
          }}
        >
          <h2>Log In</h2>
        </button>
        <img
          src={`${process.env.PUBLIC_URL}/profile-user.png`}
          alt="Profile Picture"
        />
      </div>
    </nav>
  );
};

export default Nav;
