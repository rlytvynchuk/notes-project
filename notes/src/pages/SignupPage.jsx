
import { useState } from 'react';
import Header from '../components/Header'
import ErrorsList from '../components/form/ErrorsList.jsx';
import { useForm } from '../hooks/useForm.js';
import { NavLink, useNavigate } from 'react-router-dom';
import { signUpUser } from '../store/userSlice.js';
import { useDispatch } from 'react-redux';

import { IconSignup } from '../assets/svg-icons.jsx';
import Spinner from '../components/Spinner.jsx';
import './LoginPage.css';

function SignupPage() {
	const [isLoading, setIsLoading] = useState(false);
	const { values, errors, handleChange, handleSubmit } = useForm({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSignup = async (formData) => {
		//console.log(formData);
		setIsLoading(true);

		const result = await dispatch(signUpUser(formData));
		setIsLoading(false);
		if (result && result.payload.user) {
			navigate('/');
		}

	};

	return (
		<>
			<Header />
			<div className="page page-login">
				{isLoading && <Spinner />}
				{!isLoading && (
					<>
						<span className="icon">
							<IconSignup />
						</span>
						<h2>Sign Up</h2>
						<form className="login-form" onSubmit={handleSubmit(onSignup)}>
							<input
								type="name"
								placeholder="Name"
								name="name"
								className={errors.name ? 'error' : ''}
								value={values.name}
								onChange={handleChange}
							/>
							<input
								type="email"
								placeholder="Email"
								name="email"
								className={errors.email ? 'error' : ''}
								value={values.email}
								onChange={handleChange}
							/>
							<input
								type="password"
								placeholder="Password"
								name="password"
								className={errors.password || errors.confirmPassword ? 'error' : ''}
								value={values.password}
								onChange={handleChange}
							/>
							<input
								type="password"
								placeholder="Confirm Password"
								name="confirmPassword"
								className={errors.confirmPassword ? 'error' : ''}
								value={values.confirmPassword}
								onChange={handleChange}
							/>
							<ErrorsList errors={errors} />
							<div className="buttons">
								<button type="submit" className="accent">Sign Up</button>
								<p className="register-message">
									Already have an account?&nbsp;
									<NavLink to="/login">Login</NavLink>
								</p>
							</div>
						</form>
					</>
				)}
			</div>
		</>
	)
}

export default SignupPage