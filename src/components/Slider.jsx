import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import Spinner from './Spinner'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState(null)

	const navigate = useNavigate()

	// useEffect will fetch the listings from the database and set them to the listings state.
	useEffect(() => {
		// create a function called fetchListings and make it async so we can use await.
    const fetchListings = async () => {
			// Get reference to all of the listings
      const listingsRef = collection(db, 'listings')
			// Create query of those listings sorting by rent or sell based on the params.
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
			// Now we need to execute the query
      const querySnap = await getDocs(q)

      let listings = []

			// Loop through the listings and push a object with the id and data to the listings array.
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchListings()
  }, [])

	if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>
  }

	return (
    listings && (
      <>
        <p className='exploreHeading'>Recommended</p>

        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='swiperSlideDiv'
              >
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'>
                  ${data.discountedPrice ?? data.regularPrice}{' '}
                  {data.type === 'rent' && '/ month'}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider