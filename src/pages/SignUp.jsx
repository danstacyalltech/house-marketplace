import { useState } from "react"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import OAuth from "../components/OAuth"
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	})
	// Destructing the formData object so we can call email and password directly.
	const {name, email, password} = formData

	const navigate = useNavigate()

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			// Since both the email and password will be using this onChange function, we need to use the id of the input to determine which value to update. Using e.target.id will will dentify which input to change. Writing the onChange like this allows us to use it in any input we want.
			[e.target.id]: e.target.value
		}))
	}

	const onSubmit = async (e) => {
		e.preventDefault()

		try {
			const auth = getAuth()
			// the createUserWithEmailAndPassword function registers the user and then returns a promise, so we need to use await to wait for the promise to resolve. We then save the user creditals in a variable called userCredential.
			const userCredential = await createUserWithEmailAndPassword(auth, email, password)
			// We then save the user object in a variable called user.
			const user = userCredential.user
			// We then use the updateProfile function to update the user's display name.
			updateProfile(auth.currentUser, {
				displayName: name
			})

			// We dont want to change the formData state, so we create a copy of the formData object and delete the password property from it.
			const formDataCopy = {...formData}
			// We do not want to save the password in the database, so we delete it from the formDataCopy object.
			delete formDataCopy.password
			// We then add a timestamp property to the formDataCopy object.
			formDataCopy.timestamp = serverTimestamp()

			// We then use the setDoc function to save the formDataCopy object to the database. 
			await setDoc(doc(db, 'users', user.uid), formDataCopy)

			// We then navigate back to the home page using the navigate function from react-router-dom.
			navigate('/')
		} catch (error) {
			toast.error('Ah Shit, Something Went Wrong.')
		}
	}

	return (
		<>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Welcome Back!</p>
				</header>

				<form onSubmit={onSubmit}>
					<input
            type='text'
            className='nameInput'
            placeholder='Name'
            id='name'
            value={name}
            onChange={onChange}
          />
					<input
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />

					<div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />

						<img
              src={visibilityIcon}
              alt='show password'
              className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
					</div>

					<Link to="/forgot-password" 
					className="forgotPasswordLink">
							Forgot Password?
					</Link>

					<div className="signUpBar">
						<p className="signUpText">Sign Up</p>
						<button className="signUpButton">
							<ArrowRightIcon fill='#ffffff' width='34px' />
						</button>
					</div>
				</form>

				<OAuth />

				<Link to="/sign-in" className="registerLink">
					Sign In Instead
				</Link>
			</div>
		</>
	)
}

export default SignUp