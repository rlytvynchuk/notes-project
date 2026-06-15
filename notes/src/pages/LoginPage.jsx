
import { useState } from 'react';
import Header from '../components/Header'
import ErrorsList from '../components/form/ErrorsList.jsx';
import { useForm } from '../hooks/useForm.js';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logInUser } from '../store/userSlice.js';

import { IconLogin } from '../assets/svg-icons.jsx';
import Spinner from '../components/Spinner.jsx';
import './LoginPage.css';

function LoginPage() {

	const [signInErrors, setSignInErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const { values, errors, handleChange, handleSubmit } = useForm({
		email: '',
		password: ''
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onLogin = async (formData) => {
		setIsLoading(true);

		const result = await dispatch(logInUser(formData));

		setIsLoading(false);

		if (result?.payload?.user) {
			navigate('/');
		}

		if (result?.payload?.error) {
			setSignInErrors({ login: `${result.payload.error}` });
		}
	};

	const formErrors = Object.keys(errors).length ? errors : signInErrors;

	return (
		<>
			<Header />
			<div className="page page-login">
				{isLoading && <Spinner />}
				{!isLoading && (
					<>
						<span className="icon">
							<IconLogin />
						</span>
						<h2>Login</h2>
						<form className="login-form" onSubmit={handleSubmit(onLogin)}>
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
								className={errors.password ? 'error' : ''}
								value={values.password}
								onChange={handleChange}
							/>
							<ErrorsList errors={formErrors} />
							<div className="buttons">
								<button type="submit" className="accent">Login</button>
								<p className="register-message">
									Don't have an account?&nbsp;
									<NavLink to="/signup">Sign Up</NavLink>
								</p>
							</div>
						</form>
					</>
				)}
			</div>
		</>
	)
}

export default LoginPage