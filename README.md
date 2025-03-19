# Music Web Application

This project is a music web application built using React. It allows users to play songs, navigate through a library of songs, and interact with a music player interface.

---

## 1. Overview

The application is a single-page React app that provides the following features:

- A music player with play, pause, skip forward, and skip backward functionality.
- A library to display all available songs.
- A navigation bar to toggle the visibility of the library.
- Smooth animations and responsive design for a better user experience.

---

## 2. Components

### 2.1 `App.js`

**Purpose**:  
Acts as the main entry point for the application. It manages the state and renders the core components.

**Key Features**:

- Maintains the state for:
  - `songs`: List of all songs.
  - `currentSong`: The currently playing song.
  - `isPlaying`: Whether a song is playing or paused.
  - `libraryStatus`: Whether the library is visible or hidden.
  - `songInfo`: Tracks the current time, duration, and animation percentage of the song.
- Handles events like:
  - Updating song progress (`timeUpdateHandler`).
  - Playing the next song when the current one ends (`songEndHandler`).
- Renders the following components:
  - `Nav`: For toggling the library.
  - `Song`: Displays the currently playing song.
  - `Player`: Provides controls for playing, pausing, and skipping songs.
  - `Library`: Displays the list of all songs.
  - `<audio>`: The HTML audio element for playing songs.

---

### 2.2 `Navb.js`

**Purpose**:  
Provides a navigation bar with a button to toggle the library's visibility.

**Key Features**:

- Contains a button that toggles the `libraryStatus` state in `App.js`.

---

### 2.3 `Song.js`

**Purpose**:  
Displays the currently playing song's details.

**Key Features**:

- Shows the song's cover image, name, and artist.

---

### 2.4 `PlayerSong.js`

**Purpose**:  
Provides the music player controls.

**Key Features**:

- Contains buttons for play/pause, skip forward, and skip backward.
- Displays the current time and duration of the song.
- Allows users to drag a slider to seek through the song.
- Updates the `songInfo` state to reflect the song's progress.
- Handles the logic for skipping to the next or previous song.

---

### 2.5 `Library.js`

**Purpose**:  
Displays a list of all songs in the library.

**Key Features**:

- Maps through the `songs` array and renders a `LibrarySong` component for each song.
- Toggles the library's visibility based on the `libraryStatus` state.

---

### 2.6 `LibrarySong.js`

**Purpose**:  
Represents an individual song in the library.

---

## 3. Data

### 3.1 `data.js`

**Purpose**:  
Provides the list of songs with their metadata.

**Key Features**:

- Each song object contains:
  - `artist`: The artist's name.
  - `audio`: URL of the song's audio file.
  - `color`: An array of two colors for the song's theme.
  - `id`: A unique identifier for the song.
  - `active`: Whether the song is currently active.

---

## 4. Styles

### 4.1 `app.css`

**Purpose**:  
Contains the styles for the entire application.

**Key Features**:

- Styles for the library, player, song container, and navigation bar.
- Responsive design for smaller screens.
- Animations for smooth transitions (e.g., library sliding in and out).

---

### 4.2 Unused CSS Files

The `nouse` folder contains unused CSS files (`library.css`, `nav.css`, `player.css`, `song.css`). These files seem to be older versions or redundant styles.

---

## 5. Other Files

### 5.1 `index.js`

**Purpose**:  
The entry point for rendering the React app.

**Key Features**:

- Renders the `App` component inside the root DOM element.

---

### 5.2 `package.json`

**Purpose**:  
Manages the project's dependencies and scripts.

**Key Features**:

- Lists dependencies like `react`, `sass`, and `@fortawesome` for icons.
- Provides scripts for starting, building, and testing the app.

---

### 5.3 `public/index.html`

**Purpose**:  
The HTML template for the React app.

**Key Features**:

- Contains a `<div>` with the `id="root"` where the React app is mounted.

---

### 5.4 `.gitignore`

**Purpose**:  
Specifies files and folders to be ignored by Git.

**Key Features**:

- Ignores `node_modules`, build files, environment files, and log files.

---

### 5.5 `README.md`

**Purpose**:  
Provides documentation for the project.

**Key Features**:

- Explains how to run, build, and test the app.
- Links to React and Create React App documentation.

---

## 6. Functionality Flow

### App Initialization:

- The app initializes with a list of songs from `data.js`.
- The first song is set as the `currentSong`.

### Playing Songs:

- Users can play/pause the current song using the player controls.
- The slider allows seeking through the song.

### Navigating the Library:

- Users can toggle the library's visibility using the navigation bar.
- Clicking a song in the library sets it as the `currentSong`.

### Responsive Design:

- The app adjusts its layout for smaller screens, ensuring usability on mobile devices.
