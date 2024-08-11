import CenterLayout from "../Layouts/Center";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hook";
import { Login } from "../../redux/reducers/userReducer";

function LoginPage({}) {
    const [userName, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useAppDispatch();

    const onButtonClick = () => {
        dispatch(Login({
            UserName: userName,
            Password: password
        }))
    }

    const onInputChange = (callback: React.Dispatch<React.SetStateAction<string>>) => (e: React.FormEvent<HTMLInputElement>) => {
        callback(e.currentTarget.value);
    }

    return (
        <CenterLayout>
            <h1 className="text-center text-2xl mb-2">Login</h1>
            <div className="text-center w-[calc(100%-1rem)] mx-2 mb-2 border-black border-solid border-2 rounded-sm">
                <input type="text" className="w-full" placeholder="Username" onChange={() => onInputChange(setUsername)}/>
            </div>
            <div className="text-center w-[calc(100%-1rem)] mx-2 mb-2 border-black border-solid border-2 rounded-sm">
                <input type="password" className="w-full" placeholder="Password" onChange={() => onInputChange(setPassword)}/>
            </div>
            <div className="text-center">
                <button className="border-2 border-black border-solid min-w-12 min-h-7" onClick={() => onButtonClick()}>OK</button>
            </div>
        </CenterLayout>
    )
}

export default LoginPage;