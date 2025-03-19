import { v4 as uuidv4 } from "uuid";
/**
 * Generates an array of music track objects, each containing details such as
 * name, cover image URL, artist, audio URL, color theme, unique ID, and active status.
 *
 * @function chillHop
 * @returns {Array<Object>} An array of music track objects.
 * @property {string} name - The name of the music track.
 * @property {string} cover - The URL of the cover image for the track.
 * @property {string} artist - The name of the artist for the track.
 * @property {string} audio - The URL of the audio file for the track.
 * @property {Array<string>} color - An array of two color codes representing the theme for the track.
 * @property {string} id - A unique identifier for the track.
 * @property {boolean} active - Indicates whether the track is currently active.
 */
function chillHop() {
  return [
    {
      name: "Sunrise Serenade",
      cover:
        "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6.png",
      artist: " Harmony Harp",
      audio:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004185212/Jawan-Prevue-Theme.mp3",
      color: ["#205950", "#2ab3bf"],
      id: uuidv4(),
      active: true,
    },
    {
      name: "Urban Groove",
      cover:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004210806/DemotivationalPosterfull936506.jpg",
      artist: "Beatmaster B",
      audio:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004184006/SoundHelix-Song-10.mp3",
      color: ["#EF8EA9", "#ab417f"],
      id: uuidv4(),
      active: false,
    },
    {
      name: "Mystic Echo",
      cover:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004210619/3408428b23c516b1687c748cb7de7be7.webp",
      artist: " Harmony Harp",
      audio:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004185212/Jawan-Prevue-Theme.mp3",
      color: ["#CD607D", "#c94043"],
      id: uuidv4(),
      active: false,
    },
    {
      name: "Electro Vibes",
      cover:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004184219/gfglogo0.jpg",
      artist: "Synthwave Sensation",
      audio:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004191840/Zinda-Banda---Jawan-(1).mp3",
      color: ["#EF8EA9", "#ab417f"],
      id: uuidv4(),
      active: false,
    },
    {
      name: "Jazzy Whispers",
      cover:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004210806/DemotivationalPosterfull936506.jpg",
      artist: "Smooth Sax Serenade",
      audio:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004184006/SoundHelix-Song-10.mp3",
      color: ["#CD607D", "#c94043"],
      id: uuidv4(),
      active: false,
    },
    {
      name: "Tropical Breez",
      cover:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004210619/3408428b23c516b1687c748cb7de7be7.webp",
      artist: "Island Rhythms",
      audio:
        "https://media.geeksforgeeks.org/wp-content/uploads/20231004191840/Zinda-Banda---Jawan-(1).mp3",
      color: ["#205950", "#2ab3bf"],
      id: uuidv4(),
      active: false,
    },
  ];
}

export default chillHop;
