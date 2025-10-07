import ChatBox from "./components/ChatBox";
import Header from "./components/Header";
import ResponsiveSidebar from "./components/SideBar";
import ChatLayout from  "../layout/chatLayout";

import "./App.css";

function App() {
  return (
    <ChatLayout>

    
    <div className="app-container">
      {/* Right section: Sidebar */}
      <div className="sidebar-section">
        <ResponsiveSidebar />
      </div>
      {/* Left section: Header + Chat */}
      <div className="main-section">
        <div className="header-container">
        <Header />
        </div>
        <div className="chatbox-container">
          <ChatBox />
        </div>
      </div>

      
    </div>
    </ChatLayout>
  );
}

export default App;
