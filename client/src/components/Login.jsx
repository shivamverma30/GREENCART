import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import api from '../utils/api';
import {
    isRequired,
    isStrongPassword,
    isValidEmail,
    sanitizeInput,
} from '../utils/validation';

const Login = () => {
    const {setShowUserLogin,setUser,navigate} = useAppContext()
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [touched, setTouched] = React.useState({});
    const [submitAttempted, setSubmitAttempted] = React.useState(false);

    const errors = React.useMemo(() => {
        const nextErrors = {};

        if (state === 'register' && !isRequired(name)) {
            nextErrors.name = 'Name is required';
        }

        if (!isRequired(email)) {
            nextErrors.email = 'Email is required';
        } else if (!isValidEmail(email)) {
            nextErrors.email = 'Please enter a valid email address';
        }

        if (!isRequired(password)) {
            nextErrors.password = 'Password is required';
        } else if (state === 'register' && !isStrongPassword(password)) {
            nextErrors.password = 'Password must contain uppercase, lowercase, number and special character.';
        }

        if (state === 'register') {
            if (!isRequired(confirmPassword)) {
                nextErrors.confirmPassword = 'Confirm password is required';
            } else if (sanitizeInput(confirmPassword) !== sanitizeInput(password)) {
                nextErrors.confirmPassword = 'Passwords do not match';
            }
        }

        return nextErrors;
    }, [state, name, email, password, confirmPassword]);

    const isFormValid = Object.keys(errors).length === 0;

    const markTouched = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const inputClass = (field) => {
        const showError = Boolean(errors[field]) && (submitAttempted || touched[field]);
        return `border rounded w-full p-2 mt-1 ${showError ? 'border-red-500 bg-red-50' : 'border-gray-200'} outline-primary`;
    };


    const onSubmitHandler =  async(event)=>{
        try {
        event.preventDefault();
        setSubmitAttempted(true);

        if (!isFormValid) {
            toast.error('Please fix form errors before submitting');
            return;
        }

        const payload = {
            email: sanitizeInput(email),
            password: sanitizeInput(password),
        };

        if (state === 'register') {
            payload.name = sanitizeInput(name);
            payload.confirmPassword = sanitizeInput(confirmPassword);
        }

        const {data}= await api.post(`/api/user/${state}`,{
            ...payload,
        });
        if (data.success) {
            localStorage.setItem("token", "authenticated")
            navigate('/')
            setUser(data.user)
            setShowUserLogin(false)
            setSubmitAttempted(false)
        } else {
            toast.error(data.message)
        }
        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <div onClick={()=>setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
        <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => markTouched('name')}
                        value={name}
                        placeholder="type here"
                        className={inputClass('name')}
                        type="text"
                        required
                    />
                    {errors.name && (submitAttempted || touched.name) && (
                        <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched('email')}
                    value={email}
                    placeholder="type here"
                    className={inputClass('email')}
                    type="email"
                    required
                />
                {errors.email && (submitAttempted || touched.email) && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => markTouched('password')}
                    value={password}
                    placeholder="type here"
                    className={inputClass('password')}
                    type="password"
                    required
                />
                {errors.password && (submitAttempted || touched.password) && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
            </div>
            {state === 'register' && (
                <div className="w-full ">
                    <p>Confirm Password</p>
                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => markTouched('confirmPassword')}
                        value={confirmPassword}
                        placeholder="re-enter password"
                        className={inputClass('confirmPassword')}
                        type="password"
                        required
                    />
                    {errors.confirmPassword && (submitAttempted || touched.confirmPassword) && (
                        <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>
            )}
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <button
                disabled={!isFormValid}
                className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
        </div>
    );
};

export default Login
