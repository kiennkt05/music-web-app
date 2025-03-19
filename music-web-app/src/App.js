import { useRef, useState } from "react";
import Player from "./components/PlayerSong";
import Song from "./components/Song";
import "./styles/app.css";

// Importing DATA
import data from "./data";
import Library from "./components/Library";
import Nav from "./components/Navb";

function App() {
  // State to manage the list of songs
  const [songs, setSongs] = useState(data());

  // State to manage the currently playing song
  const [currentSong, setCurrentSong] = useState(songs[0]);

  // State to track whether the song is playing
  const [isPlaying, setIsPlaying] = useState(false);

  // State to toggle the library visibility
  const [libraryStatus, setLibraryStatus] = useState(false);

  // Reference to the audio element
  const audioRef = useRef(null);

  // State to track song progress and animation
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

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
    color: ["#000000", "#FFFFFF"], // Default colors
  }); // State to store the new song data

  return (
    <div>
      {/* Navigation bar to toggle the library */}
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />

      {/* Display the currently playing song */}
      <Song currentSong={currentSong} />

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
        setCurrentSong={setCurrentSong}
        newSong={newSong}
        setShowForm={setShowForm}
        setNewSong={setNewSong}
        showForm={showForm}
      />

      {/* Audio element to play songs */}
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        src={currentSong.audio}
        ref={audioRef}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
