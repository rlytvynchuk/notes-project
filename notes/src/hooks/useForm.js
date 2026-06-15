import { useState } from 'react';

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

	const validate = () => {
		const newErrors = {};
		Object.keys(values).forEach(key => {
			if (!values[key]) {
				newErrors[key] = `Field "${key}" is required`;
			}

			if (key === 'email' && values[key]) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(values[key])) {
					newErrors[key] = 'Please enter a valid email address';
				}
			}

			if (key === 'password' && values[key]) {
				if (values[key].length < 6) {
					newErrors[key] = 'Password must be at least 6 characters long';
				}
			}
		});

		if (values.password && values.confirmPassword
				&& values.password !== values.confirmPassword)
		{
			newErrors.confirmPassword = 'Passwords do not match';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
  
  const handleSubmit = (callback) => (e) => {
    e.preventDefault();

		// validation
		if (!validate()) return;
    
		callback(values);
  };
  
  return { values, errors, handleChange, handleSubmit };
}