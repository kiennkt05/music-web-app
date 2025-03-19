import React from "react";
import LibrarySong from "./LibrarySong";

const Library = ({
  songs,
  setCurrentSong,
  audioRef,
  isPlaying,
  setSongs,
  setLibraryStatus,
  libraryStatus,
}) => {
  return (
    <div className={`library ${libraryStatus ? "active" : ""}`}>
      {/* Header for the library */}
      <h2 style={{ color: "white" }}>All songs</h2>

      {/* List of all songs */}
      <div className="library-songs">
        {songs.map((song) => (
          <LibrarySong
            setSongs={setSongs}
            isPlaying={isPlaying}
            audioRef={audioRef}
            songs={songs}
            song={song}
            setCurrentSong={setCurrentSong}
            id={song.id}
            key={song.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
