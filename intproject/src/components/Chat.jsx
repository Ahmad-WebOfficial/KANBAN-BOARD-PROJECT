import React from "react";
import img3 from "../images/img3.jpg";

function Chat() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-12 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white h-screen">
      <div className="md:w-1/2 mt-8 md:mb-0">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Kanban brings all your tasks, teammates, and tools together
        </h2>
        <p className="text-lg max-w-md mb-6">
          Keep everything in the same place—even if your team isn’t.
        </p>

        <p className="text-base font-medium">
          Explore boards and collaborate with your team seamlessly.
        </p>
      </div>

      <div className="md:w-1/2 flex justify-center">
        <img
          src={img3}
          className="rounded-lg shadow-xl max-w-full h-auto"
          style={{ maxHeight: "400px", width: "auto" }}
        />
      </div>
    </section>
  );
}

export default Chat;
