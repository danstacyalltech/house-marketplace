import { useState, useEffect } from "react"
import { getAuth, updateProfile } from "firebase/auth"
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore'
import { db } from "../firebase.config"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import ListingItem from "../components/ListingItem"
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"


function Profile() {
	const auth = getAuth()
	const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
	const [changeDetails, setChangeDetails] = useState(false)
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	})

	const { name, email } = formData

	const navigate = useNavigate()

	useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

			// create a query to get the listings
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

			// execute the query
      const querySnap = await getDocs(q)

			// create an array to store the listings
      let listings = []

			// loop through the query and push the data to the array
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

			// set the listings to the state
      setListings(listings)
			// set loading to false
      setLoading(false)
    }

		// call the function
    fetchUserListings()
  }, [auth.currentUser.uid])

	const onLogout = () => {
		auth.signOut()
		navigate("/")
	}
  console.log("here is the user in auth", auth)

	const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

	return (
		<div className="profile">
			<header className="profileHeader">
				<p className="pageHeader">My Profile</p>
				<button 
					type="button" 
					className="logOut" 
					onClick={onLogout}
					>Log Out
				</button>
			</header>

			<main>
				<div className="profileDetailsHeader">
					<p className="profileDetailsText">Personal Details</p>
					<p className="changePersonalDetails" onClick={() => {
						changeDetails && onSubmit()
						setChangeDetails((prevState) => !prevState)
					}}>
						{changeDetails ? 'done' : 'change'}
					</p>
				</div>

				<div className="profileCard">
					<form>
						<input 
							type='text'
							id="name"
							// Here we are setting the className based on the state of changeDetails. If changeDetails is true, then we want to show the input field as active, else we want to show it as inactive.
							className={!changeDetails ? 'profileName' : 'profileNameActive'}
							disabled={!changeDetails}
							value={name}
							onChange={onChange}
						/>
						<input 
							type='text'
							id="email"
							// Here we are setting the className based on the state of changeDetails. If changeDetails is true, then we want to show the input field as active, else we want to show it as inactive.
							className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
							disabled={!changeDetails}
							value={email}
							onChange={onChange}
						/>
					</form>
				</div>

				<Link to='/create-listing' className="createListing" >
					<img src={homeIcon} alt="home" />
					<p>Sell or Rent Your Home</p>
					<img src={arrowRight} alt="arrow right" />
				</Link>

				{!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
			</main>
		</div>
	)
}

export default Profile