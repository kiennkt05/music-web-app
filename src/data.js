import supabase from "./supabase";

async function getData(setSongs, setIsLoading) {
  try {
    setIsLoading(true);

    const { data: fetchedSongs, error } = await supabase
      .from("songs")
      .select("id, name, artist, cover, audio");

    if (error) {
      console.error("Error fetching songs", error);
      alert("An error occurred while fetching songs");
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
