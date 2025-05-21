// Main application JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  console.log("App initialized")

  // Set up event listeners for the player
  setupPlayerEventListeners()
})

// Import API functions
import { getAllTracks } from "./api.js"

async function getTrendingTracks() {
  try {
    // Get all tracks from Supabase
    const tracks = await getAllTracks()
    // Return first 5 tracks as trending
    return tracks.slice(0, 5)
  } catch (error) {
    console.error("Error getting trending tracks:", error)
    return []
  }
}

async function getRecommendedTracks() {
  try {
    // Get all tracks from Supabase
    const tracks = await getAllTracks()
    // Shuffle and return 5 tracks as recommended
    return shuffleArray(tracks).slice(0, 5)
  } catch (error) {
    console.error("Error getting recommended tracks:", error)
    return []
  }
}

function playTrack(track) {
  // Update the audio player
  const audioPlayer = document.getElementById("audio-player")
  if (audioPlayer) {
    audioPlayer.src = track.audio_url
    audioPlayer.play()
  }

  // Update the player UI
  const currentTrackImage = document.getElementById("current-track-image")
  const currentTrackTitle = document.getElementById("current-track-title")
  const currentTrackArtist = document.getElementById("current-track-artist")

  if (currentTrackImage) currentTrackImage.src = track.cover_url || "images/placeholder.jpg"
  if (currentTrackTitle) currentTrackTitle.textContent = track.title
  if (currentTrackArtist) currentTrackArtist.textContent = track.artist.name

  // Update play button
  const playButton = document.getElementById("play-button")
  if (playButton) {
    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
  }
}

async function initApp() {
  // Load featured tracks
  loadFeaturedTracks()

  // Load recently played tracks
  loadRecentlyPlayed()

  // Load trending tracks
  loadTrendingTracks()

  // Load recommended tracks
  loadRecommendedTracks()
}

async function loadFeaturedTracks() {
  try {
    const featuredContainer = document.querySelector(".featured-grid")
    if (!featuredContainer) return

    // Get trending tracks from API
    const tracks = await getTrendingTracks()
    const featuredTracks = tracks.slice(0, 6)

    // Clear container
    featuredContainer.innerHTML = ""

    // Add tracks to container
    featuredTracks.forEach((track) => {
      const trackElement = createFeaturedTrackElement(track)
      featuredContainer.appendChild(trackElement)
    })
  } catch (error) {
    console.error("Error loading featured tracks:", error)
    showErrorMessage("Failed to load featured tracks")
  }
}

function createFeaturedTrackElement(track) {
  const trackElement = document.createElement("a")
  trackElement.href = `track.html?id=${track.id}`
  trackElement.className = "featured-item"

  trackElement.innerHTML = `
    <div class="featured-item-image">
      <img src="${track.cover_url || "images/placeholder.jpg"}" alt="${track.title}">
    </div>
    <div class="featured-item-title">${track.title}</div>
    <div class="featured-item-play">
      <i class="fa-solid fa-play"></i>
    </div>
  `

  // Add click event for play button
  const playButton = trackElement.querySelector(".featured-item-play")
  playButton.addEventListener("click", (event) => {
    event.preventDefault()
    playTrack(track)
  })

  return trackElement
}

async function loadRecentlyPlayed() {
  try {
    const container = document.getElementById("recently-played-tracks")
    if (!container) return

    // Get recently played tracks (using all tracks for now)
    const allTracks = await getAllTracks()
    const tracks = shuffleArray(allTracks).slice(0, 7)

    // Clear container
    container.innerHTML = ""

    // Add tracks to container
    tracks.forEach((track) => {
      const trackElement = createTrackElement(track)
      container.appendChild(trackElement)
    })
  } catch (error) {
    console.error("Error loading recently played tracks:", error)
  }
}

async function loadTrendingTracks() {
  try {
    const container = document.getElementById("trending-tracks")
    if (!container) return

    // Get trending tracks from API
    const tracks = await getTrendingTracks()

    // Clear container
    container.innerHTML = ""

    // Add tracks to container
    tracks.slice(0, 7).forEach((track) => {
      const trackElement = createTrackElement(track)
      container.appendChild(trackElement)
    })
  } catch (error) {
    console.error("Error loading trending tracks:", error)
  }
}

async function loadRecommendedTracks() {
  try {
    const container = document.getElementById("recommended-tracks")
    if (!container) return

    // Get recommended tracks from API
    const tracks = await getRecommendedTracks()

    // Clear container
    container.innerHTML = ""

    // Add tracks to container
    tracks.slice(0, 7).forEach((track) => {
      const trackElement = createTrackElement(track)
      container.appendChild(trackElement)
    })
  } catch (error) {
    console.error("Error loading recommended tracks:", error)
  }
}

function createTrackElement(track) {
  const trackElement = document.createElement("a")
  trackElement.href = `track.html?id=${track.id}`
  trackElement.className = "track-card"

  trackElement.innerHTML = `
    <div class="track-card-image">
      <img src="${track.cover_url || "images/placeholder.jpg"}" alt="${track.title}">
      <div class="track-card-play">
        <i class="fa-solid fa-play"></i>
      </div>
    </div>
    <div class="track-card-title">${track.title}</div>
    <div class="track-card-artist">${track.artist.name}</div>
  `

  // Add click event for play button
  const playButton = trackElement.querySelector(".track-card-play")
  playButton.addEventListener("click", (event) => {
    event.preventDefault()
    playTrack(track)
  })

  return trackElement
}

function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function showErrorMessage(message) {
  // Create error alert
  const alert = document.createElement("div")
  alert.className = "alert alert-error"
  alert.innerHTML = `
    <i class="fa-solid fa-circle-exclamation"></i>
    <div>${message}</div>
  `

  // Insert at the top of the main content
  const mainContent = document.querySelector(".main-content")
  if (mainContent) {
    mainContent.insertBefore(alert, mainContent.firstChild)

    // Remove after 5 seconds
    setTimeout(() => {
      alert.remove()
    }, 5000)
  }
}

function setupPlayerEventListeners() {
  const playButton = document.getElementById("play-button")
  const audioPlayer = document.getElementById("audio-player")

  if (playButton && audioPlayer) {
    playButton.addEventListener("click", () => {
      if (audioPlayer.paused) {
        if (audioPlayer.src) {
          audioPlayer.play()
          playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
        } else {
          console.log("No track selected")
        }
      } else {
        audioPlayer.pause()
        playButton.innerHTML = '<i class="fa-solid fa-play"></i>'
      }
    })
  }

  // Add event listeners for featured tracks
  const featuredPlayButtons = document.querySelectorAll(".featured-item-play")
  featuredPlayButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const trackTitle = e.target.closest(".featured-item").querySelector(".featured-item-title").textContent
      console.log(`Playing featured track: ${trackTitle}`)

      // Update player UI
      document.getElementById("current-track-title").textContent = trackTitle
      document.getElementById("current-track-artist").textContent = "Artist Name"

      // In a real app, you would set the audio source and play it
      // For now, just update the UI
      playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
    })
  })

  // Add event listeners for track cards
  const trackPlayButtons = document.querySelectorAll(".track-card-play")
  trackPlayButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const trackCard = e.target.closest(".track-card")
      const trackTitle = trackCard.querySelector(".track-card-title").textContent
      const artistName = trackCard.querySelector(".track-card-artist").textContent
      console.log(`Playing track: ${trackTitle} by ${artistName}`)

      // Update player UI
      document.getElementById("current-track-title").textContent = trackTitle
      document.getElementById("current-track-artist").textContent = artistName

      // In a real app, you would set the audio source and play it
      // For now, just update the UI
      playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
    })
  })
}
