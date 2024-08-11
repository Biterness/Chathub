import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hook";
import { LoginState, selectUserInfo } from "../../../redux/reducers/userReducer";

const CheckLoginInfoWrapper = () => (CheckComponent: React.ComponentType) => {
    const { loginState } = useAppSelector(selectUserInfo);
    return loginState === LoginState.Loading ? <div>Loading</div> : loginState === LoginState.LoggedIn ? <CheckComponent /> : <Navigate to='/login'/>
}

export default CheckLoginInfoWrapper;