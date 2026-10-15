import React, { useState } from "react";

const getSongId = (item) =>
  typeof item === "object" && item !== null
    ? item.trackId
    : item;

const Library = ({
  songs = [],
  likedSongs = [],
  onToggleLike,
  onSelectSong,
  currentSongId,
  isPlaying,
}) => {
  const [activeTab, setActiveTab] = useState("All Songs");
  const [searchInput, setSearchInput] = useState("");

  // Check if a song is liked
  const isLiked = (songId) =>
    likedSongs.some(
      (item) => String(getSongId(item)) === String(songId)
    );

  // Resolve saved song IDs from the currently loaded songs
  const savedSongs = likedSongs
    .map((item) => {
      if (typeof item === "object" && item !== null) {
        return item;
      }

      return songs.find(
        (song) => String(song.trackId) === String(item)
      );
    })
    .filter(Boolean);

  // Choose songs based on selected tab
  const sourceSongs =
    activeTab === "Liked Songs" ? savedSongs : songs;

  // Search within the selected tab
  const filteredSongs = sourceSongs.filter((song) => {
    const query = searchInput.trim().toLowerCase();

    return (
      (song.trackName || "").toLowerCase().includes(query) ||
      (song.artistName || "").toLowerCase().includes(query)
    );
  });

  const formatDuration = (milliseconds) => {
    const seconds = Math.floor(Number(milliseconds) / 1000);

    if (!Number.isFinite(seconds) || seconds < 0) {
      return "--:--";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  return (
    <div className="min-h-full bg-gray-950 px-4 py-6 text-white sm:px-6">

      {/* Heading */}
      <p className="text-sm font-medium text-amber-400">
        YOUR MUSIC
      </p>

      <h1 className="mt-1 text-3xl font-bold">
        Your Library
      </h1>

      <p className="mt-2 text-sm text-gray-400">
        Your favourite music, all in one place.
      </p>

      {/* Search */}
      <input
        type="text"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search songs or artists..."
        aria-label="Search your library"
        className="mt-6 w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 outline-none placeholder:text-gray-500 focus:border-amber-400"
      />

      {/* Tabs */}
      <div className="my-6 flex gap-3">
        {["All Songs", "Liked Songs"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-amber-400 text-black"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Song count */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {activeTab}
        </h2>

        <span className="text-sm text-gray-500">
          {filteredSongs.length} songs
        </span>
      </div>

      {/* Songs */}
      {filteredSongs.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/60">
          {filteredSongs.map((song, index) => {
            const liked = isLiked(song.trackId);

            const selected =
              currentSongId != null &&
              String(currentSongId) === String(song.trackId);

            return (
              <div
                key={song.trackId ?? index}
                className={`flex items-center gap-3 border-b border-gray-800 p-3 last:border-b-0 ${
                  selected ? "bg-gray-800" : ""
                }`}
              >
                {/* Play song */}
                <button
                  type="button"
                  onClick={() => onSelectSong?.(song)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  {song.artworkUrl100 ? (
                    <img
                      src={song.artworkUrl100}
                      alt={song.trackName || "Album cover"}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-xl">
                      ♫
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-medium ${
                        selected ? "text-amber-400" : "text-white"
                      }`}
                    >
                      {song.trackName || "Unknown Song"}
                    </p>

                    <p className="truncate text-sm text-gray-400">
                      {song.artistName || "Unknown Artist"}
                    </p>
                  </div>
                </button>

                {/* Duration */}
                <span className="hidden text-xs text-gray-500 sm:inline">
                  {formatDuration(song.trackTimeMillis)}
                </span>

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

                {/* Playing status */}
                <span className="w-4 text-center text-amber-400">
                  {selected && isPlaying ? "♫" : ""}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-800 px-5 py-12 text-center">
          <i className="ri-heart-line text-4xl text-gray-500" />

          <h3 className="mt-3 font-semibold">
            {activeTab === "Liked Songs"
              ? "No liked songs yet"
              : "No songs found"}
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            {activeTab === "Liked Songs"
              ? "Tap the heart icon on a song to save it here."
              : "Try searching for another song."}
          </p>

          {activeTab === "Liked Songs" && searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="mt-4 rounded-full bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Library;