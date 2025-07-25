import { Route, Routes } from "react-router"
import NavBar from "./components/NavBar"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import ViewPosts from "./pages/ViewPosts"
import CreatePostPage from "./pages/CreatePostPage"

function App() {
  
  return (
    <div className="bg-bg-main text-text flex flex-col h-screen">
        <NavBar/>
        <div className="">
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/dashboard" element={<ViewPosts/>} />
                <Route path="/create" element={<CreatePostPage/>} />
            </Routes>
        </div>
    </div>
  )
}

export default App