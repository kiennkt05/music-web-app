import { faBorderStyle } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";

const Nav = ({
  setLibraryStatus,
  libraryStatus,
  showLibraryIcon,
  setShowLibraryIcon,
  selectedFolder,
  getData,
  setSongs,
  setIsLoading,
  showSelector,
  setShowSelector,
}) => {
  useEffect(() => {
    getData(selectedFolder, setSongs, setIsLoading);
  }, [selectedFolder]);

  return (
    <nav>
      <button
        onClick={() => {
          setShowSelector(!showSelector);
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
      <h1 style={{ paddingLeft: "" }}>🎧 Music Player 🎧</h1>
      <button>
        <img
          className="library-icon"
          src={`${process.env.PUBLIC_URL}/library.png`}
          alt="Library"
          style={{
            opacity: "0%",
          }}
        />
      </button>
    </nav>
  );
};

export default Nav;
