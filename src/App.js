import React, { useEffect, useRef, useState } from "react";
import Player from "./components/PlayerSong";
import Song from "./components/Song";
import "./styles/app.css";

// Importing DATA
import Library from "./components/Library";
import Nav from "./components/Navb";
import getData from "./data";

function App() {
  // State to manage the list of songs
  const [songs, setSongs] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // State to manage the currently playing song
  const [currentSong, setCurrentSong] = useState({
    id: "-1",
    name: "unknown",
    artist: "unknown",
    cover: "public/default.png",
    audio: "null",
  });

  // State to track whether the song is playing
  const [isPlaying, setIsPlaying] = useState(false);

  // State to toggle the library visibility
  const [libraryStatus, setLibraryStatus] = useState(false);

  const [showLibraryIcon, setShowLibraryIcon] = useState(true);

  // Reference to the audio element
  const audioRef = useRef(null);

  // State to track song progress and animation
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  useEffect(() => {
    async function fetchSongs() {
      setIsLoading(true); // Set loading state
      await getData(setSongs, setIsLoading); // Fetch songs and update state
    }

    fetchSongs();
  }, []);

  // Ensure currentSong is set after songs are loaded
  useEffect(() => {
    if (songs.length > 0 && currentSong.id === "-1") {
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

  const [showForm, setShowForm] = useState(false); // State to toggle the form
  const [newSong, setNewSong] = useState({
    name: "",
    artist: "",
    audio: "",
  }); // State to store the new song data

  return (
    <div>
      {/* Navigation bar to toggle the library */}
      <Nav
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
        showLibraryIcon={showLibraryIcon}
        setShowLibraryIcon={setShowLibraryIcon}
      />

      {/* Display the currently playing song */}
      {currentSong && <Song currentSong={currentSong} />}

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
      />

      {/* Library to display all songs */}
      <Library
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
        setSongs={setSongs}
        isPlaying={isPlaying}
        audioRef={audioRef}
        songs={songs}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        newSong={newSong}
        setShowForm={setShowForm}
        setNewSong={setNewSong}
        showForm={showForm}
        showLibraryIcon={showLibraryIcon}
        setShowLibraryIcon={setShowLibraryIcon}
      />

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
