import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import HeroSection from '../../components/heroSection/HeroSection'
import BlogPostCard from '../../components/blogPostCard/BlogPostCard'
import PlusButton from '../../components/plusButton/PlusButton';
import CreateDonation from '../../components/createDonation/CreateDonation';
import ImageCarousel from '../../components/imageCarousel/ImageCarousel';
import SearchButton from '../../components/searchButton/SearchButton';

export default function Home() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role;
  const [open, setOpen] = useState(false);
  
  // Sample slides data for the carousel
  const slides = [
    {
      url: 'https://i.imgur.com/3Gv1fGW.jpg',
      title: 'Fresh Food For Everyone',
      description: 'Join us in reducing food waste and fighting hunger in your community.',
      buttonText: 'Donate Now'
    },
    {
      url: 'https://i.imgur.com/3OHS2xi.png',
      title: 'Zero Hunger Initiative',
      description: 'Connecting surplus food with those who need it most.',
      buttonText: 'Learn More'
    },
    {
      url: 'https://i.imgur.com/to09FoS.jpg',
      title: 'Be Part of the Solution',
      description: 'Your small contribution can make a big difference in someone\'s life.',
      buttonText: 'Get Involved'
    },
    {
      url: 'https://i.imgur.com/mjj34Ue.jpg',
      title: 'Healthy Meals, Happy Lives',
      description: 'We ensure nutritious meals reach families in need across our community.',
      buttonText: 'Volunteer Today'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      {/* Image Carousel Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ImageCarousel slides={slides} />
        </div>
      </section>
      <BlogPostCard/>
      
      {/* Action Buttons based on User Role */}
      <div className="fixed bottom-8 right-8 z-50">
        {userRole === "provider" && (
          <>
            <PlusButton onClick={() => setOpen(true)} />
            <CreateDonation open={open} setOpen={setOpen} />
          </>
        )}
        {userRole === "distributor" && (
          <>
            <SearchButton onClick={() => setSearchOpen(true)} />
            {/* You'll need to create a SearchModal component similar to CreateDonation */}
            {/* <SearchModal open={searchOpen} setOpen={setSearchOpen} /> */}
          </>
        )}
      </div>
    </Layout>
  )
}