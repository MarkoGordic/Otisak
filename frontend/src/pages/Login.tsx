import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../global/AxiosInstance";
import FormButton from "../components/FormButton";

function Login () {

    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [passwordReset, setPasswordReset] = useState(false);

    const toggleEmailFocus = () => {
        setEmailFocus(!emailFocus);
    }

    const togglePasswordFocus = () => {
        setPasswordFocus(!passwordFocus);
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    const togglePasswordReset = () => {
        setPasswordReset(!passwordReset);
    }

    const SubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await axiosInstance.post("/auth/login", { email, password });
            const token = response.data.token;
            localStorage.setItem("token", token);
            alert("Successful login");  // TODO: navigate to home page
        } catch(error: any) {
            if(error?.status === 401) {
                alert("Wrong credentials"); // TODO: add custom message (toast)
            } else {
                console.log("Error: ", error);
            }
        } finally {
            setIsLoading(false);
            setEmail("");
            setPassword("");
        }
    }

    const SubmitPasswordReset = () => {
        // TODO: add logic
    }

    return (
        <div className="flex flex-row w-full text-base text-white">
            <div className="relative h-screen w-2/3 lg:w-2/3 md:w-1/2 hidden sm:flex">                
                <div 
                    className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-50 blur-sm"
                    style={{ backgroundImage: "url('/img/bg-login.png')" }}
                ></div>
                
                
                <div className="relative z-10 bg-transparent flex flex-col items-center justify-center mx-auto">
                    <img className="mx-auto scale-150" src="/img/logo.png" />
                    <p className="mt-16 text-2xl text-center">
                        {t("copyright")}
                    </p>
                    <p className="text-white opacity-60">
                        Designed by Simenesky
                    </p>
                </div>
            </div>

            <div className="flex h-screen-dhv justify-between bg-black w-full lg:w-1/3 md:w-1/2 sm:w-full">
                <div className="flex w-full items-center justify-center">
                    <form onSubmit={passwordReset ? SubmitPasswordReset : SubmitLogin} method="post">                    
                        <img className="mx-auto" src="/img/logo.png" />

                        <h1 className="mt-3 text-center text-5xl text-white uppercase tracking-widest">
                            {t("sat")}
                        </h1>
                        <p className="mt-3 text-center text-grey uppercase tracking-[0.3em]">
                            - {t("login.examinationPlatform")} -
                        </p>

                        <div className="flex flex-row mt-16 gap-1 p-1 border-b-2 border-b-grey focus-within:border-b-blue">
                            <FontAwesomeIcon 
                                icon={faEnvelope} 
                                color={emailFocus ? "#2C57F3" : "#525364"} 
                                size="lg"
                                className="flex items-center justify-self-center align-middle mx-1 my-auto" 
                            />
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder={t("login.username")} 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={toggleEmailFocus} 
                                onBlur={toggleEmailFocus}  
                                required
                                className="w-full h-6 p-2 border-none outline-none bg-transparent placeholder:text-grey"
                            />                        
                        </div>

                        {!passwordReset && (
                            <div className="flex flex-row mt-6 gap-1 p-1 border-b-2 border-b-grey focus-within:border-b-blue">
                                <FontAwesomeIcon 
                                    icon={faKey} 
                                    color={passwordFocus ? "#2C57F3" : "#525364"} 
                                    size="lg"
                                    className="flex items-center justify-self-center align-middle mx-1 my-auto" 
                                />
                                <input 
                                    type={isPasswordVisible ? "text" : "password"} 
                                    id="password" 
                                    name="password" 
                                    placeholder={t("login.password")} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={togglePasswordFocus} 
                                    onBlur={togglePasswordFocus}  
                                    required
                                    className="w-full h-6 p-2 border-none outline-none bg-transparent placeholder:text-grey"
                                />
                                <FontAwesomeIcon 
                                    icon={isPasswordVisible ? faEyeSlash : faEye} 
                                    color="#525364"
                                    size="1x"
                                    onClick={togglePasswordVisibility}
                                    className="flex items-center justify-self-center align-middle mx-1 my-auto cursor-pointer hover:scale-110 transform transition duration-300" 
                                />
                            </div>
                        )}    

                        <FormButton 
                            title={passwordReset ? t("login.askForPasswordReset") : t("login.login")} 
                            isLoading={isLoading}
                        />                 

                        {passwordReset ? (
                            <div onClick={togglePasswordReset} className="px-1 border-grey text-center text-grey cursor-pointer hover:text-blue transform transition duration-300">
                                <FontAwesomeIcon icon={faArrowLeft} className="align-middle hover:text-blue" />
                                <span className="ml-2 align-middle font-extrabold">
                                    {t("login.backToLogin")}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-row w-full justify-center text-center m-0 text-grey">
                                <div>
                                    {t("login.forgotPassword")}
                                </div>
                                <div onClick={togglePasswordReset} className="ml-1 text-blue no-underline cursor-pointer"> 
                                    {t("login.askForReset")}
                                </div>
                            </div> 
                        )}
                        

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;