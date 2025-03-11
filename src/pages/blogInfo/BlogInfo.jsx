import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext';
import { useParams } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/loader/Loader';

function BlogInfo() {
  const context = useContext(myContext);
  const { mode, setloading, loading } = context;

  const params = useParams()

  //* getBlogs State 
  const [getBlogs, setGetBlogs] = useState();

  const getAllBlogs = async () => {
    setloading(true);
    try {
      const productTemp = await getDoc(doc(fireDb, "blogPost", params.id))
      if (productTemp.exists()) {
        setGetBlogs(productTemp.data());
      } else {
        console.log("Document does not exist")
      }
      setloading(false)
    } catch (error) {
      console.log(error)
      setloading(false)
    }
  }

  // console.log(getBlogs)

  useEffect(() => {
    getAllBlogs();
    window.scrollTo(0, 0)
  }, []);


  //* Create markup function 
  function createMarkup(c) {
    return { __html: c };
  }


  return (
    <Layout>
      <section className="rounded-lg h-full overflow-hidden max-w-4xl mx-auto px-4 ">
        <div className=" py-4 lg:py-8">
          {loading ?
            <Loader />
            :
            <div >
                {/* Thumbnail  */}
                <img alt="content" className="mb-3 rounded-lg h-full w-full"
                  src={getBlogs?.thumbnail}
                />
                {/* title And date  */}
                <div className="flex justify-between items-center mb-3">
                  <h1 style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    className=' text-xl md:text-2xl lg:text-2xl font-semibold'>
                    {getBlogs?.blogs?.title}
                  </h1>
                  <p style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                    {getBlogs?.date}
                  </p>
                </div>
                <div
                  className={`border-b mb-5 ${mode === 'dark' ?
                        'border-gray-600' : 'border-gray-400'}`}
                />

                {/* blog Content  */}
                <div className="content">
                <p className={`text-lg ${mode === 'dark' ? 'text-[#7efff5]' : 'text-black'}`}>
                  {getBlogs?.blogs?.content}
                </p>
              </div>

            </div>
          }

        </div>
      </section>
    </Layout>
  )
}

export default BlogInfo



{/* <div className="content">
                <p className={`text-lg ${mode === 'dark' ? 'text-[#7efff5]' : 'text-black'}`}>
                  {blog.content}
                </p>
              </div> */}