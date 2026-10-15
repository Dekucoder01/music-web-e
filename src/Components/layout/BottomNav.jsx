import React from "react";

const BottomNav = ({ activeTab = "Home", onNavigate }) => {
  const navItems = [
    {
      name: "Home",
      icon: "ri-home-5-line",
    },
    {
      name: "Library",
      icon: "ri-book-shelf-line",
    },
    {
      name: "Playlist",
      icon: "ri-play-list-2-line",
    },
    {
      name: "Profile",
      icon: "ri-user-line",
    },
  ];

  return (
    <nav className="w-full shrink-0 border-t border-gray-800 bg-gray-950 px-2 pb-2 pt-3">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const active = activeTab === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onNavigate?.(item.name)}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-16 flex-col items-center gap-1 transition ${
                active
                  ? "text-amber-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <i className={`${item.icon} text-2xl`} />

              <span className="text-xs font-medium">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;