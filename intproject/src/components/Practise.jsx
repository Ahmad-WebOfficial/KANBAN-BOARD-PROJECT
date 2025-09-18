// import React, { useState } from "react";

// function SimpleDragDrop() {
//   const [dragText, setDragText] = useState("Drag me!");
//   const [dropped, setDropped] = useState(false);

//   const handleDragStart = (e) => {
//     e.dataTransfer.setData("text/plain", dragText);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const data = e.dataTransfer.getData("text/plain");
//     setDragText(data);
//     setDropped(true);
//   };

//   const allowDrop = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gray-100 text-center">
//       <div
//         draggable
//         onDragStart={handleDragStart}
//         className="p-4 bg-blue-500 text-white rounded shadow-md cursor-move"
//       >
//         {dragText}
//       </div>

//       <div
//         onDrop={handleDrop}
//         onDragOver={allowDrop}
//         className="w-60 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center rounded"
//       >
//         {dropped ? (
//           <p className="text-green-700 font-bold">Dropped: {dragText}</p>
//         ) : (
//           <p className="text-gray-500">Drop here</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SimpleDragDrop;
