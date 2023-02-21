import { useState } from "react"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import OAuth from "../components/OAuth"
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn() {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	// Destructing the formData object so we can call email and password directly.
	const {email, password} = formData

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

			const userCredential = await signInWithEmailAndPassword(auth, email, password)

			if (userCredential.user) {
				navigate('/')
			}
		} catch (error) {
			toast.error('Bad User Credentials')
		}
	}

	return (
		<>
			<div className="pageContainer">
				<div className="formContainer">
					<form onSubmit={onSubmit}>
						{/* Alltech Logo */}
						<img src="https://d3cy9zhslanhfa.cloudfront.net/media/6B81083F-46B8-4043-8A0EB4A5ACCFFCB6/9EBC465C-1BE4-4377-AB6A6615998B020F/webimage-61FA9291-D4BE-486D-B10BCAD9C5A5D5F5.png" alt="logo" className="logo" />

						{/* Email Input */}
						<div className="emailInputDiv">	
							<input
								type='email'
								className='emailInput'
								placeholder='Email'
								id='email'
								value={email}
								onChange={onChange}
							/>
						</div>

						{/* Password Input */}
						<div className='passwordInputDiv'>
							<input
								type={showPassword ? 'text' : 'password'}
								className='passwordInput'
								placeholder='Password'
								id='password'
								value={password}
								onChange={onChange}
							/>
							{/* Password visability icon */}
							<img
								src={visibilityIcon}
								alt='show password'
								className='showPassword'
								onClick={() => setShowPassword((prevState) => !prevState)}
							/>
						</div>

						{/* Forgot Password Link */}
						<Link to="/forgot-password" 
						className="forgotPasswordLink">
								Forgot Password?
						</Link>

						{/* Sign in Button */}
						<div className="signInBar">
							<p className="signInText">Sign In</p>
							<button className="signInButton">
								<ArrowRightIcon fill='#ffffff' width='34px' />
							</button>
						</div>
					</form>

					<OAuth />

					<Link to="/sign-up" className="registerLink">
						Sign Up Instead
					</Link>
				</div>
			</div>
		</>
	)
}

export default SignIn