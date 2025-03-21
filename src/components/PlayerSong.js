import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import supabase from "../supabase";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  setSongInfo,
  songInfo,
  songs,
  setCurrentSong,
  id,
  setSongs,
  defaultSong,
}) => {
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
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
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      try {
        audioRef.current.play();
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error playing the audio:", error);
      }
    }
  };

  const getTime = (time) =>
    Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);

  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

    if (direction === "skip-forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }

    if (direction === "skip-back") {
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);
        audioRef.current.load();
        if (isPlaying) audioRef.current.play();
        return;
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
    }

    audioRef.current.load();
    if (isPlaying) audioRef.current.play();
  };

  const removeSongHandler = async () => {
    // Ask for confirmation before removing the song
    if (!window.confirm("Are you sure you want to remove this song?")) {
      return;
    }

    // Filter out the song with the current ID
    const updatedSongs = songs.filter((song) => song.id !== currentSong.id);
    setSongs(updatedSongs);

    // Update the database with the new songs list
    try {
      const { data, error } = await supabase
        .from("songs") // Replace "songs" with your table name
        .delete()
        .eq("id", currentSong.id); // Delete the song with the matching ID

      if (error) {
        console.error("Error removing song from database:", error);
        alert("Failed to remove the song from the database.");
        return;
      }

      console.log("Song removed from database:", data);

      // Handle the case where the currently playing song is deleted
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      const nextSong =
        updatedSongs[currentIndex % updatedSongs.length] || updatedSongs[0];

      if (nextSong) {
        setCurrentSong(nextSong); // Set the next song as the current song
        audioRef.current.load(); // Load the next song

        // Wait for the audio element to be ready before playing
        audioRef.current.oncanplaythrough = () => {
          if (isPlaying) audioRef.current.play();
        };
      } else {
        // If no songs are left, stop playback
        setCurrentSong(defaultSong);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error updating songs in the database:", error);
      alert("An error occurred while updating the songs in the database.");
    }
  };

  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  return (
    <div className="player">
      <div>
        <button
          className="remove-song"
          style={{
            background: "transparent",
            border: "none",
            padding: "1rem 0rem",
            cursor: "pointer",
          }}
          onClick={removeSongHandler}
        >
          <img
            src={`${process.env.PUBLIC_URL}/remove.png`}
            alt="Remove song"
            style={{
              width: "2.5rem",
              height: "2.5rem",
            }}
          />
        </button>
      </div>
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div className="track">
          <input
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
            type="range"
          />
          <div style={trackAnim} className="animate-track"></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : "00:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-back")}
          size="2x"
          className="skip-back"
          icon={faAngleLeft}
        />
        {!isPlaying ? (
          <FontAwesomeIcon
            onClick={playSongHandler}
            size="2x"
            className="play"
            icon={faPlay}
          />
        ) : (
          <FontAwesomeIcon
            onClick={playSongHandler}
            size="2x"
            className="pause"
            icon={faPause}
          />
        )}
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-forward")}
          size="2x"
          className="skip-forward"
          icon={faAngleRight}
        />
      </div>
    </div>
  );
};

export default Player;
