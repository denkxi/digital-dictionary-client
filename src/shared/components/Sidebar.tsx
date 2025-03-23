const menuItems = [
  { label: "Profile", href: "#profile" },
  { label: "Dictionaries", href: "#dictionaries" },
  { label: "Settings", href: "#settings" },
];

// TODO: Add icons to menu items

const Sidebar = () => {
  return (
    <div className="h-full w-64 fixed left-0 top-0 bg-green-700/70 text-white font-sans">
      <h1 className="text-4xl font-bold text-center my-2">Kotoba</h1>
      <div className="flex flex-col items-start justify-start py-5">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="text-2xl py-4 px-3 my-0.5 w-full hover:text-gray-200 select-none cursor-pointer hover:bg-green-500 transition-all duration-300"
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
