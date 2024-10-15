import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { LoginThunk, selectUserInfo, LoginState } from "../../redux/reducers/userReducer";
import { Eye, EyeSlash, ArrowRepeat, CheckLg } from "react-bootstrap-icons";
import CenterLayout from "../../layouts/CenterLayout";

const emptyString = "";

function LoginPage({}) {
    const [userName, setUserName] = useState<string>(emptyString);
    const [password, setPassword] = useState<string>(emptyString);
    const [loginError, setLoginError] = useState<string>(emptyString);
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const { loginState, error } = useAppSelector(selectUserInfo);

    const onButtonClick = () => {
        setLoginError(emptyString);
        if(!userName) {
            setLoginError("Missing Username");
            return;
        }

        if(!password) {
            setLoginError("Missing Password");
            return;
        }

        if(userName.length < 6) {
            setLoginError("Username is too short");
            return;
        }

        if(password.length < 8) {
            setLoginError("Password is too short");
            return;
        }

        dispatch(LoginThunk({
            Username: userName,
            Password: password
        }))
    }

    const onInputChange = (callback: React.Dispatch<React.SetStateAction<string>>) => (e: React.FormEvent<HTMLInputElement>) => {
        callback(e.currentTarget.value);
    }
    
    const onHidePasswordChange = (value: boolean) => setHidePassword(value);

    return (
        <CenterLayout>
            <div className="text-center text-white bg-red-500">{error ?? loginError ?? emptyString}</div>
            <div className="w-full h-full text-xl">
                <h1 className="text-center text-2xl mb-2">Login</h1>
                <div className="text-center w-[calc(100%-1rem)] mx-2 mb-2 border-black border-solid border-2 rounded-xl">
                    <input type="text" className="w-full p-2 bg-transparent rounded-lg" placeholder="Username" onChange={onInputChange(setUserName)} value={userName} required/>
                </div>
                <div className="w-[calc(100%-1rem)] mx-2 mb-2 border-black border-solid border-2 rounded-xl relative">
                    <input type={hidePassword ? "password" : "text"} className="w-[calc(100%-2.5rem)] p-2 bg-transparent rounded-lg" placeholder="Password" onChange={onInputChange(setPassword)} value={password} required/>
                    {
                        hidePassword ? 
                        <EyeSlash size={24} className="absolute bottom-[calc(50%-0.75rem)] right-2 cursor-pointer" onClick={() => onHidePasswordChange(!hidePassword)}/> :
                        <Eye size={24} className="absolute bottom-[calc(50%-0.75rem)] right-2 cursor-pointer" onClick={() => onHidePasswordChange(!hidePassword)}/>
                    }
                </div>
                <div className="text-center">
                    <button className="border-2 border-black border-solid min-w-12 min-h-7" onClick={() => onButtonClick()}>
                        {loginState === LoginState.Loading ? <ArrowRepeat size={26} className="animate-spin w-full"/> : <CheckLg size={26} className="w-full"/> }
                    </button>
                </div>
            </div>
        </CenterLayout> 
    )
}

export default LoginPage;