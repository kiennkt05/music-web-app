import supabase from "./supabase";

async function getData(selectedFolder, setSongs, setIsLoading) {
  try {
    setIsLoading(true);

    const { data: fetchedSongs, error } = await supabase
      .from(selectedFolder) // Use the selected folder (table name)
      .select("id, name, artist, cover, audio");

    if (error) {
      console.error(`Error fetching songs from ${selectedFolder}`, error);
      alert(`An error occurred while fetching songs from ${selectedFolder}`);
    } else {
      setSongs(fetchedSongs);
    }
  } catch (error) {
    console.error("Error fetching songs", error);
    alert("An error occurred while fetching songs");
  } finally {
    setIsLoading(false);
  }
}

export default getData;
