// API functions for interacting with Supabase

import { supabase } from "./supabase.js"

// ==================== TRACKS API ====================
export async function getAllTracks() {
  const { data, error } = await supabase
    .from("tracks")
    .select(`
      *,
      artist:artists(id, name),
      album:albums(id, title, cover_url)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tracks:", error)
    return []
  }

  return data || []
}

export async function getTrackById(trackId) {
  const { data, error } = await supabase
    .from("tracks")
    .select(`
      *,
      artist:artists(id, name),
      album:albums(id, title, cover_url)
    `)
    .eq("id", trackId)
    .single()

  if (error) {
    console.error(`Error fetching track ${trackId}:`, error)
    return null
  }

  return data
}

export async function searchTracks(query) {
  const { data, error } = await supabase
    .from("tracks")
    .select(`
      *,
      artist:artists(id, name),
      album:albums(id, title, cover_url)
    `)
    .ilike("title", `%${query}%`)
    .order("title")

  if (error) {
    console.error("Error searching tracks:", error)
    return []
  }

  return data || []
}

// ==================== ARTISTS API ====================
export async function getAllArtists() {
  const { data, error } = await supabase.from("artists").select("*").order("name")

  if (error) {
    console.error("Error fetching artists:", error)
    return []
  }

  return data || []
}

export async function getArtistById(artistId) {
  const { data, error } = await supabase.from("artists").select("*").eq("id", artistId).single()

  if (error) {
    console.error(`Error fetching artist ${artistId}:`, error)
    return null
  }

  return data
}

export async function getArtistTracks(artistId) {
  const { data, error } = await supabase
    .from("tracks")
    .select(`
      *,
      album:albums(id, title, cover_url)
    `)
    .eq("artist_id", artistId)
    .order("title")

  if (error) {
    console.error(`Error fetching tracks for artist ${artistId}:`, error)
    return []
  }

  return data || []
}

// ==================== ALBUMS API ====================
export async function getAllAlbums() {
  const { data, error } = await supabase
    .from("albums")
    .select(`
      *,
      artist:artists(id, name)
    `)
    .order("title")

  if (error) {
    console.error("Error fetching albums:", error)
    return []
  }

  return data || []
}

export async function getAlbumById(albumId) {
  const { data, error } = await supabase
    .from("albums")
    .select(`
      *,
      artist:artists(id, name)
    `)
    .eq("id", albumId)
    .single()

  if (error) {
    console.error(`Error fetching album ${albumId}:`, error)
    return null
  }

  return data
}

export async function getAlbumTracks(albumId) {
  const { data, error } = await supabase
    .from("tracks")
    .select(`
      *,
      artist:artists(id, name)
    `)
    .eq("album_id", albumId)
    .order("title")

  if (error) {
    console.error(`Error fetching tracks for album ${albumId}:`, error)
    return []
  }

  return data || []
}

// ==================== PLAYLISTS API ====================
export async function getUserPlaylists(userId) {
  const { data, error } = await supabase.from("playlists").select("*").eq("user_id", userId).order("name")

  if (error) {
    console.error(`Error fetching playlists for user ${userId}:`, error)
    return []
  }

  return data || []
}

export async function getPlaylistById(playlistId) {
  const { data, error } = await supabase.from("playlists").select("*").eq("id", playlistId).single()

  if (error) {
    console.error(`Error fetching playlist ${playlistId}:`, error)
    return null
  }

  return data
}

export async function getPlaylistTracks(playlistId) {
  const { data, error } = await supabase
    .from("playlist_tracks")
    .select(`
      position,
      track:tracks(
        id, 
        title, 
        duration, 
        audio_url, 
        cover_url,
        artist:artists(id, name),
        album:albums(id, title)
      )
    `)
    .eq("playlist_id", playlistId)
    .order("position")

  if (error) {
    console.error(`Error fetching tracks for playlist ${playlistId}:`, error)
    return []
  }

  // Reshape the data to make it easier to work with
  return (data || []).map((item) => ({
    ...item.track,
    position: item.position,
  }))
}

export async function createPlaylist(userId, name, coverUrl = null) {
  const { data, error } = await supabase
    .from("playlists")
    .insert([{ user_id: userId, name, cover_url: coverUrl }])
    .select()
    .single()

  if (error) {
    console.error("Error creating playlist:", error)
    return null
  }

  return data
}

export async function addTrackToPlaylist(playlistId, trackId, position) {
  const { data, error } = await supabase
    .from("playlist_tracks")
    .insert([{ playlist_id: playlistId, track_id: trackId, position }])

  if (error) {
    console.error("Error adding track to playlist:", error)
    return false
  }

  return true
}

export async function removeTrackFromPlaylist(playlistId, trackId) {
  const { error } = await supabase
    .from("playlist_tracks")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("track_id", trackId)

  if (error) {
    console.error("Error removing track from playlist:", error)
    return false
  }

  return true
}

// ==================== USER API ====================
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.error("Error getting current user:", error)
    return null
  }

  return user
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error(`Error fetching user profile ${userId}:`, error)
    return null
  }

  return data
}

// ==================== FAVORITES API ====================
export async function getUserFavorites(userId) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select(`
      track:tracks(
        id, 
        title, 
        duration, 
        audio_url, 
        cover_url,
        artist:artists(id, name),
        album:albums(id, title)
      )
    `)
    .eq("user_id", userId)

  if (error) {
    console.error(`Error fetching favorites for user ${userId}:`, error)
    return []
  }

  // Reshape the data to make it easier to work with
  return (data || []).map((item) => item.track)
}

export async function addToFavorites(userId, trackId) {
  const { error } = await supabase.from("user_favorites").insert([{ user_id: userId, track_id: trackId }])

  if (error) {
    console.error("Error adding track to favorites:", error)
    return false
  }

  return true
}

export async function removeFromFavorites(userId, trackId) {
  const { error } = await supabase.from("user_favorites").delete().eq("user_id", userId).eq("track_id", trackId)

  if (error) {
    console.error("Error removing track from favorites:", error)
    return false
  }

  return true
}

export async function isTrackFavorite(userId, trackId) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .single()

  if (error) {
    // If no record is found, it's not a favorite
    if (error.code === "PGRST116") {
      return false
    }
    console.error("Error checking if track is favorite:", error)
    return false
  }

  return true
}

// ==================== HISTORY API ====================
export async function addToHistory(userId, trackId) {
  const { error } = await supabase.from("listening_history").insert([{ user_id: userId, track_id: trackId }])

  if (error) {
    console.error("Error adding track to history:", error)
    return false
  }

  return true
}

export async function getUserHistory(userId, limit = 20) {
  const { data, error } = await supabase
    .from("listening_history")
    .select(`
      played_at,
      track:tracks(
        id, 
        title, 
        duration, 
        audio_url, 
        cover_url,
        artist:artists(id, name),
        album:albums(id, title)
      )
    `)
    .eq("user_id", userId)
    .order("played_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`Error fetching history for user ${userId}:`, error)
    return []
  }

  // Reshape the data to make it easier to work with
  return (data || []).map((item) => ({
    ...item.track,
    played_at: item.played_at,
  }))
}
