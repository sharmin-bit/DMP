import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import IdeaInput from "./pages/IdeaInput";
import StackSelection from "./pages/StackSelection";
import Wizard from "./pages/Wizard";
import Cloud from "./pages/Cloud";
import DeploymentPlan from "./pages/DeploymentPlan";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/idea" element={<IdeaInput />} />
        <Route path="/stack" element={<StackSelection />} />
        <Route path="/wizard" element={<Wizard />} />
        <Route path="/cloud" element={<Cloud />} />
        <Route path="/plan" element={<DeploymentPlan />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;