import { createContext, useState } from "react";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {

  const [projectData, setProjectData] = useState({
    idea: "",
    stack: {},
    answers: {},
    cloud: {},
  });

  return (
    <ProjectContext.Provider value={{ projectData, setProjectData }}>
      {children}
    </ProjectContext.Provider>
  );
};