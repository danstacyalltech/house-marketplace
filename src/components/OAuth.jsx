import { useLocation, useNavigate} from "react-router-dom"
import {getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider} from "firebase/auth"
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore"
import {db} from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from "../assets/svg/googleIcon.svg"

function OAuth() {
	const navigate = useNavigate()
	const location = useLocation()

	// This is the login with Google function
	const onGoogleClick = async () => {
		try {
			const auth = getAuth()
			const provider = new GoogleAuthProvider()
			const result = await signInWithPopup(auth, provider)
			const user = result.user

			// Check for user in database
			const docRef = doc(db, "users", user.uid)
			const docSnap = await getDoc(docRef)

			// If the user does not exist in the database, create a new user
			if (!docSnap.exists()) {
				await setDoc(doc(db, "users", user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				})
			}
			navigate('/')
		} catch (error) {
			toast.error('Could not authorize with Google')
		}
	}

	// This is the same as the Google function, but with Microsoft
	const onMSClick = async () => {
		try {
			const auth = getAuth()
			const provider = new OAuthProvider('microsoft.com');
			const result = await signInWithPopup(auth, provider)
			const user = result.user

			// Check for user in database
			const docRef = doc(db, "users", user.uid)
			const docSnap = await getDoc(docRef)

			// If the user does not exist in the database, create a new user
			if (!docSnap.exists()) {
				await setDoc(doc(db, "users", user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				})
			}
			navigate('/')
		} catch (error) {
			toast.error('Could not authorize with Microsoft')
		}
	}

	return <div className="socialLogin">
	{/* Here we are using the pathname to determine what the P tag will say */}
		<p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with Google</p>
		<button className="socialIconDiv" onClick={onGoogleClick}>
			<img className="socialIconImg" src={googleIcon} alt="google" />
		</button>

		<p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with Microsoft </p>
		<button className="socialIconDiv" onClick={onMSClick}>
			<img className="socialIconImg" src={`https://purepng.com/public/uploads/large/purepng.com-microsoft-logo-iconlogobrand-logoiconslogos-251519939091wmudn.png`} alt="microsoft" />
		</button>
	</div>
}

export default OAuth