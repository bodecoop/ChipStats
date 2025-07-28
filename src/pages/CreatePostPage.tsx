import CreatePost from "../components/CreatePost"


function CreatePostPage() {


    return (
        <div className="relative text-lg flex items-center justify-center h-screen bg-black overflow-hidden">
            <img src="./src/assets/poker-chip-stacks.webp" alt="poker chips" className="w-full h-full object-cover blur-md" />
            <div className="absolute bg-primary/50 w-150 h-150 rounded-full top-8 right-[-16rem] blur-2xl"></div>
            <div className="absolute bg-primary/50 w-150 h-150 rounded-full bottom-[-8rem] left-[-16rem] blur-2xl"></div>
            <CreatePost />
        </div>
    )
}

export default CreatePostPage