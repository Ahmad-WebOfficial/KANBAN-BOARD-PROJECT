import Chat from "./Chat";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex h-2rem justify-between items-center p-4 bg-black/70 z-50">
        <div className="flex items-center gap-3">
          <FiHeart size={24} className="text-pink-500" />
          <span className="text-xl font-semibold hidden md:block">
            Kanban Task Board
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/Login">
            <button
              className=" px-4 py-2 border border-indigo-400 text-blue-600 rounded hover:bg-white cursor-pointer"
              title="Login Account"
            >
              Login
            </button>
          </Link>
          <Link to="/Signup">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
              title="Sign Up Account"
            >
              Sign Up
            </button>
          </Link>
        </div>
      </header>
      <Chat />
    </>
  );
}

export default Hero;
