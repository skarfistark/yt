import styled, { ThemeProvider } from "styled-components";
import { Menu } from "./components/Menu";
import { Navbar } from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { useState } from "react";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { Home } from "./pages/Home";
import { Video } from "./pages/Video";
import { SignIn } from "../src/pages/SignIn";
import { Search } from "./pages/Search";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex:7;  
  background-color : ${({ theme }) => theme.bgLighter};
`;

const Wrapper = styled.div`
  padding : 20px 40px;
`;

//<ThemeProvider theme2={darkMode ? darkTheme : lightTheme} theme={darkMode ? lightTheme : darkTheme}>
//Theme provider arguemnts will render whole react tree so thats magic
//all are props only just javascript substitution thats it
//Link in some other page is like throw and Router in some other page is like catch and work
//why we kept router in app means here app.js needed to be rendered
function App() {

  const [darkMode, setDarkMode] = useState(true);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
            <Routes>
              <Route path="/">
                <Route index element={<Home type="random" />}/>
                <Route path="trends" element={<Home type="trend"/>}/>
                <Route path="subscriptions" element={<Home type="sub" />}/>
                <Route path="search" element={<Search />}/>
                <Route path="signin" element={<SignIn />}/>
                <Route path="video">
                  <Route path=":id" element={<Video/>} />
                </Route>
              </Route>
            </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
