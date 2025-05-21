// Main application JavaScript for the home page

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  initApp()
})

// Import API functions
import { getAllTracks, getAllArtists, getAllAlbums, getAlbumTracks } from "./api.js"

async function initApp() {
  try {
    // Load featured tracks
    const tracks = await getAllTracks()
    displayFeaturedTracks(tracks.slice(0, 6))

    // Load recently played tracks (using all tracks for now)
    displayRecentlyPlayed(shuffleArray(tracks).slice(0, 5))

    // Load trending tracks
    displayTrendingTracks(tracks.slice(0, 5))

    // Load recommended tracks
    displayRecommendedTracks(shuffleArray(tracks).slice(0, 5))

    // Load artists
    const artists = await getAllArtists()
    displayPopularArtists(artists.slice(0, 6))

    // Load albums
    const albums = await getAllAlbums()
    displayNewReleases(albums.slice(0, 6))
  } catch (error) {
    console.error("Error initializing app:", error)
    showErrorMessage("Failed to load content. Please try again later.")
  }
}

function displayFeaturedTracks(tracks) {
  const container = document.querySelector(".featured-grid")
  if (!container) return

  container.innerHTML = ""

  tracks.forEach((track) => {
    const trackElement = createFeaturedTrackElement(track)
    container.appendChild(trackElement)
  })
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

function displayRecentlyPlayed(tracks) {
  const container = document.getElementById("recently-played")
  if (!container) return

  container.innerHTML = ""

  tracks.forEach((track) => {
    const trackElement = createTrackElement(track)
    container.appendChild(trackElement)
  })
}

function displayTrendingTracks(tracks) {
  const container = document.getElementById("trending-tracks")
  if (!container) return

  container.innerHTML = ""

  tracks.forEach((track) => {
    const trackElement = createTrackElement(track)
    container.appendChild(trackElement)
  })
}

function displayRecommendedTracks(tracks) {
  const container = document.getElementById("recommended-tracks")
  if (!container) return

  container.innerHTML = ""

  tracks.forEach((track) => {
    const trackElement = createTrackElement(track)
    container.appendChild(trackElement)
  })
}

function displayPopularArtists(artists) {
  const container = document.getElementById("popular-artists")
  if (!container) return

  container.innerHTML = ""

  artists.forEach((artist) => {
    const artistElement = createArtistElement(artist)
    container.appendChild(artistElement)
  })
}

function displayNewReleases(albums) {
  const container = document.getElementById("new-releases")
  if (!container) return

  container.innerHTML = ""

  albums.forEach((album) => {
    const albumElement = createAlbumElement(album)
    container.appendChild(albumElement)
  })
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

function createArtistElement(artist) {
  const artistElement = document.createElement("a")
  artistElement.href = `artist.html?id=${artist.id}`
  artistElement.className = "artist-card"

  artistElement.innerHTML = `
    <div class="artist-image">
      <img src="${artist.image_url || "images/placeholder.jpg"}" alt="${artist.name}">
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
      <img src="${album.cover_url || "images/placeholder.jpg"}" alt="${album.title}">
      <div class="track-card-play">
        <i class="fa-solid fa-play"></i>
      </div>
    </div>
    <div class="album-name">${album.title}</div>
    <div class="album-artist">${album.artist ? album.artist.name : "Unknown Artist"}</div>
  `

  // Add click event for play button
  const playButton = albumElement.querySelector(".track-card-play")
  playButton.addEventListener("click", (event) => {
    event.preventDefault()
    playAlbum(album)
  })

  return albumElement
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

async function playAlbum(album) {
  try {
    // Get the first track of the album
    const tracks = await getAlbumTracks(album.id)
    if (tracks && tracks.length > 0) {
      playTrack(tracks[0])
    }
  } catch (error) {
    console.error("Error playing album:", error)
  }
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
