import React from "react";

const Nave = ({ searchInput, setSearchInput, handleSearch }) => {
  return (
    <nav className="sticky top-0 border-b-gray-800 border-2 z-50 w-full">
      <div className="flex items-center gap-4  px-4 py-4">

        {/* Search Form */}
        <form
          onSubmit={handleSearch }
          className="flex min-w-0 flex-1 gap-2"
        >
          <div className="flex min-w-0 flex-1 items-center">
            <i className="ri-search-line flex h-11 items-center rounded-l-3xl bg-amber-400 px-3 text-lg text-gray-900" />

            <input
              type="text"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search songs..."
              className="h-11 min-w-0 flex-1 rounded-r-3xl bg-amber-400 px-3 text-gray-950 outline-none placeholder:text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-3 font-semibold text-white"
          >
            Search
          </button>
        </form>

      </div>
    </nav>
  );
};

export default Nave;