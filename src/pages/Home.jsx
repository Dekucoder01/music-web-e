import React, { useEffect, useRef, useState } from "react";

import Nave from "../Components/layout/Nave";
import Hero from "../Components/layout/Hero";
import BottomNav from "../Components/layout/BottomNav";

import Playlist from "./Playlist";
import Profile from "./Profile";
import Library from "./Library";

// Convert seconds to 0:00 format
const formatTime = (time) => {
  if (!Number.isFinite(time) || time < 0) {
    return "0:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

// Works with saved song objects or older saved IDs
const getSongId = (item) =>
  typeof item === "object" && item !== null
    ? item.trackId
    : item;

const Home = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState("Home");

  // Search states
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Shared song data
  const [songs, setSongs] = useState([]);

  // Load liked songs from localStorage
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      const savedSongs = localStorage.getItem("music-liked-songs");
      const parsedSongs = savedSongs
        ? JSON.parse(savedSongs)
        : [];

      return Array.isArray(parsedSongs) ? parsedSongs : [];
    } catch {
      return [];
    }
  });

  // Save liked songs whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "music-liked-songs",
        JSON.stringify(likedSongs)
      );
    } catch (error) {
      console.error("Unable to save liked songs:", error);
    }
  }, [likedSongs]);

  // Player states
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerError, setPlayerError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // Close Mini Player
  const closeMiniPlayer = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlayerError("");
  };

  // Search songs
  const handleSearch = (event) => {
    event.preventDefault();

    setSearchQuery(searchInput.trim());
    setActiveTab("Home");
  };

  // Central Like / Unlike handler
  const handleToggleLike = (song) => {
    if (song?.trackId == null) return;

    setLikedSongs((previous) => {
      const alreadyLiked = previous.some(
        (item) =>
          String(getSongId(item)) === String(song.trackId)
      );

      if (alreadyLiked) {
        return previous.filter(
          (item) =>
            String(getSongId(item)) !== String(song.trackId)
        );
      }

      // Save the complete song object
      return [...previous, song];
    });
  };

  // Select and play song
  const handleSelectSong = async (song) => {
    const audio = audioRef.current;

    if (!audio || !song) return;

    setPlayerError("");

    // Check if audio preview exists
    if (!song.previewUrl) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      setCurrentSong(song);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      setPlayerError(
        "Is song ka audio preview available nahi hai."
      );

      return;
    }

    // Same song: Play / Pause
    if (
      currentSong?.trackId != null &&
      String(currentSong.trackId) === String(song.trackId)
    ) {
      try {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch {
        setPlayerError("Song play nahi hua. Dobara try karo.");
      }

      return;
    }

    // New song
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(0);

    audio.src = song.previewUrl;
    audio.load();

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
      setPlayerError(
        "Audio play nahi hua. Dusra song try karo."
      );
    }
  };

  // Play / Pause button
  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio || !currentSong?.previewUrl) return;

    setPlayerError("");

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setPlayerError(
        "Playback start nahi hua. Dobara try karo."
      );
    }
  };

  // Seek bar
  const handleSeek = (event) => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    if (
      audio &&
      Number.isFinite(audio.duration) &&
      audio.duration > 0
    ) {
      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gray-950">

      {/* Top Navbar */}
      <header className="z-50 shrink-0">
        <Nave
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />
      </header>

      {/* Main Pages */}
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

        {/* Home / Discover */}
        {activeTab === "Home" && (
          <Hero
            searchQuery={searchQuery}
            onSelectSong={handleSelectSong}
            currentSongId={currentSong?.trackId}
            isPlaying={isPlaying}
            onSongsLoaded={setSongs}
            likedSongs={likedSongs}
            onToggleLike={handleToggleLike}
          />
        )}

        {/* Library */}
        {activeTab === "Library" && (
          <Library
            songs={songs}
            likedSongs={likedSongs}
            onToggleLike={handleToggleLike}
            onSelectSong={handleSelectSong}
            currentSongId={currentSong?.trackId}
            isPlaying={isPlaying}
          />
        )}

        {/* Playlist */}
        {activeTab === "Playlist" && (
          <Playlist
            songs={songs}
            likedSongs={likedSongs}
            onSelectSong={handleSelectSong}
            currentSongId={currentSong?.trackId}
            isPlaying={isPlaying}
          />
        )}

        {/* Profile */}
        {activeTab === "Profile" && (
          <Profile
            likedSongs={likedSongs}
            songs={songs}
          />
        )}

      </main>

      {/* Mini Player */}
      {currentSong && (
        <section className="shrink-0 border-t border-gray-800 bg-gray-900 px-4 py-3">

          <div className="flex items-center gap-3">

            {/* Album Image */}
            <img
              src={currentSong.artworkUrl100}
              alt={currentSong.trackName || "Album cover"}
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />

            {/* Song Details and Progress */}
            <div className="min-w-0 flex-1">

              <h3 className="truncate text-sm font-semibold text-white">
                {currentSong.trackName}
              </h3>

              <p className="truncate text-xs text-gray-400">
                {currentSong.artistName}
              </p>

              {/* Progress Bar */}
              <div className="mt-2 flex items-center gap-2">

                <span className="w-9 shrink-0 text-xs text-gray-400">
                  {formatTime(currentTime)}
                </span>

                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={Math.min(currentTime, duration || 0)}
                  onChange={handleSeek}
                  disabled={!duration || !currentSong.previewUrl}
                  aria-label="Song progress"
                  className="h-1 min-w-0 flex-1 cursor-pointer accent-amber-400 disabled:cursor-not-allowed"
                />

                <span className="w-9 shrink-0 text-right text-xs text-gray-400">
                  {formatTime(duration)}
                </span>

              </div>
            </div>

            {/* Play / Pause */}
            <button
              type="button"
              onClick={togglePlayback}
              disabled={!currentSong.previewUrl}
              aria-label={isPlaying ? "Pause song" : "Play song"}
              className="shrink-0 text-3xl text-amber-400 disabled:opacity-40"
            >
              <i
                className={
                  isPlaying
                    ? "ri-pause-fill"
                    : "ri-play-fill"
                }
              />
            </button>

            {/* Close Mini Player */}
            <button
              type="button"
              onClick={closeMiniPlayer}
              aria-label="Close mini player"
              title="Close player"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
              <i className="ri-close-line" />
            </button>

          </div>

          {/* Error Message */}
          {playerError && (
            <p className="mt-2 text-xs text-red-400">
              {playerError}
            </p>
          )}

          <p className="mt-1 text-xs text-gray-500">
            Audio preview
          </p>

        </section>
      )}

      {/* Bottom Navigation */}
      <div className="z-50 shrink-0">
        <BottomNav
          activeTab={activeTab}
          onNavigate={setActiveTab}
        />
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        className="hidden"
        onPlay={() => {
          setIsPlaying(true);
          setPlayerError("");
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;

          if (Number.isFinite(audio.duration)) {
            setDuration(audio.duration);
          }
        }}
        onDurationChange={(event) => {
          const audio = event.currentTarget;

          if (Number.isFinite(audio.duration)) {
            setDuration(audio.duration);
          }
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        }}
        onError={() => {
          setIsPlaying(false);

          // Do not show an error if the player was intentionally closed
          if (audioRef.current?.getAttribute("src")) {
            setPlayerError("Audio preview load nahi hua.");
          }
        }}
      />

    </div>
  );
};

export default Home;