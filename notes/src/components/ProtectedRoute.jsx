import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const user = useSelector(state => state.user.loggedInUser);
	//console.log('ProtectedRoute user =', user);

  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;