import React, { useEffect, useMemo, useState } from "react";

const Playlist = ({
  songs = [],
  likedSongs = [],
  onSelectSong,
  currentSongId,
  isPlaying,
}) => {
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem("music-playlists");
      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [playlistName, setPlaylistName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activePlaylistId, setActivePlaylistId] = useState(null);

  // Save playlists
  useEffect(() => {
    try {
      localStorage.setItem(
        "music-playlists",
        JSON.stringify(playlists)
      );
    } catch (error) {
      console.error("Unable to save playlists:", error);
    }
  }, [playlists]);

  // Combine available songs and liked songs
  const availableSongs = useMemo(() => {
    const combined = [...songs, ...likedSongs].filter(
      (song) => song && typeof song === "object" && song.trackId != null
    );

    return combined.filter(
      (song, index, array) =>
        array.findIndex(
          (item) => String(item.trackId) === String(song.trackId)
        ) === index
    );
  }, [songs, likedSongs]);

  const activePlaylist = playlists.find(
    (playlist) => playlist.id === activePlaylistId
  );

  // Create playlist
  const handleCreatePlaylist = (event) => {
    event.preventDefault();

    const name = playlistName.trim();

    if (!name) return;

    const newPlaylist = {
      id: String(Date.now()),
      name,
      songIds: [],
    };

    setPlaylists((previous) => [...previous, newPlaylist]);
    setActivePlaylistId(newPlaylist.id);
    setPlaylistName("");
  };

  // Add / remove song from selected playlist
  const handleToggleSong = (songId) => {
    if (!activePlaylistId) return;

    setPlaylists((previous) =>
      previous.map((playlist) => {
        if (playlist.id !== activePlaylistId) {
          return playlist;
        }

        const alreadyAdded = playlist.songIds.some(
          (id) => String(id) === String(songId)
        );

        return {
          ...playlist,
          songIds: alreadyAdded
            ? playlist.songIds.filter(
                (id) => String(id) !== String(songId)
              )
            : [...playlist.songIds, songId],
        };
      })
    );
  };

  // Delete playlist
  const handleDeletePlaylist = (playlistId) => {
    setPlaylists((previous) =>
      previous.filter((playlist) => playlist.id !== playlistId)
    );

    if (activePlaylistId === playlistId) {
      setActivePlaylistId(null);
    }
  };

  // Search available songs
  const filteredSongs = availableSongs.filter((song) => {
    const query = searchInput.trim().toLowerCase();

    return (
      (song.trackName || "").toLowerCase().includes(query) ||
      (song.artistName || "").toLowerCase().includes(query)
    );
  });

  // Get actual songs in selected playlist
  const playlistSongs = (activePlaylist?.songIds || [])
    .map((id) =>
      availableSongs.find(
        (song) => String(song.trackId) === String(id)
      )
    )
    .filter(Boolean);

  const isInPlaylist = (songId) =>
    Boolean(
      activePlaylist?.songIds.some(
        (id) => String(id) === String(songId)
      )
    );

  return (
    <div className="min-h-full bg-gray-950 px-4 py-6 text-white sm:px-8">

      {/* Header */}
      <div className="mb-7">
        <p className="text-sm font-medium text-amber-400">
          YOUR COLLECTION
        </p>

        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
          Your Playlists
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Create your own vibe and keep your favourite songs together.
        </p>
      </div>

      {/* Create playlist */}
      <form
        onSubmit={handleCreatePlaylist}
        className="mb-8 flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-2xl text-black">
            <i className="ri-add-line" />
          </div>

          <input
            type="text"
            value={playlistName}
            onChange={(event) => setPlaylistName(event.target.value)}
            placeholder="Enter playlist name..."
            maxLength={50}
            className="min-w-0 flex-1 bg-transparent py-3 text-white outline-none placeholder:text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={!playlistName.trim()}
          className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create Playlist
        </button>
      </form>

      {/* Playlist cards */}
      <section className="mb-9">
        <h2 className="mb-4 text-xl font-semibold">
          My Playlists
        </h2>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {playlists.map((playlist) => {
              const selected = activePlaylistId === playlist.id;

              const coverSong = availableSongs.find(
                (song) =>
                  playlist.songIds.some(
                    (id) => String(id) === String(song.trackId)
                  )
              );

              return (
                <button
                  key={playlist.id}
                  type="button"
                  onClick={() => setActivePlaylistId(playlist.id)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    selected
                      ? "border-amber-400 bg-gray-800"
                      : "border-gray-800 bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden bg-linear-to-br from-amber-500/30 via-purple-500/20 to-gray-900">
                    {coverSong?.artworkUrl100 ? (
                      <img
                        src={coverSong.artworkUrl100}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <i className="ri-play-list-2-line text-5xl text-amber-400" />
                    )}
                  </div>

                  <div className="p-3">
                    <p className="truncate font-semibold">
                      {playlist.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {playlist.songIds.length} songs
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-800 px-5 py-10 text-center">
            <i className="ri-music-2-line text-4xl text-gray-500" />

            <p className="mt-3 font-medium">
              No playlists yet
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Create a playlist above to start collecting songs.
            </p>
          </div>
        )}
      </section>

      {/* Selected playlist */}
      {activePlaylist && (
        <section className="mb-9">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-amber-400">
                SELECTED PLAYLIST
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {activePlaylist.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => handleDeletePlaylist(activePlaylist.id)}
              className="flex items-center gap-2 rounded-xl border border-red-900/60 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950"
            >
              <i className="ri-delete-bin-line" />
              Delete Playlist
            </button>
          </div>

          {playlistSongs.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-800">
              {playlistSongs.map((song, index) => {
                const selected =
                  currentSongId != null &&
                  String(currentSongId) === String(song.trackId);

                return (
                  <div
                    key={song.trackId}
                    className="flex items-center gap-3 border-b border-gray-800 bg-gray-900 p-3 last:border-b-0"
                  >
                    <span className="w-5 text-xs text-gray-500">
                      {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelectSong?.(song)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <img
                        src={song.artworkUrl100}
                        alt={song.trackName || "Album cover"}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className={`truncate font-medium ${
                          selected ? "text-amber-400" : "text-white"
                        }`}>
                          {song.trackName}
                        </p>

                        <p className="truncate text-sm text-gray-400">
                          {song.artistName}
                        </p>
                      </div>

                      <i
                        className={`${
                          selected && isPlaying
                            ? "ri-pause-circle-line"
                            : "ri-play-circle-line"
                        } text-xl text-amber-400`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSong(song.trackId)}
                      aria-label="Remove song from playlist"
                      title="Remove from playlist"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800 hover:text-red-400"
                    >
                      <i className="ri-close-line text-xl" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-gray-800 p-6 text-center text-sm text-gray-400">
              This playlist is empty. Add songs below.
            </p>
          )}
        </section>
      )}

      {/* Add songs */}
      {activePlaylist && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Add Songs
          </h2>

          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search loaded songs..."
            className="mb-4 w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 outline-none placeholder:text-gray-500 focus:border-amber-400"
          />

          {filteredSongs.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filteredSongs.map((song) => {
                const added = isInPlaylist(song.trackId);

                return (
                  <div
                    key={song.trackId}
                    className="flex items-center gap-3 rounded-xl bg-gray-900 p-3"
                  >
                    <img
                      src={song.artworkUrl100}
                      alt={song.trackName || "Album cover"}
                      className="h-11 w-11 shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {song.trackName}
                      </p>

                      <p className="truncate text-sm text-gray-400">
                        {song.artistName}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSong(song.trackId)}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                        added
                          ? "bg-amber-400 text-black"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                      aria-label={added ? "Remove song" : "Add song"}
                      title={added ? "Remove song" : "Add song"}
                    >
                      <i
                        className={`${
                          added ? "ri-check-line" : "ri-add-line"
                        } text-xl`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl bg-gray-900 p-5 text-center text-sm text-gray-400">
              No loaded songs found. Search for songs on the Home page first.
            </p>
          )}
        </section>
      )}

    </div>
  );
};

export default Playlist;