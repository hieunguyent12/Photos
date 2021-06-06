import { useContext } from "react";
import "./App.css";
import { AuthContext } from "./AuthContext";

import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";

function App() {
  const { authState, onLogout } = useContext(AuthContext);

  const renderContent = () => {
    if (authState.pending) {
      return <p>Loading...</p>;
    }

    if (authState.isSignedIn) {
      return <Dashboard onLogout={onLogout} />;
    }

    return (
      <>
        <p className="text-xl font-bold">Photos</p>
        <SignIn />
      </>
    );
  };

  return <div className="App h-full container mx-auto">{renderContent()}</div>;
}

export default App;
