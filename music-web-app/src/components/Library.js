import React from "react";
import LibrarySong from "./LibrarySong";
// import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const Library = ({
  songs,
  setCurrentSong,
  audioRef,
  isPlaying,
  setSongs,
  setLibraryStatus,
  libraryStatus,
  newSong,
  setShowForm,
  setNewSong,
  showForm,
}) => {
  const handleAddSong = () => {
    const songToAdd = {
      ...newSong,
      id: Date.now(), // Unique ID for the new song
      active: false,
    };
    setSongs([...songs, songToAdd]); // Add the new song to the songs array
    setShowForm(false); // Hide the form after adding the song
    setNewSong({
      name: "",
      artist: "",
      audio: "",
      color: ["#000000", "#FFFFFF"],
    }); // Reset the form
  };

  return (
    <div className={`library ${libraryStatus ? "active" : ""}`}>
      <div className="library-header">
        <button
          className="back"
          onClick={() => {
            setLibraryStatus(!libraryStatus);
            setShowForm(false);
          }}
        >
          <img
            className="button-icon"
            src={`${process.env.PUBLIC_URL}/back.png`}
            alt="Back arrow"
            style={{ width: "2rem", height: "2rem" }}
          />
        </button>
        <h2 style={{ color: "white" }}>All songs</h2>
        <button className="add-song" onClick={() => setShowForm(true)}>
          <img
            className="button-icon"
            src={`${process.env.PUBLIC_URL}/add.png`}
            alt="Add song"
            style={{ width: "3rem", height: "3rem" }}
          />
        </button>
      </div>
      <div className="form-container">
        {showForm && (
          <AddSongForm
            newSong={newSong}
            setNewSong={setNewSong}
            setShowForm={setShowForm}
            handleAddSong={handleAddSong}
          />
        )}
      </div>
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

function AddSongForm({ newSong, setNewSong, setShowForm, handleAddSong }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const fileURL = URL.createObjectURL(file); // Create a temporary URL for the file
      setNewSong({ ...newSong, audio: fileURL }); // Update the newSong object with the file URL
    }
  };

  return (
    <div className="add-song-form">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
          handleAddSong(); // Call the add song handler
        }}
      >
        <input
          type="text"
          placeholder="Song name"
          value={newSong.name}
          onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Artist"
          value={newSong.artist}
          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
        />
        <input
          type="file"
          accept="audio/*" // Restrict file selection to audio files
          onChange={handleFileChange}
        />
        <button type="submit">Submit</button>
        <button
          type="button"
          onClick={() => setShowForm(false)} // Close the form
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Library;
