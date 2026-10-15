import React, { useEffect, useState } from "react";

const Hero = ({
  searchQuery,
  onSelectSong,
  currentSongId,
  isPlaying,
  onSongsLoaded,
  likedSongs = [],
  onToggleLike,
}) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch songs from iTunes API
  useEffect(() => {
    const controller = new AbortController();

    const fetchSongs = async () => {
      setLoading(true);
      setError("");

      try {
        const term = searchQuery?.trim() || "top hits";

        const url =
          `https://itunes.apple.com/search?term=${encodeURIComponent(term)}` +
          "&entity=song&limit=20&country=IN";

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }

        const data = await response.json();
        const results = data.results || [];

        setSongs(results);
        onSongsLoaded?.(results);

        if (results.length === 0) {
          setError("No songs found. Try another search.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setSongs([]);
          onSongsLoaded?.([]);
          setError("Songs load nahi hue. Internet check karo.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSongs();

    return () => controller.abort();
  }, [searchQuery, onSongsLoaded]);

  // Check if song is liked
  const isLiked = (songId) =>
    likedSongs.some((item) => {
      const id =
        typeof item === "object" && item !== null
          ? item.trackId
          : item;

      return String(id) === String(songId);
    });

  return (
    <div className="w-full bg-gray-950 px-5 py-5">

      {/* Heading */}
      <div className="mb-5">
        <p className="text-sm font-medium text-amber-400">
          DISCOVER MUSIC
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Trending Songs
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Discover music and save your favourites.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="py-8 text-center text-gray-400">
          Loading songs...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="py-8 text-center text-gray-400">
          {error}
        </p>
      )}

      {/* Song List */}
      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {songs.map((song) => {
            const liked = isLiked(song.trackId);

            const selected =
              currentSongId != null &&
              String(currentSongId) === String(song.trackId);

            return (
              <div
                key={song.trackId}
                className={`flex h-20 items-center gap-3 rounded-xl p-3 ${
                  selected ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                {/* Song details and play button */}
                <button
                  type="button"
                  onClick={() => onSelectSong?.(song)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <img
                    src={song.artworkUrl100}
                    alt={song.trackName || "Album cover"}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-white">
                      {song.trackName}
                    </h2>

                    <p className="truncate text-sm text-gray-400">
                      {song.artistName}
                    </p>
                  </div>

                  <i
                    className={`${
                      selected && isPlaying
                        ? "ri-volume-up-line"
                        : "ri-play-circle-line"
                    } shrink-0 text-xl text-amber-400`}
                  />
                </button>

                {/* Like / Unlike */}
                <button
                  type="button"
                  onClick={() => onToggleLike?.(song)}
                  aria-label={liked ? "Unlike song" : "Like song"}
                  aria-pressed={liked}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-gray-800 ${
                    liked
                      ? "text-red-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <i
                    className={`${
                      liked ? "ri-heart-fill" : "ri-heart-line"
                    } text-xl`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Hero;