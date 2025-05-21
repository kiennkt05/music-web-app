// Search functionality

import { searchTracks } from "./api.js"

document.addEventListener("DOMContentLoaded", () => {
  initSearch()
})

let searchTimeout = null

function initSearch() {
  const searchInput = document.getElementById("search-input")
  if (!searchInput) return

  // Add event listener for search input
  searchInput.addEventListener("input", function () {
    const query = this.value.trim()

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // If query is empty, show browse all
    if (query === "") {
      showBrowseAll()
      return
    }

    // Set timeout for search to avoid too many requests
    searchTimeout = setTimeout(() => {
      performSearch(query)
    }, 500)
  })
}

function showBrowseAll() {
  document.getElementById("browse-all").classList.remove("hidden")
  document.getElementById("search-results-container").classList.add("hidden")
  document.getElementById("no-results").classList.add("hidden")
  document.getElementById("search-loading").classList.add("hidden")
}

async function performSearch(query) {
  // Show loading state
  document.getElementById("browse-all").classList.add("hidden")
  document.getElementById("search-results-container").classList.add("hidden")
  document.getElementById("no-results").classList.add("hidden")
  document.getElementById("search-loading").classList.remove("hidden")

  try {
    // Search tracks using Supabase
    const results = await searchTracks(query)

    // Update query display
    document.getElementById("search-query").textContent = query
    document.getElementById("no-results-query").textContent = query

    // Hide loading state
    document.getElementById("search-loading").classList.add("hidden")

    // Check if we have results
    if (!results || results.length === 0) {
      document.getElementById("no-results").classList.remove("hidden")
      return
    }

    // Display results
    displaySearchResults(results)
  } catch (error) {
    console.error("Search error:", error)
    document.getElementById("search-loading").classList.add("hidden")
    document.getElementById("no-results").classList.remove("hidden")
  }
}

function displaySearchResults(tracks) {
  const container = document.getElementById("search-tracks")
  if (!container) return

  // Clear container
  container.innerHTML = ""

  // Add tracks to container
  tracks.forEach((track) => {
    const trackElement = createTrackElement(track)
    container.appendChild(trackElement)
  })

  // Show results container
  document.getElementById("search-results-container").classList.remove("hidden")
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
    <div class="track-card-artist">${track.artist ? track.artist.name : "Unknown Artist"}</div>
  `

  // Add click event for play button
  const playButton = trackElement.querySelector(".track-card-play")
  playButton.addEventListener("click", (event) => {
    event.preventDefault()
    playTrack(track)
  })

  return trackElement
}

function playTrack(track) {
  // Get the audio player
  const audioPlayer = document.getElementById("audio-player")
  if (!audioPlayer) return

  // Update the audio source
  audioPlayer.src = track.audio_url

  // Update the player UI
  const currentTrackImage = document.getElementById("current-track-image")
  const currentTrackTitle = document.getElementById("current-track-title")
  const currentTrackArtist = document.getElementById("current-track-artist")

  if (currentTrackImage) currentTrackImage.src = track.cover_url || "images/placeholder.jpg"
  if (currentTrackTitle) currentTrackTitle.textContent = track.title
  if (currentTrackArtist) currentTrackArtist.textContent = track.artist ? track.artist.name : "Unknown Artist"

  // Update play button
  const playButton = document.getElementById("play-button")
  if (playButton) {
    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
  }

  // Play the audio
  audioPlayer.play()
}
