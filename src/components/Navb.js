import { faBorderStyle } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Nav = ({
  setLibraryStatus,
  libraryStatus,
  showLibraryIcon,
  setShowLibraryIcon,
}) => {
  return (
    <nav>
      <button
        onClick={() => {
          setLibraryStatus(!libraryStatus);
          setShowLibraryIcon(!showLibraryIcon);
        }}
      >
        <img
          className="library-icon"
          src={`${process.env.PUBLIC_URL}/library.png`}
          alt="Library"
          style={{
            filter: "invert(1)",
            opacity: showLibraryIcon ? "100%" : "0%",
          }}
        />
      </button>
      <h1 style={{}}>🎧 Music Player 🎧</h1>
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
          style={{ filter: "invert(1)" }}
        />
      </div>
    </nav>
  );
};

export default Nav;
