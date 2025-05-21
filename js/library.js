// Library page functionality

// Import the API functions
import {
  getUserPlaylists,
  getPlaylistTracks,
  getUserFavorites,
  getUserHistory,
  createPlaylist,
  getCurrentUser,
  getTrackById,
  removeFromFavorites,
  addToHistory,
} from "./api.js"

// Global variables
let currentUser = null
let currentTrack = null
let playlist = []
let currentIndex = 0
let isPlaying = false
const audioPlayer = new Audio()

// DOM elements
const userPlaylistsContainer = document.getElementById("user-playlists")
const favoritesListContainer = document.getElementById("favorites-list")
const historyListContainer = document.getElementById("history-list")
const tabButtons = document.querySelectorAll(".tab-button")
const tabContents = document.querySelectorAll(".tab-content")
const createPlaylistButton = document.getElementById("create-playlist-button")

document.addEventListener("DOMContentLoaded", () => {
  initLibrary()
})

// Mock data (replace with actual data fetching)
const playlists = [
  { id: 1, name: "My Playlist 1", creator: "User1", cover: "images/playlist1.jpg" },
  { id: 2, name: "Chill Vibes", creator: "User2", cover: "images/playlist2.jpg" },
  { id: 3, name: "Workout Mix", creator: "User1", cover: "images/playlist3.jpg" },
]

const artists = [
  { id: 1, name: "Artist 1", image: "images/artist1.jpg" },
  { id: 2, name: "Artist 2", image: "images/artist2.jpg" },
  { id: 3, name: "Artist 3", image: "images/artist3.jpg" },
]

const albums = [
  { id: 1, name: "Album 1", artist: "Artist 1", cover: "images/album1.jpg" },
  { id: 2, name: "Album 2", artist: "Artist 2", cover: "images/album2.jpg" },
  { id: 3, name: "Album 3", artist: "Artist 3", cover: "images/album3.jpg" },
]

// Initialize the application
async function initLibrary() {
  // Try to get the current user
  currentUser = await getCurrentUser()

  if (!currentUser) {
    // If not logged in, show login message
    document.querySelector(".content").innerHTML = `
      <div class="login-message">
        <h2>Please log in to view your library</h2>
        <button id="login-redirect">Log In</button>
      </div>
    `

    document.getElementById("login-redirect").addEventListener("click", () => {
      // Redirect to login page or show login modal
      alert("Login functionality will be implemented soon")
    })

    return
  }

  // Load user playlists
  const playlists = await getUserPlaylists(currentUser.id)
  renderUserPlaylists(playlists)

  // Load favorites
  const favorites = await getUserFavorites(currentUser.id)
  renderTracks(favorites, favoritesListContainer)

  // Load history
  const history = await getUserHistory(currentUser.id)
  renderTracks(history, historyListContainer)

  // Set up event listeners
  setupEventListeners()
}

// Render user playlists
function renderUserPlaylists(playlists) {
  userPlaylistsContainer.innerHTML = ""

  playlists.forEach((playlist) => {
    const playlistElement = document.createElement("div")
    playlistElement.className = "playlist-card"
    playlistElement.dataset.id = playlist.id

    playlistElement.innerHTML = `
      <div class="playlist-cover">
        <img src="${playlist.cover_url || "/images/default-playlist.jpg"}" alt="${playlist.name}">
        <button class="play-playlist-button"><i class="fas fa-play"></i></button>
      </div>
      <h3 class="playlist-title">${playlist.name}</h3>
    `

    userPlaylistsContainer.appendChild(playlistElement)
  })
}

// Render tracks in a container
function renderTracks(tracks, container) {
  container.innerHTML = ""

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
        <button class="remove-button"><i class="fas fa-times"></i></button>
      </div>
    `

    container.appendChild(trackElement)
  })
}

// Set up event listeners
function setupEventListeners() {
  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and hide all content
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.add("hidden"))

      // Add active class to clicked button and show corresponding content
      button.classList.add("active")
      const tabId = button.dataset.tab
      document.getElementById(`${tabId}-tab`).classList.remove("hidden")
    })
  })

  // Create playlist button
  createPlaylistButton.addEventListener("click", () => {
    const playlistName = prompt("Enter playlist name:")
    if (playlistName) {
      createPlaylist(currentUser.id, playlistName).then((newPlaylist) => {
        if (newPlaylist) {
          // Add the new playlist to the UI
          const playlistElement = document.createElement("div")
          playlistElement.className = "playlist-card"
          playlistElement.dataset.id = newPlaylist.id

          playlistElement.innerHTML = `
            <div class="playlist-cover">
              <img src="/images/default-playlist.jpg" alt="${newPlaylist.name}">
              <button class="play-playlist-button"><i class="fas fa-play"></i></button>
            </div>
            <h3 class="playlist-title">${newPlaylist.name}</h3>
          `

          userPlaylistsContainer.appendChild(playlistElement)
        }
      })
    }
  })

  // Playlist click event
  userPlaylistsContainer.addEventListener("click", async (e) => {
    const playlistCard = e.target.closest(".playlist-card")
    if (!playlistCard) return

    const playlistId = playlistCard.dataset.id

    // Play button clicked
    if (e.target.closest(".play-playlist-button")) {
      const tracks = await getPlaylistTracks(playlistId)
      if (tracks.length > 0) {
        // Update the global playlist
        playlist = tracks
        currentIndex = 0

        // Play the first track
        playTrack(tracks[0])
      }
    } else {
      // Navigate to playlist detail page
      window.location.href = `playlist.html?id=${playlistId}`
    }
  })

  // Favorites list click event
  favoritesListContainer.addEventListener("click", handleTrackClick)

  // History list click event
  historyListContainer.addEventListener("click", handleTrackClick)

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

// Handle track click events
async function handleTrackClick(e) {
  const trackItem = e.target.closest(".track-item")
  if (!trackItem) return

  const trackId = trackItem.dataset.id

  // Play button clicked
  if (e.target.closest(".play-button")) {
    const container = trackItem.closest(".track-list")
    const allTracks = Array.from(container.querySelectorAll(".track-item"))

    // Create a playlist from all tracks in the container
    playlist = allTracks.map((item) => ({
      id: item.dataset.id,
      title: item.querySelector(".track-title").textContent,
      artist: { name: item.querySelector(".track-artist").textContent },
      cover_url: item.querySelector("img").src,
      // We'll need to fetch the full track data when playing
    }))

    currentIndex = allTracks.indexOf(trackItem)

    // Get the full track data and play it
    const track = await getTrackById(trackId)
    if (track) {
      playTrack(track)
    }
  }

  // Remove button clicked
  if (e.target.closest(".remove-button")) {
    const container = trackItem.closest(".track-list")

    if (container.id === "favorites-list") {
      removeFromFavorites(currentUser.id, trackId).then((success) => {
        if (success) {
          trackItem.remove()
        }
      })
    }
  }
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

function initTabs() {
  const tabs = document.querySelectorAll(".tab")

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Get tab content id
      const tabId = this.getAttribute("data-tab")

      // Hide all tab panes
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("active")
      })

      // Show selected tab pane
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })
}

function loadPlaylists() {
  const container = document.getElementById("playlists-grid")
  if (!container) return

  // Clear container
  container.innerHTML = ""

  // Add playlists to container
  playlists.forEach((playlist) => {
    const playlistElement = createPlaylistElement(playlist)
    container.appendChild(playlistElement)
  })
}

function loadArtists() {
  const container = document.getElementById("artists-grid")
  if (!container) return

  // Clear container
  container.innerHTML = ""

  // Add artists to container
  artists.forEach((artist) => {
    const artistElement = createArtistElement(artist)
    container.appendChild(artistElement)
  })
}

function loadAlbums() {
  const container = document.getElementById("albums-grid")
  if (!container) return

  // Clear container
  container.innerHTML = ""

  // Add albums to container
  albums.forEach((album) => {
    const albumElement = createAlbumElement(album)
    container.appendChild(albumElement)
  })
}

function createPlaylistElement(playlist) {
  const playlistElement = document.createElement("a")
  playlistElement.href = `playlist.html?id=${playlist.id}`
  playlistElement.className = "track-card"

  playlistElement.innerHTML = `
    <div class="track-card-image">
      <img src="${playlist.cover || "images/placeholder.jpg"}" alt="${playlist.name}">
      <div class="track-card-play">
        <i class="fa-solid fa-play"></i>
      </div>
    </div>
    <div class="track-card-title">${playlist.name}</div>
    <div class="track-card-artist">By ${playlist.creator}</div>
  `

  return playlistElement
}

function createArtistElement(artist) {
  const artistElement = document.createElement("a")
  artistElement.href = `artist.html?id=${artist.id}`
  artistElement.className = "artist-card"

  artistElement.innerHTML = `
    <div class="artist-image">
      <img src="${artist.image || "images/placeholder.jpg"}" alt="${artist.name}">
    </div>
    <div class="artist-name">${artist.name}</div>
    <div class="artist-type">Artist</div>
  `

  return artistElement
}

function createAlbumElement(album) {
  const albumElement = document.createElement("a")
  albumElement.href = `album.html?id=${album.id}`
  albumElement.className = "album-card"

  albumElement.innerHTML = `
    <div class="album-image">
      <img src="${album.cover || "images/placeholder.jpg"}" alt="${album.name}">
      <div class="track-card-play">
        <i class="fa-solid fa-play"></i>
      </div>
    </div>
    <div class="album-name">${album.name}</div>
    <div class="album-artist">${album.artist}</div>
  `

  return albumElement
}

// Initialize the app when the DOM is loaded
