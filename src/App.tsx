import { Container } from "@mui/material";
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#e9ebf0"
      }}
    >
      <ChatBox />
    </Container>
  );
}

export default App;