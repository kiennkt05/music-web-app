// Track page functionality

import { getTrackById } from "./api.js"

document.addEventListener("DOMContentLoaded", () => {
  initTrackPage()
})

async function initTrackPage() {
  // Get track ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const trackId = urlParams.get("id")

  if (!trackId) {
    showError("No track ID provided")
    return
  }

  // Show loading state
  document.getElementById("track-loading").classList.remove("hidden")
  document.getElementById("track-content").classList.add("hidden")

  try {
    // Fetch track details from Supabase
    const track = await getTrackById(trackId)

    if (!track) {
      showError("Track not found")
      return
    }

    // Update page with track details
    displayTrackDetails(track)

    // Update document title
    document.title = `${track.title} - ${track.artist.name} | Music Web App`
  } catch (error) {
    console.error("Error loading track:", error)
    showError("Failed to load track details")
  } finally {
    // Hide loading state
    document.getElementById("track-loading").classList.add("hidden")
  }
}

function displayTrackDetails(track) {
  // Update track image
  const trackImage = document.getElementById("track-image")
  trackImage.src = track.cover_url || "images/placeholder.jpg"
  trackImage.alt = track.title

  // Update track title and artist
  document.getElementById("track-title").textContent = track.title
  document.getElementById("track-artist").textContent = track.artist ? track.artist.name : "Unknown Artist"

  // Update badges
  const badgesContainer = document.getElementById("track-badges")
  badgesContainer.innerHTML = ""

  if (track.album) {
    const albumBadge = document.createElement("span")
    albumBadge.className = "badge"
    albumBadge.textContent = track.album.title
    badgesContainer.appendChild(albumBadge)
  }

  // Format duration
  const durationBadge = document.createElement("span")
  durationBadge.className = "badge"
  durationBadge.textContent = formatDuration(track.duration)
  badgesContainer.appendChild(durationBadge)

  // Update preview
  const previewContainer = document.getElementById("track-preview")
  previewContainer.innerHTML = ""

  if (track.audio_url) {
    const audio = document.createElement("audio")
    audio.controls = true
    audio.src = track.audio_url
    previewContainer.appendChild(audio)

    const previewNote = document.createElement("p")
    previewNote.className = "preview-note"
    previewNote.textContent = "Preview"
    previewContainer.appendChild(previewNote)
  } else {
    const noPreview = document.createElement("p")
    noPreview.className = "no-preview"
    noPreview.textContent = "No preview available"
    previewContainer.appendChild(noPreview)
  }

  // Update about section
  let aboutText = `${track.title} by ${track.artist ? track.artist.name : "Unknown Artist"}`
  if (track.album) {
    aboutText += ` from the album ${track.album.title}`
  }
  document.getElementById("track-about-text").textContent = aboutText

  // Show track content
  document.getElementById("track-content").classList.remove("hidden")
}

function formatDuration(seconds) {
  if (!seconds) return "0:00"

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

function showError(message) {
  // Hide loading state
  document.getElementById("track-loading").classList.add("hidden")

  // Create error message
  const errorElement = document.createElement("div")
  errorElement.className = "error-message"
  errorElement.innerHTML = `
    <i class="fa-solid fa-circle-exclamation"></i>
    <p>${message}</p>
    <a href="index.html" class="back-button">Back to Home</a>
  `

  // Add to page
  const trackContainer = document.getElementById("track-container")
  trackContainer.appendChild(errorElement)
}
