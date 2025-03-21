import React, { useEffect, useRef, useState } from "react";
import Player from "./components/PlayerSong";
import Song from "./components/Song";
import "./styles/app.css";

// Importing DATA
import Login from "./Login";
import Library from "./components/Library";
import Nav from "./components/Navb";
import getData from "./data";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Hooks for app functionality
  const defaultSong = {
    id: "0",
    name: "unknown",
    artist: "unknown",
    cover: "public/default.png",
    audio: "null",
  };

  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(defaultSong);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [showLibraryIcon, setShowLibraryIcon] = useState(true);
  const audioRef = useRef(null);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [showSelector, setShowSelector] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("songs"); // Default to "All Songs"
  const [showForm, setShowForm] = useState(false);
  const [newSong, setNewSong] = useState({
    name: "",
    artist: "",
    cover: "",
    audio: "",
  });

  // Fetch songs when the app loads
  useEffect(() => {
    async function fetchSongs() {
      setIsLoading(true); // Set loading state
      await getData(selectedFolder, setSongs, setIsLoading); // Fetch songs and update state
    }

    fetchSongs();
  }, []);

  // Fetch songs when the selected folder or library status changes
  useEffect(() => {
    async function fetchSongs() {
      setIsLoading(true);
      await getData(selectedFolder, setSongs, setIsLoading); // Fetch songs from the selected folder
    }

    if (libraryStatus) {
      fetchSongs();
    }
  }, [selectedFolder, libraryStatus]);

  // Ensure currentSong is set after songs are loaded
  useEffect(() => {
    if (songs.length > 0 && currentSong.id === "0") {
      setCurrentSong(songs[0]); // Set the first song as the current song only if no song is selected
    }
  }, [songs, currentSong]);

  // Function to update song progress
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;

    // Calculate animation percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);

    setSongInfo({
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };

  // Function to handle the end of a song and play the next one
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

    // Set the next song as the current song
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);

    // Play the next song if the player is active
    if (isPlaying) {
      audioRef.current.onloadeddata = () => {
        audioRef.current.play();
      };
    }
  };

  // Conditionally render the login page or the app
  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div>
      {/* Navigation bar */}
      <Nav
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
        showLibraryIcon={showLibraryIcon}
        setShowLibraryIcon={setShowLibraryIcon}
        selectedFolder={selectedFolder}
        getData={getData}
        setSongs={setSongs}
        setIsLoading={setIsLoading}
        showSelector={showSelector}
        setShowSelector={setShowSelector}
      />

      <div style={{ position: "relative" }}>
        {/* Folder Selector */}
        {showSelector && (
          <div className="folder-selector">
            <button
              className={selectedFolder === "songs" ? "active" : ""}
              onClick={() => {
                setSelectedFolder("songs");
                setShowSelector(false);
                setLibraryStatus(true);
                setShowLibraryIcon(false);
              }}
            >
              All Songs
            </button>
            <button
              className={selectedFolder === "favorites" ? "active" : ""}
              onClick={() => {
                setSelectedFolder("favorites");
                setShowSelector(false);
                setLibraryStatus(true);
                setShowLibraryIcon(false);
              }}
            >
              Favorites
            </button>
          </div>
        )}

        {/* Display the currently playing song */}
        {currentSong && <Song currentSong={currentSong} />}
      </div>
      {/* Player controls */}
      <Player
        id={songs.id}
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
        defaultSong={defaultSong}
      />

      {/* Library */}
      <div className={`library ${libraryStatus ? "active" : ""}`}>
        <Library
          songs={songs}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          audioRef={audioRef}
          isPlaying={isPlaying}
          setSongs={setSongs}
          setLibraryStatus={setLibraryStatus}
          libraryStatus={libraryStatus}
          newSong={newSong}
          setShowForm={setShowForm}
          setNewSong={setNewSong}
          showForm={showForm}
          showLibraryIcon={showLibraryIcon}
          setShowLibraryIcon={setShowLibraryIcon}
          selectedFolder={selectedFolder}
        />
      </div>

      {/* Audio element to play songs */}
      {currentSong && (
        <audio
          onLoadedMetadata={timeUpdateHandler}
          onTimeUpdate={timeUpdateHandler}
          src={currentSong.audio}
          ref={audioRef}
          onEnded={songEndHandler}
        ></audio>
      )}
    </div>
  );
}

export default App;
