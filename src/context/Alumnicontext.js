import React, { createContext, useContext, useState } from "react";

const AlumniContext = createContext();

export function AlumniProvider({ children }) {
  const [alumniCount, setAlumniCount] = useState(0);
  return (
    <AlumniContext.Provider value={{ alumniCount, setAlumniCount }}>
      {children}
    </AlumniContext.Provider>
  );
}

export function useAlumni() {
  return useContext(AlumniContext);
}