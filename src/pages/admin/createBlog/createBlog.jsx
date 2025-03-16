import React, { useState, useContext, useEffect } from 'react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from '../../../context/data/myContext';
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fireDb, storage } from '../../../firebase/FirebaseConfig';

function CreateBlog() {
    const context = useContext(myContext);
    const { mode } = context;

    const navigate = useNavigate();
    const [blogs, setBlogs] = useState({
        title: '',
        category: '',
        content: '',
        time: Timestamp.now(),
    });
    const [thumbnail, setThumbnail] = useState(null);

    const addPost = async () => {
        if (blogs.title === "" || blogs.category === "" || blogs.content === "" || blogs.thumbnail === "") {
            toast.error('Please Fill All Fields');
        }
        // console.log(blogs.content)
        uploadImage()
    }

    const uploadImage = () => {
        if (!thumbnail) return;
        const imageRef = ref(storage, `blogimage/${thumbnail.name}`);
        uploadBytes(imageRef, thumbnail).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                const productRef = collection(fireDb, "blogPost")
                try {
                    addDoc(productRef, {
                        blogs,
                        thumbnail: url,
                        time: Timestamp.now(),
                        date: new Date().toLocaleString(
                            "en-US",
                            {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            }
                        )
                    })
                    navigate('/dashboard')
                    toast.success('Post Added Successfully');


                } catch (error) {
                    toast.error(error)
                    console.log(error)
                }
            });
        });
    }

    // const savePost = async (imageUrl) => {
    //     const productRef = collection(fireDb, "blogPost");
    //     try {
    //         await addDoc(productRef, {
    //             ...blogs,
    //             thumbnail: imageUrl,
    //             time: Timestamp.now(),
    //             date: new Date().toLocaleString("en-US", {
    //                 month: "short",
    //                 day: "2-digit",
    //                 year: "numeric",
    //             }),
    //         });
    //         navigate('/dashboard');
    //         toast.success('Post Added Successfully');
    //     } catch (error) {
    //         toast.error(error.message);
    //         console.log(error);
    //     }
    // };

    const [text, settext] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='container mx-auto max-w-5xl py-6'>
            <div className="p-5"
                style={{
                    background: mode === 'dark' ? '#353b48' : 'rgb(226, 232, 240)',
                    borderBottom: mode === 'dark' ? '4px solid rgb(226, 232, 240)' : '4px solid rgb(30, 41, 59)'
                }}>
                {/* Header */}
                <div className="mb-2 flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Link to={'/dashboard'}>
                            <BsFillArrowLeftCircleFill size={25} />
                        </Link>
                        <Typography variant="h4" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                            Create Blog
                        </Typography>
                    </div>
                </div>

                {/* Thumbnail Upload */}
                <div className="mb-3">
                    {thumbnail && (
                        <img className="w-full rounded-md mb-3"
                        src={thumbnail
                            ? URL.createObjectURL(thumbnail)
                            : ""}
                        alt="thumbnail"
                        />
                    )}
                    <Typography variant="small" className="mb-2 font-semibold"
                        style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        Upload Thumbnail
                    </Typography>
                    <input type="file"
                        className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                </div>

                {/* Title Input */}
                <div className="mb-3">
                    <input className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none"
                        placeholder="Enter Your Title"
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        name="title"
                        value={blogs.title}
                        onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
                    />
                </div>

                {/* Category Input */}
                <div className="mb-3">
                    <input className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none"
                        placeholder="Enter Your Category"
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        name="category"
                        value={blogs.category}
                        onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}
                    />
                </div>

                {/* Content Input */}
                <div className="mb-3">
                    <textarea className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none"
                        placeholder="Enter Your Content"
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        name='content'
                        value={blogs.content}
                        onChange={(e) => setBlogs({ ...blogs, content: e.target.value })}
                    />
                </div>

                {/* Submit Button */}
                <Button className="w-full mt-5"
                    onClick={addPost}
                    style={{
                        background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                        color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                    }}>
                    Publish
                </Button>

                {/* Preview Section */}
                <div className="mt-6">
                    <h1 className="text-center mb-3 text-2xl">Preview</h1>
                    <div className="content">
                        <h2 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-black'}`}>
                            {blogs.title}
                        </h2>
                        <p className={`text-lg ${mode === 'dark' ? 'text-[#7efff5]' : 'text-black'}`}>
                            {blogs.content}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBlog;
