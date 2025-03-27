import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import { Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutline, Close, MoreHoriz } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { motion } from 'framer-motion';

function BlogFeed() {

  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [openComments, setOpenComments] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const q = query(collection(fireDb, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (blogId, likedBy) => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    const blogRef = doc(fireDb, 'blogs', blogId);
    const isLiked = likedBy.includes(user.uid);

    try {
      if (isLiked) {
        await updateDoc(blogRef, {
          likes: likedBy.length - 1,
          likedBy: arrayRemove(user.uid)
        });
        toast.success('Like removed');
      } else {
        await updateDoc(blogRef, {
          likes: likedBy.length + 1,
          likedBy: arrayUnion(user.uid)
        });
        toast.success('Liked!');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    const blogRef = doc(fireDb, 'blogs', selectedBlog.id);
    const newComment = {
      userId: user.uid,
      userName: user.organizationName || user.name || 'Anonymous',
      userRole: user.role || user.organizationType || 'User',
      text: commentText,
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      await updateDoc(blogRef, {
        comments: arrayUnion(newComment)
      });
      setCommentText('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Community Stories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover inspiring stories and updates from our food sharing community
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              {/* User Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500"
                    src={blog.userPhoto}
                  >
                    {blog.userName?.charAt(0) || 'U'}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {blog.userName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {blog.userRole}
                    </p>
                  </div>
                </div>
                <IconButton size="small" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <MoreHoriz fontSize="small" />
                </IconButton>
              </div>

              {/* Blog Image */}
              {blog.imageUrl && (
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    alt={blog.caption}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {blog.caption}
                </p>
                
                {/* Date and Time */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {blog.formattedDate}
                </p>
                
                {/* Engagement Bar */}
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                  <button 
                    onClick={() => handleLike(blog.id, blog.likedBy || [])}
                    className={`flex items-center space-x-1 ${blog.likedBy?.includes(user?.uid) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                  >
                    {blog.likedBy?.includes(user?.uid) ? (
                      <Favorite className="text-red-500" />
                    ) : (
                      <FavoriteBorder />
                    )}
                    <span className="text-sm">{blog.likes || 0}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedBlog(blog);
                      setOpenComments(true);
                    }}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <ChatBubbleOutline fontSize="small" />
                    <span className="text-sm">{blog.comments?.length || 0}</span>
                  </button>

                  <button className="text-gray-500 hover:text-purple-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No stories yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Be the first to share your food sharing experience with the community
            </p>
          </div>
        )}

        {/* Comments Dialog - Modern Styled */}
        <Dialog 
          open={openComments} 
          onClose={() => setOpenComments(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            className: "rounded-2xl bg-white dark:bg-gray-800"
          }}
        >
          <DialogTitle className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedBlog?.comments?.length || 0} comments
              </p>
            </div>
            <IconButton 
              onClick={() => setOpenComments(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              {selectedBlog?.comments?.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedBlog.comments.map((comment, index) => (
                    <div key={index} className="p-4">
                      <div className="flex space-x-3">
                        <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500">
                          {comment.userName?.charAt(0) || 'U'}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {comment.userName}
                            </span>
                            <Chip 
                              label={comment.userRole} 
                              size="small" 
                              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {comment.formattedDate}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h4 className="mt-3 text-gray-600 dark:text-gray-300">No comments yet</h4>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                    Be the first to share your thoughts
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
          
          <DialogActions className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex w-full space-x-2">
              <Avatar className="h-10 w-10">
                {user?.name?.charAt(0) || user?.organizationName?.charAt(0) || 'U'}
              </Avatar>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg"
                InputProps={{
                  className: "bg-transparent"
                }}
              />
              <Button
                variant="contained"
                className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-none hover:shadow-md transition-all"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                Post
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
  );
}

export default BlogFeed;