import React from "react";
import LibrarySong from "./LibrarySong";
import supabase from "../supabase"; // Import Supabase client
import { v4 as uuidv4 } from "uuid"; // For generating unique file names
// import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const defaultCoverPath =
  "https://mtwoqmnswxvrvpoxbcgw.supabase.co/storage/v1/object/public/uploads/covers/";
const defaultAudioPath =
  "https://mtwoqmnswxvrvpoxbcgw.supabase.co/storage/v1/object/public/uploads/songs/";

const Library = ({
  songs,
  currentSong,
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
  showLibraryIcon,
  setShowLibraryIcon,
}) => {
  const handleAddSong = () => {
    const songToAdd = {
      ...newSong,
      id: uuidv4(), // Unique ID for the new song
      active: false,
    };
    setSongs([...songs, songToAdd]); // Add the new song to the songs array
    setShowForm(false); // Hide the form after adding the song
    setNewSong({
      name: "",
      artist: "",
      audio: "",
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
            setShowLibraryIcon(!showLibraryIcon);
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
            key={song.id}
            setSongs={setSongs}
            isPlaying={isPlaying}
            audioRef={audioRef}
            songs={songs}
            song={song}
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            id={song.id}
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
      if (e.target.accept.includes("audio")) {
        setNewSong({ ...newSong, audioFile: file }); // Store the audio file
      } else if (e.target.accept.includes("image")) {
        setNewSong({ ...newSong, coverFile: file }); // Store the cover file
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Upload the audio file to Supabase Storage
      const songUUID = uuidv4();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(`songs/${songUUID}`, newSong.audioFile);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        alert("Failed to upload file.");
        return;
      } else {
        newSong.audio = defaultAudioPath + `${songUUID}`;
      }

      // Upload the cover image to Supabase Storage if cover is provided
      if (newSong.coverFile) {
        const { data: coverData, error: coverError } = await supabase.storage
          .from("uploads")
          .upload(`covers/${songUUID}`, newSong.coverFile);

        if (coverError) {
          console.error("Error uploading cover:", coverError);
          alert("Failed to upload cover.");
          return;
        } else {
          newSong.cover = defaultCoverPath + `${songUUID}`;
        }
      } else {
        newSong.cover = defaultCoverPath + "default.png";
        console.log("No cover file provided.");
      }
      // Update the newSong object with the file URL
      const updatedSong = { ...newSong };

      // Insert the new song into the database
      const { data: dbData, error: dbError } = await supabase
        .from("songs") // Replace with your database table name
        .insert([
          {
            name: updatedSong.name,
            artist: updatedSong.artist,
            cover: updatedSong.cover,
            audio: updatedSong.audio,
          },
        ]);

      if (dbError) {
        console.error("Error adding song to database:", dbError);
        alert("Failed to add song to the database.");
        return;
      }

      console.log("Database insert response:", dbData);

      // Add the song to the list
      handleAddSong();
    } catch (error) {
      console.error("Error uploading file or adding song:", error);
      alert("An error occurred while uploading the file or adding the song.");
    }
  };

  return (
    <div className="add-song-form">
      <form onSubmit={handleSubmit}>
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
        <div>
          <label htmlFor="cover-upload" style={{ fontSize: "0.8rem" }}>
            Upload Cover Image:
          </label>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="audio-upload" style={{ fontSize: "0.8rem" }}>
            Upload Audio File:
          </label>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          disabled={!newSong.name || !newSong.artist || !newSong.audioFile} // Disable if any field is empty
          onClick={handleSubmit}
        >
          Submit
        </button>
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
