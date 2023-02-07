import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
	collection, 
	getDocs, 
	query, 
	where, 
	orderBy, 
	limit,
	startAfter, 
} from "firebase/firestore"
import { db } from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from "../components/Spinner"
import ListingItem from '../components/ListingItem'

function Category() {
	const [listings, setListings] = useState(null)
	const [loading, setLoading] = useState(true)
	const [lastFetchedListing, setLastFetchedListing] = useState(null)


	const params = useParams()

	useEffect(() => {
		// You cant use async/await in useEffect so we need to create a function and call it inside useEffect.
		const fetchListings = async () => {
			try {
				// Get reference to all of the listings
				const listingsRef = collection(db, "listings")

				// Create query of those listings sorting by rent or sell based on the params.
				const q = query(
					listingsRef, 
					// categoryName is what we call because in App.js we have a path of /category/:categoryName
					where('type', '==', params.categoryName), 
					orderBy('timestamp', 'desc'), 
					limit(1)
				)

				// Now we need to execute the query
				const querySnap = await getDocs(q)
				// querySnap is a snapshot of the data in the database. We create an empty array, and then we need to loop through it and get the data we want. Push then adds the data to the array.

				// this lets us load more listings if we click the load more button.
				const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)

				const listings = []

				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data()
					})
				})

				setListings(listings)
				setLoading(false)
			} catch (error) {
				toast.error('COULD NOT FETCH LISTINGS')
			}
		}

		fetchListings()
	}, [params.categoryName])

	// Pagination function to load more listings
	const onFetchMoreListings = async () => {
		try {
			// Get reference to all of the listings
			const listingsRef = collection(db, "listings")

			// Create query of those listings sorting by rent or sell based on the params.
			const q = query(
				listingsRef, 
				// categoryName is what we call because in App.js we have a path of /category/:categoryName
				where('type', '==', params.categoryName), 
				orderBy('timestamp', 'desc'),
				startAfter(lastFetchedListing),
				limit(10)
			)

			// Now we need to execute the query
			const querySnap = await getDocs(q)
			// querySnap is a snapshot of the data in the database. We create an empty array, and then we need to loop through it and get the data we want. Push then adds the data to the array.

			// this lets us load more listings if we click the load more button.
			const lastVisible = querySnap.docs[querySnap.docs.length - 1]
			setLastFetchedListing(lastVisible)

			const listings = []

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data()
				})
			})

			setListings((prevState) => [...prevState, ...listings])
			setLoading(false)
		} catch (error) {
			toast.error('COULD NOT FETCH LISTINGS')
		}
	}


	return (
		<div className="category">
			<header>
				<p className="pageHeader">
					{params.categoryName === 'rent' ? 'Places for Rent' : 'Places for Sale'}
				</p>
			</header>

			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
					<main>
						<ul className="categoryListings">
							{listings.map((listing) => (
								<ListingItem 
									listing={listing.data} 
									id={listing.id}
									key={listing.id}
								/>
							))}
						</ul>
					</main>

					<br />
					<br />
					{lastFetchedListing && (
            <p className='loadMore' onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
				</>
			) : (
			<p>No Listings for {params.categoryName}</p> 
			)}
		</div>
	)
}

export default Category