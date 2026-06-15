import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/appStore.js'
import { ThemeProvider } from "./utils/context/ThemeContext.jsx"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</Provider>
	</StrictMode>,
)
