import React, { useState, useContext } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { fireDb, storage } from "../../../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import myContext from "../../../context/data/myContext";
import { toast } from "react-hot-toast";
import { Button, Textarea } from "@material-tailwind/react";
import Layout from "../../../components/layout/Layout";
import { FiUpload, FiX, FiArrowLeft } from "react-icons/fi";

function CreateBlog() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const context = useContext(myContext);
  const { mode } = context;
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!image) {
        toast.error("Please select an image");
        setLoading(false);
        return;
      }

      const storageRef = ref(storage, `blogs/${image.name + Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error(error);
          toast.error("Error uploading image");
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const user = JSON.parse(localStorage.getItem("user"));
          console.log(user);

          const blogData = {
            caption,
            imageUrl: downloadURL,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
            userName: user.organizationName || user.name || "Anonymous",
            userRole: user.role || user.organizationType || "NGO",
            likes: 0,
            likedBy: [],
            comments: [],
            formattedDate: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })
          };

          await addDoc(collection(fireDb, "blogs"), blogData);
          toast.success("Blog published successfully!");
          setLoading(false);
          navigate("/blogs");
        }
      );
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast.error("Failed to publish blog");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={`min-h-screen py-8 px-4 ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate("/blogs")}
              className={`flex items-center space-x-2 ${mode === 'dark' ? 'text-white' : 'text-gray-700'} hover:text-blue-500 transition-colors`}
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-medium">Back to Blogs</span>
            </button>
          </div>

          {/* Main card */}
          <div className={`rounded-xl shadow-lg overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Card header */}
            <div className={`p-6 border-b ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Create New Post
              </h1>
              <p className={`mt-1 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Share your story with the community
              </p>
            </div>

            {/* Form content */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Image upload section */}
              <div className="mb-8">
                <label className={`block text-sm font-medium mb-3 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Featured Image
                </label>
                
                {!image ? (
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${mode === 'dark' ? 'border-gray-700 hover:border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}>
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FiUpload className={`text-3xl ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Drag & drop an image, or click to browse
                      </p>
                      <span className={`text-xs ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Recommended size: 1200x630 pixels
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button
                        variant="outlined"
                        size="sm"
                        className="mt-2"
                      >
                        Select Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <FiX className="text-lg" />
                    </button>
                    {progress > 0 && progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caption section */}
              <div className="mb-8">
                <label className={`block text-sm font-medium mb-3 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Story
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share your thoughts, experiences, or news with the community..."
                  className={`w-full !border ${mode === 'dark' ? '!border-gray-700 !bg-gray-800 focus:!border-blue-500' : '!border-gray-300 focus:!border-blue-400'} rounded-lg p-4`}
                  rows={8}
                />
                <p className={`mt-2 text-xs ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Minimum 50 characters. Markdown supported.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="text"
                  color={mode === 'dark' ? 'gray' : 'blue-gray'}
                  onClick={() => navigate("/blogs")}
                  disabled={loading}
                  className="flex items-center space-x-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  type="submit"
                  color="blue"
                  disabled={loading || !image}
                  loading={loading}
                  className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <span>Publishing...</span>
                  ) : (
                    <>
                      <span>Publish Now</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Tips section */}
          <div className={`mt-8 p-6 rounded-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-blue-50'} border ${mode === 'dark' ? 'border-gray-700' : 'border-blue-100'}`}>
            <h3 className={`text-lg font-semibold mb-3 ${mode === 'dark' ? 'text-white' : 'text-blue-800'}`}>
              Posting Tips
            </h3>
            <ul className={`space-y-2 text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-blue-700'}`}>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5">•</span>
                <span>Use high-quality images that represent your content</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5">•</span>
                <span>Tell a story - people engage more with personal experiences</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5">•</span>
                <span>Keep it authentic and relevant to your cause</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5">•</span>
                <span>Use proper formatting for readability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateBlog;