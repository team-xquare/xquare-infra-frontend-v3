import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Hello, Xquare User Application!</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
