// Import the API functions
import {
  getAllTracks,
  getTrackById,
  searchTracks,
  getUserPlaylists,
  getPlaylistTracks,
  addToFavorites,
  removeFromFavorites,
  isTrackFavorite,
  addToHistory,
  getCurrentUser,
} from "./api.js"

// Global variables
let currentUser = null
let currentTrack = null
let playlist = []
let currentIndex = 0
let isPlaying = false
const audioPlayer = new Audio()

// DOM elements
const trackListContainer = document.getElementById("track-list")
const playerContainer = document.getElementById("player")
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const playlistsContainer = document.getElementById("playlists")

// Initialize the application
async function initApp() {
  // Try to get the current user
  currentUser = await getCurrentUser()

  // Load initial tracks
  const tracks = await getAllTracks()
  renderTracks(tracks)

  // If user is logged in, load their playlists
  if (currentUser) {
    const playlists = await getUserPlaylists(currentUser.id)
    renderPlaylists(playlists)
  }

  // Set up event listeners
  setupEventListeners()
}

// Render tracks in the track list
function renderTracks(tracks) {
  trackListContainer.innerHTML = ""

  tracks.forEach((track) => {
    const trackElement = document.createElement("div")
    trackElement.className = "track-item"
    trackElement.dataset.id = track.id

    trackElement.innerHTML = `
      <img src="${track.cover_url || "/images/default-cover.jpg"}" alt="${track.title}" class="track-cover">
      <div class="track-info">
        <h3 class="track-title">${track.title}</h3>
        <p class="track-artist">${track.artist.name}</p>
      </div>
      <div class="track-actions">
        <button class="play-button"><i class="fas fa-play"></i></button>
        <button class="favorite-button"><i class="fas fa-heart"></i></button>
      </div>
    `

    trackListContainer.appendChild(trackElement)

    // Check if track is in favorites and update UI accordingly
    if (currentUser) {
      isTrackFavorite(currentUser.id, track.id).then((isFavorite) => {
        if (isFavorite) {
          const favoriteButton = trackElement.querySelector(".favorite-button i")
          favoriteButton.classList.add("active")
        }
      })
    }
  })
}

// Render playlists in the sidebar
function renderPlaylists(playlists) {
  playlistsContainer.innerHTML = ""

  playlists.forEach((playlist) => {
    const playlistElement = document.createElement("div")
    playlistElement.className = "playlist-item"
    playlistElement.dataset.id = playlist.id

    playlistElement.innerHTML = `
      <img src="${playlist.cover_url || "/images/default-playlist.jpg"}" alt="${playlist.name}" class="playlist-cover">
      <span class="playlist-name">${playlist.name}</span>
    `

    playlistsContainer.appendChild(playlistElement)
  })
}

// Set up event listeners
function setupEventListeners() {
  // Track list click event
  trackListContainer.addEventListener("click", async (e) => {
    const trackItem = e.target.closest(".track-item")
    if (!trackItem) return

    const trackId = trackItem.dataset.id

    // Play button clicked
    if (e.target.closest(".play-button")) {
      const track = await getTrackById(trackId)
      if (track) {
        playTrack(track)
      }
    }

    // Favorite button clicked
    if (e.target.closest(".favorite-button")) {
      if (!currentUser) {
        alert("Please log in to add favorites")
        return
      }

      const favoriteIcon = e.target.closest(".favorite-button").querySelector("i")
      const isFavorite = favoriteIcon.classList.contains("active")

      if (isFavorite) {
        removeFromFavorites(currentUser.id, trackId).then((success) => {
          if (success) {
            favoriteIcon.classList.remove("active")
          }
        })
      } else {
        addToFavorites(currentUser.id, trackId).then((success) => {
          if (success) {
            favoriteIcon.classList.add("active")
          }
        })
      }
    }
  })

  // Playlist click event
  playlistsContainer.addEventListener("click", async (e) => {
    const playlistItem = e.target.closest(".playlist-item")
    if (!playlistItem) return

    const playlistId = playlistItem.dataset.id
    const tracks = await getPlaylistTracks(playlistId)

    // Update the global playlist
    playlist = tracks

    // Render the tracks
    renderTracks(tracks)
  })

  // Search input event
  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim()
    if (query) {
      const results = await searchTracks(query)
      renderTracks(results)
    }
  })

  // Search input enter key
  searchInput.addEventListener("keyup", async (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim()
      if (query) {
        const results = await searchTracks(query)
        renderTracks(results)
      }
    }
  })

  // Player controls
  const playPauseButton = document.getElementById("play-pause")
  const prevButton = document.getElementById("prev-track")
  const nextButton = document.getElementById("next-track")
  const progressBar = document.getElementById("progress-bar")

  playPauseButton.addEventListener("click", togglePlayPause)
  prevButton.addEventListener("click", playPreviousTrack)
  nextButton.addEventListener("click", playNextTrack)

  // Audio player events
  audioPlayer.addEventListener("timeupdate", updateProgress)
  audioPlayer.addEventListener("ended", playNextTrack)

  // Progress bar click
  progressBar.addEventListener("click", (e) => {
    const progressBarWidth = progressBar.clientWidth
    const clickPosition = e.offsetX
    const percentage = clickPosition / progressBarWidth

    audioPlayer.currentTime = percentage * audioPlayer.duration
  })
}

// Play a track
async function playTrack(track) {
  // Update current track
  currentTrack = track

  // Update audio source
  audioPlayer.src = track.audio_url
  audioPlayer.load()

  // Play the track
  audioPlayer
    .play()
    .then(() => {
      isPlaying = true
      updatePlayerUI()

      // Add to history if user is logged in
      if (currentUser) {
        addToHistory(currentUser.id, track.id)
      }
    })
    .catch((error) => {
      console.error("Error playing track:", error)
    })
}

// Toggle play/pause
function togglePlayPause() {
  if (!currentTrack) return

  if (isPlaying) {
    audioPlayer.pause()
    isPlaying = false
  } else {
    audioPlayer.play()
    isPlaying = true
  }

  updatePlayerUI()
}

// Play previous track
function playPreviousTrack() {
  if (playlist.length === 0) return

  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length
  playTrack(playlist[currentIndex])
}

// Play next track
function playNextTrack() {
  if (playlist.length === 0) return

  currentIndex = (currentIndex + 1) % playlist.length
  playTrack(playlist[currentIndex])
}

// Update progress bar
function updateProgress() {
  const progressBar = document.getElementById("progress-bar")
  const currentTimeElement = document.getElementById("current-time")
  const totalTimeElement = document.getElementById("total-time")

  const currentTime = audioPlayer.currentTime
  const duration = audioPlayer.duration || 0

  // Update progress bar
  const progressPercentage = (currentTime / duration) * 100
  progressBar.value = progressPercentage

  // Update time displays
  currentTimeElement.textContent = formatTime(currentTime)
  totalTimeElement.textContent = formatTime(duration)
}

// Update player UI
function updatePlayerUI() {
  if (!currentTrack) return

  // Update track info
  const trackTitleElement = document.getElementById("track-title")
  const trackArtistElement = document.getElementById("track-artist")
  const trackCoverElement = document.getElementById("track-cover")
  const playPauseIcon = document.getElementById("play-pause").querySelector("i")

  trackTitleElement.textContent = currentTrack.title
  trackArtistElement.textContent = currentTrack.artist.name
  trackCoverElement.src = currentTrack.cover_url || "/images/default-cover.jpg"

  // Update play/pause button
  if (isPlaying) {
    playPauseIcon.classList.remove("fa-play")
    playPauseIcon.classList.add("fa-pause")
  } else {
    playPauseIcon.classList.remove("fa-pause")
    playPauseIcon.classList.add("fa-play")
  }
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)
