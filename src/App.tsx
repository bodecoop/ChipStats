import { Navigate, Outlet, Route, Routes } from "react-router"
import NavBar from "./components/NavBar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import ViewPosts from "./pages/ViewPosts"
import CreatePostPage from "./pages/CreatePostPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuth } from "./context/AuthContext"
import FriendsPage from "./pages/FriendsPage"

function App() {
  const { user } = useAuth();
  function ProtectedRoute() {
    return user ? <Outlet /> : <Navigate to="/login" />
  }
  function UserRoute() {
    return !user ? <Outlet /> : <Navigate to="/dashboard" />
  }

  return (
    <div className="bg-bg-main text-text flex flex-col h-screen">
        <NavBar/>
        <div className="">
            <Routes>
                {/* protected routes */}  
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<ViewPosts/>} />
                  <Route path="/create" element={<CreatePostPage/>} />
                  <Route path="/profile/:id" element={<ProfilePage/>}/>
                  <Route path="/friends" element={<FriendsPage/>}/>
                </Route>
                <Route element={<UserRoute />}>
                  <Route path="/" element={<Home/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/signup" element={<SignUp/>} />
                </Route>
            </Routes>
        </div>
    </div>
  )
}

export default App