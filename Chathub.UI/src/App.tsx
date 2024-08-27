import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './redux/hook';
import { selectUserInfo, LoginState } from './redux/reducers/userReducer';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';

function App() {
  const { loginState } = useAppSelector(selectUserInfo);
  const CheckUserInfoMissing = (RenderPage: React.ComponentType) => loginState === LoginState.LoggedIn ? <RenderPage /> : <Navigate to="/login" />
  const CheckUserInfoExists = (RenderPage: React.ComponentType) => loginState !== LoginState.LoggedIn ? <RenderPage /> : <Navigate to="/" />
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={CheckUserInfoMissing(HomePage)} />
        <Route path="/login" element={CheckUserInfoExists(LoginPage)} />
        <Route path="/signup" element={CheckUserInfoExists(SignupPage)} />
      </Routes>
    </BrowserRouter>
  )
}

export default App