import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import CheckLoginInfoWrapper from './pages/Components/CheckInfoWrapper';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  const CheckLoginInfoPage = () => CheckLoginInfoWrapper()(HomePage)
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CheckLoginInfoPage/>} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App