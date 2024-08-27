import { useState } from "react";
import CenterLayout from "../../layouts/Center";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import { selectUserInfo, LoginState, Signup } from "../../redux/reducers/userReducer";
import { Eye, EyeSlash, ArrowRepeat, CheckLg } from "react-bootstrap-icons";

const emptyString = "";

function SignupPage({}) {
    const [signUpError, setSignUpError] = useState<string>(emptyString);
    const [userName, setUserName] = useState<string>(emptyString);
    const [email, setEmail] = useState<string>(emptyString);
    const [password, setPassword] = useState<string>(emptyString);
    const [retypePassword, setRetypePassword] = useState<string>(emptyString);
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const { loginState, error } = useAppSelector(selectUserInfo);
    const dispatch = useAppDispatch();

    const onInputChange = (callback: React.Dispatch<React.SetStateAction<string>>) => (e: React.FormEvent<HTMLInputElement>) => {
        callback(e.currentTarget.value);
    }

    const onHidePasswordChange = (value: boolean) => setHidePassword(value);

    const onButtonClick = () => {
        setSignUpError(emptyString);
        
        if(!userName) {
            setSignUpError("Missing Username");
            return;
        }

        if(!email) {
            setSignUpError("Missing Email");
            return;
        }

        if(!password) {
            setSignUpError("Missing Password");
            return;
        }

        if(!retypePassword) {
            setSignUpError("Missing Retype Password");
            return;
        }

        if(retypePassword !== password) {
            setSignUpError("Incorrect retype password");
            return;
        }

        dispatch(Signup({
            Email: email,
            UserName: userName,
            Password: password
        }))
    }

    return (
        <CenterLayout>
            <div className="text-center text-white bg-red-500">{error ?? signUpError ?? emptyString}</div>
            <div className="w-full h-full text-xl">
                <div className="text-center text-2xl mb-2">Sign Up</div>
                <div className="text-center w-[calc(100%-1rem)] mx-2 mb-2 border-black border-solid border-2 rounded-xl">
                    <input type="text" className="w-full p-2 bg-transparent rounded-lg" placeholder="Username" onChange={onInputChange(setUserName)} value={userName} required/>
                </div>
                <div className="text-center w-[calc(100%-1rem)] mx-2 mb-2 border-black border-solid border-2 rounded-xl">
                    <input type="email" className="w-full p-2 bg-transparent rounded-lg" placeholder="Email" onChange={onInputChange(setEmail)} value={email} required/>
                </div>
                <div className="w-[calc(100%-1rem)] mx-2 mb-2 border-black border-solid border-2 rounded-xl relative">
                    <input type={hidePassword ? "password" : "text"} className="w-[calc(100%-2.5rem)] p-2 bg-transparent rounded-lg" placeholder="Password" onChange={onInputChange(setPassword)} value={password} required/>
                    {
                        hidePassword ? 
                        <EyeSlash size={24} className="absolute bottom-[calc(50%-0.75rem)] right-2 cursor-pointer" onClick={() => onHidePasswordChange(!hidePassword)}/> :
                        <Eye size={24} className="absolute bottom-[calc(50%-0.75rem)] right-2 cursor-pointer" onClick={() => onHidePasswordChange(!hidePassword)}/>
                    }
                </div>
                <div className="w-[calc(100%-1rem)] mx-2 mb-2 border-black border-solid border-2 rounded-xl relative">
                    <input type="password" className="w-full p-2 bg-transparent rounded-lg" placeholder="Retype Password" onChange={onInputChange(setRetypePassword)} value={retypePassword} required/>
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

export default SignupPage;