import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'


function Listing() {
	// set the state
	const [listing, setListing] = useState(null)
	const [loading, setLoading] = useState(true)
	const [shareLinkCopied, setShareLinkCopied] = useState(false)
	
	// initialize hooks
	const navigate = useNavigate()
	const params = useParams()
	const auth = getAuth()
	
	// useEffect is where we will doing the actual fetching of the data
	useEffect(() => {
		const fetchListing = async () => {
			// First we need a reference to the document
			const docRef = doc(db, 'listings', params.listingId)
			// then we need a snapshot of that reference
			const docSnap = await getDoc(docRef)
			// Check to see if the doc exists
			if (docSnap.exists()) {
				console.log(docSnap.data())
				setListing(docSnap.data())
				setLoading(false)
			}
		}
		fetchListing()
	}, [navigate, params.listingId])

	if(loading) {
		return <Spinner />
	}
	
	return (
		<main>
		{/* Swiper is how we display the slideshow. It is like tailwind */}
		<Swiper 
			modules={[Navigation, Pagination, Scrollbar, A11y]} 
			slidesPerView={1}
			spaceBetween={50}
			navigation 
			pagination={{ clickable: true }}
			scrollbar={{ draggable: true }}
			onSwiper={(swiper) => console.log(swiper)}
			onSlideChange={() => console.log('slide change')}
		>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

			{/* This is the share icon. When you click you get a message that says 'link copied', then the message disappears after 2 secs. */}
				<div
					className='shareIconDiv'
					onClick={() => {
						navigator.clipboard.writeText(window.location.href)
						setShareLinkCopied(true)
						setTimeout(() => {
							setShareLinkCopied(false)
						}, 2000)
					}}
				>
					<img src={shareIcon} alt='' />
				</div>
				
				{/* If shareLinkCopied is true, display "Link Copied!" */}
				{shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

				{/* This is where we will display the listing details */}
				<div className='listingDetails'>
					<p className='listingName'>
						{/* Show the listing name */}
						{listing.name} - $
						{/* Display the price. If the listing has an offer, display the discounted price, otherwise display the regular price. */}
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					</p>
					{/* Display the location/address */}
					<p className='listingLocation'>{listing.location}</p>
					{/* Rent or for sell */}
					<p className='listingType'>
						For {listing.type === 'rent' ? 'Rent' : 'Sale'}
					</p>
					{listing.offer && (
						<p className='discountPrice'>
							{/* Display to the user how much they are saving by subtracting the discounted price from the regular price */}
							${listing.regularPrice - listing.discountedPrice} discount
						</p>
					)}

					<ul className='listingDetailsList'>
						<li>
							{/* List the bedrooms. Check to ssee if there are more than one bedroom. */}
							{listing.bedrooms > 1
								? `${listing.bedrooms} Bedrooms`
								: '1 Bedroom'}
						</li>
						<li>
							{/* List the bathrooms. Check to ssee if there are more than one bathroom. */}
							{listing.bathrooms > 1
								? `${listing.bathrooms} Bathrooms`
								: '1 Bathroom'}
						</li>
						{/* Check to see if there is parking. */}
						<li>{listing.parking && 'Parking Spot'}</li>
						{/* Check to see if it is furnished */}
						<li>{listing.furnished && 'Furnished'}</li>
					</ul>

					{/* This is the heading for the map */}
					<p className='listingLocationTitle'>Location</p>

					<div className='leafletContainer'>
						<MapContainer
							style={{ height: '100%', width: '100%' }}
							center={[listing.geolocation.lat, listing.geolocation.lng]}
							zoom={13}
							scrollWheelZoom={false}
						>
							{/* This is the little tile in the corner of the map. you have to have to make the map work. Apparently there is a paid version where you do not have to have this. */}
							<TileLayer
								attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
								url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
							/>

							<Marker
								position={[listing.geolocation.lat, listing.geolocation.lng]}
							>
								{/* When you click on the marker, a popup will appear with the address. */}
								<Popup>{listing.location}</Popup>
							</Marker>
						</MapContainer>
					</div>

					{/* Contact the landlord button */}
					{auth.currentUser?.uid !== listing.userRef && (
						<Link
							to={`/contact/${listing.userRef}?listingName=${listing.name}`}
							className='primaryButton'
						>
							Contact Landlord
						</Link>
					)}
				</div>
		</main>
	)
}

export default Listing