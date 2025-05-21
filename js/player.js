// Player functionality

document.addEventListener("DOMContentLoaded", () => {
  initPlayer()
})

let currentTrack = null
let isPlaying = false
const audioPlayer = document.getElementById("audio-player")
const playButton = document.getElementById("play-button")
const progressBar = document.getElementById("progress")
const volumeBar = document.getElementById("volume")
const currentTimeElement = document.getElementById("current-time")
const totalTimeElement = document.getElementById("total-time")
const currentTrackImage = document.getElementById("current-track-image")
const currentTrackTitle = document.getElementById("current-track-title")
const currentTrackArtist = document.getElementById("current-track-artist")

function initPlayer() {
  // Set initial volume
  if (audioPlayer) {
    audioPlayer.volume = 0.7
    updateVolumeBar()

    // Add event listeners
    if (playButton) {
      playButton.addEventListener("click", togglePlay)
    }

    audioPlayer.addEventListener("timeupdate", updateProgress)
    audioPlayer.addEventListener("ended", handleTrackEnd)
    audioPlayer.addEventListener("loadedmetadata", updateTotalTime)

    // Make progress bar clickable
    const progressContainer = document.querySelector(".progress-bar")
    if (progressContainer) {
      progressContainer.addEventListener("click", setProgress)
    }

    // Make volume bar clickable
    const volumeContainer = document.querySelector(".volume-bar")
    if (volumeContainer) {
      volumeContainer.addEventListener("click", setVolume)
    }
  }
}

function loadTrack(track) {
  if (!track) return

  currentTrack = track

  // Update audio source
  if (track.audio_url) {
    audioPlayer.src = track.audio_url
  } else {
    // If no preview URL, create a dummy source for demo purposes
    audioPlayer.src = ""
    console.warn("No preview URL available for this track")
  }

  // Update player UI
  currentTrackImage.src = track.cover_url || "images/placeholder.jpg"
  currentTrackTitle.textContent = track.title
  currentTrackArtist.textContent = track.artist ? track.artist.name : "Unknown Artist"

  // Reset progress
  progressBar.style.width = "0%"
  currentTimeElement.textContent = "0:00"

  // Auto play
  playTrack()
}

function playTrack() {
  if (!currentTrack) return

  playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
  isPlaying = true

  // Play audio
  const playPromise = audioPlayer.play()

  // Handle play promise (required for some browsers)
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.error("Playback failed:", error)
      pauseTrack()
    })
  }
}

function pauseTrack() {
  playButton.innerHTML = '<i class="fa-solid fa-play"></i>'
  isPlaying = false
  audioPlayer.pause()
}

function togglePlay() {
  if (!currentTrack) {
    // If no track is loaded, show a message
    console.log("No track selected")
    return
  }

  if (isPlaying) {
    pauseTrack()
  } else {
    playTrack()
  }
}

function updateProgress() {
  const currentTime = audioPlayer.currentTime
  const duration = audioPlayer.duration || 1 // Prevent division by zero
  const progressPercent = (currentTime / duration) * 100

  progressBar.style.width = `${progressPercent}%`
  currentTimeElement.textContent = formatTime(currentTime)
}

function updateTotalTime() {
  const duration = audioPlayer.duration || 0
  totalTimeElement.textContent = formatTime(duration)
}

function setProgress(e) {
  const width = this.clientWidth
  const clickX = e.offsetX
  const duration = audioPlayer.duration || 1

  audioPlayer.currentTime = (clickX / width) * duration
}

function updateVolumeBar() {
  volumeBar.style.width = `${audioPlayer.volume * 100}%`
}

function setVolume(e) {
  const width = this.clientWidth
  const clickX = e.offsetX

  audioPlayer.volume = clickX / width
  updateVolumeBar()
}

function handleTrackEnd() {
  pauseTrack()
  progressBar.style.width = "0%"
  audioPlayer.currentTime = 0
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}
