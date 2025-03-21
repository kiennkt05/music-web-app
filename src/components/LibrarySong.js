import React from "react";
const LibrarySong = ({
  song,
  songs,
  setCurrentSong,
  audioRef,
  isPlaying,
  setSongs,
  id,
}) => {
  const songSelectHandler = async () => {
    // Set the current song
    await setCurrentSong(song);

    // Update the active state of songs
    const newSongs = songs.map((song) => {
      if (song.id === id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);

    // Check if the song is playing and handle playback
    if (isPlaying) {
      audioRef.current.pause(); // Pause the current song
      audioRef.current.load(); // Reload the audio element with the new song
      audioRef.current.play().catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error playing the song:", error);
        }
      });
    } else {
      // If not playing, ensure the audio is loaded
      audioRef.current.load();
    }
  };

  return (
    <div
      onClick={songSelectHandler}
      className={`library-song ${song.active ? "selected" : ""}`}
    >
      <img src={song.cover} alt={song.name} />
      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySong;
