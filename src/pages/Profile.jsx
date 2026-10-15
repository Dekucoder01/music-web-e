import React, { useEffect, useState } from "react";

const Profile = ({ likedSongs = [], songs = [] }) => {
  // Load saved profile name
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem("music-profile-name") || "Music Lover";
    } catch {
      return "Music Lover";
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState(name);
  const [playlistCount, setPlaylistCount] = useState(0);
  const [message, setMessage] = useState("");

  // Read playlist count from the existing Playlist component's storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("music-playlists");
      const playlists = saved ? JSON.parse(saved) : [];

      setPlaylistCount(
        Array.isArray(playlists) ? playlists.length : 0
      );
    } catch {
      setPlaylistCount(0);
    }
  }, []);

  // Save profile name
  const handleSave = (event) => {
    event.preventDefault();

    const trimmedName = nameInput.trim();

    if (!trimmedName) {
      setMessage("Please enter your name.");
      return;
    }

    try {
      localStorage.setItem("music-profile-name", trimmedName);
      setName(trimmedName);
      setNameInput(trimmedName);
      setEditMode(false);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Could not save your profile. Try again.");
    }
  };

  const likedCount = likedSongs.length;
  const songCount = songs.length;

  const initial = name.trim().charAt(0).toUpperCase() || "M";

  return (
    <main className="min-h-full bg-gray-950 px-4 py-6 text-white sm:px-8">

      {/* Page heading */}
      <div className="mb-8">
        <p className="text-sm font-medium text-amber-400">
          YOUR ACCOUNT
        </p>

        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Your music, your collection, your vibe.
        </p>
      </div>

      {/* Profile card */}
      <section className="rounded-3xl border border-gray-800 bg-linear-to-br from-gray-900 to-gray-950 p-5 sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-gray-800 bg-amber-400 text-4xl font-bold text-gray-950 shadow-lg shadow-amber-400/10">
            {initial}
          </div>

          {/* Profile details */}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-400">
              MUSIC APP MEMBER
            </p>

            <h2 className="mt-1 wrap-break-word text-2xl font-bold">
              {name}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Music lover · Discover your next favourite song.
            </p>
          </div>

          {/* Edit button */}
          <button
            type="button"
            onClick={() => {
              setNameInput(name);
              setEditMode((previous) => !previous);
              setMessage("");
            }}
            className="flex items-center justify-center gap-2 self-start rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium transition hover:bg-gray-800 sm:self-center"
          >
            <i className="ri-edit-line" />
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Edit form */}
        {editMode && (
          <form
            onSubmit={handleSave}
            className="mt-7 border-t border-gray-800 pt-5"
          >
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Display name
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="profile-name"
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                maxLength={40}
                placeholder="Enter your name"
                className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none placeholder:text-gray-500 focus:border-amber-400"
              />

              <button
                type="submit"
                className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-gray-950 transition hover:bg-amber-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {message && (
          <p
            role="status"
            className={`mt-4 text-sm ${
              message.includes("successfully")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </section>

      {/* Music statistics */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold">
          Your Music Stats
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

          {/* Liked songs */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-2xl text-red-400">
              <i className="ri-heart-fill" />
            </div>

            <p className="text-2xl font-bold">
              {likedCount}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Liked Songs
            </p>
          </div>

          {/* Playlists */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-2xl text-amber-400">
              <i className="ri-play-list-2-line" />
            </div>

            <p className="text-2xl font-bold">
              {playlistCount}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Playlists
            </p>
          </div>

          {/* Loaded songs */}
          <div className="col-span-2 rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:col-span-1 sm:p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-2xl text-purple-400">
              <i className="ri-disc-line" />
            </div>

            <p className="text-2xl font-bold">
              {songCount}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Songs Loaded
            </p>
          </div>

        </div>
      </section>

      {/* About this app */}
      <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-2xl text-gray-950">
            <i className="ri-music-2-fill" />
          </div>

          <div>
            <h2 className="font-bold">Made for your music</h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Discover songs, save your favourites, create playlists,
              and enjoy music in one place.
            </p>
          </div>
        </div>
      </section>

      <p className="mt-6 text-center text-xs text-gray-600">
        Your music journey starts here.
      </p>
    </main>
  );
};

export default Profile;