import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import HeroSection from '../../components/heroSection/HeroSection'
import BlogPostCard from '../../components/blogPostCard/BlogPostCard'
import PlusButton from '../../components/plusButton/PlusButton';
import CreateDonation from '../../components/createDonation/CreateDonation';

export default function Home() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0)
}, [])
  return (
    <Layout>
      <HeroSection/>
      <BlogPostCard/>
      {(userRole==="provider") &&(
        <>
        {/* ✅ Plus Button to Open Modal */}
        <PlusButton onClick={() => setOpen(true)} />

        {/* ✅ Create Donation Modal */}
        <CreateDonation open={open} setOpen={setOpen} />
        </>
      )}
    </Layout>
  )
}