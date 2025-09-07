import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';

// --- Reusable Constant for API URL ---
// This will use your live Render URL in production and localhost in development
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

// --- CSS Animations for Confetti & Dropdowns ---
const CustomStyles = () => (
    <style>{`
        @keyframes spray-1 { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(-50px, -70px) rotate(180deg); opacity: 0; } }
        @keyframes spray-2 { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(60px, -80px) rotate(-180deg); opacity: 0; } }
        @keyframes spray-3 { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(70px, -40px) rotate(90deg); opacity: 0; } }
        @keyframes spray-4 { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(-60px, -50px) rotate(-90deg); opacity: 0; } }
        @keyframes spray-5 { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(40px, -60px) rotate(120deg); opacity: 0; } }
        @keyframes spray-6 { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(-30px, -90px) rotate(-120deg); opacity: 0; } }
        .animate-spray-1 { animation: spray-1 0.8s ease-out forwards; } .animate-spray-2 { animation: spray-2 0.8s ease-out forwards; }
        .animate-spray-3 { animation: spray-3 0.8s ease-out forwards; } .animate-spray-4 { animation: spray-4 0.8s ease-out forwards; }
        .animate-spray-5 { animation: spray-5 0.8s ease-out forwards; } .animate-spray-6 { animation: spray-6 0.8s ease-out forwards; }

        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
            animation: fadeInDown 0.3s ease-out forwards;
        }
    `}</style>
);

// --- Reusable Icon Components ---
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const CartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const HeartIcon = ({ isFilled }) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.672l1.318-1.354a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const LeftArrowIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
const RightArrowIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);
const InstagramIcon = () => (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 3.808s-.012 2.741-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-3.808.06s-2.741-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-3.808s.012-2.741.06-3.808c.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM8.077 3.59A3.375 3.375 0 005.32 6.32a3.375 3.375 0 00-2.753 2.753C2.017 10.133 2 10.488 2 12.315s.017 2.182.067 3.233c.099 1.082.378 1.95.954 2.525a3.375 3.375 0 002.525.954c1.05.049 1.4.067 3.233.067s2.182-.017 3.233-.067a3.375 3.375 0 002.525-.954 3.375 3.375 0 00.954-2.525c.049-1.05.067-1.4.067-3.233s-.017-2.182-.067-3.233a3.375 3.375 0 00-.954-2.525 3.375 3.375 0 00-2.525-.954C14.497 3.607 14.142 3.59 12.315 3.59s-2.182.017-3.233.067zM12.315 7.75a4.566 4.566 0 100 9.132 4.566 4.566 0 000-9.132zm0 7.132a2.566 2.566 0 110-5.132 2.566 2.566 0 010 5.132z" clipRule="evenodd" /></svg>);
const FacebookIcon = () => (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>);
const YouTubeIcon = () => (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);

// --- NEW: Confetti Spray Component ---
const ConfettiSpray = ({ isActive }) => {
    if (!isActive) return null;
    const particles = [ { color: 'bg-red-500', animation: 'animate-spray-1' }, { color: 'bg-blue-500', animation: 'animate-spray-2' }, { color: 'bg-green-500', animation: 'animate-spray-3' }, { color: 'bg-yellow-500', animation: 'animate-spray-4' }, { color: 'bg-pink-500', animation: 'animate-spray-5' }, { color: 'bg-purple-500', animation: 'animate-spray-6' }, { color: 'bg-teal-500', animation: 'animate-spray-1' }, { color: 'bg-orange-500', animation: 'animate-spray-3' }, { color: 'bg-sky-500', animation: 'animate-spray-2' }, { color: 'bg-emerald-500', animation: 'animate-spray-4' }, { color: 'bg-rose-500', animation: 'animate-spray-5' }, { color: 'bg-indigo-500', animation: 'animate-spray-6' }, { color: 'bg-lime-500', animation: 'animate-spray-1' }, { color: 'bg-amber-500', animation: 'animate-spray-3' }, { color: 'bg-cyan-500', animation: 'animate-spray-4' }, ];
    return ( <div className="absolute inset-0 flex justify-center items-center pointer-events-none"> {particles.map((p, i) => (<div key={i} className={`absolute w-2 h-2 rounded-full ${p.color} ${p.animation}`} />))} </div> );
};

// --- App Structure Components ---
const LoginModal = ({ isOpen, onClose, onLoginSuccess, onForgotPasswordClick }) => {
    const [isRegisterView, setIsRegisterView] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    if (!isOpen) return null;
    const resetForm = () => { setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setError(''); };
    const handleViewSwitch = () => { resetForm(); setIsRegisterView(!isRegisterView); };
    const handleClose = () => { resetForm(); setIsRegisterView(false); onClose(); };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${backendUrl}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed.');
            onLoginSuccess(data);
            handleClose();
        } catch (err) { setError(err.message); }
    };
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
        try {
            const response = await fetch(`${backendUrl}/api/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }), });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed.');
            onLoginSuccess(data);
            handleClose();
        } catch (err) { setError(err.message); }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white/70 backdrop-blur-md border border-white/30 p-8 rounded-2xl shadow-lg w-full max-w-sm relative">
                <button onClick={handleClose} className="absolute top-3 right-3 text-gray-600 hover:text-black"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">{isRegisterView ? 'Create Account' : 'Login'}</h2>
                {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{error}</p>}
                <a href={`${backendUrl}/api/auth/google`} className="w-full flex items-center justify-center py-2.5 px-4 mb-4 border border-gray-400 rounded-lg shadow-sm text-sm font-medium text-gray-800 bg-white/80 hover:bg-white transition-colors">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><defs><path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></defs><clipPath id="b"><use xlinkHref="#a" overflow="visible"/></clipPath><path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z"/><path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/><path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/><path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/></svg>
                    Continue with Google
                </a>
                <div className="flex items-center my-2"><hr className="flex-grow border-t border-gray-400"/><span className="px-2 text-gray-600 text-sm">OR</span><hr className="flex-grow border-t border-gray-400"/></div>
                <form onSubmit={isRegisterView ? handleRegisterSubmit : handleLoginSubmit} className="space-y-4 pt-2">
                    {isRegisterView && (<div><label className="block text-gray-700 text-sm font-bold mb-2">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white/80 text-black placeholder-gray-500" placeholder="Enter your name" required /></div>)}
                    <div><label className="block text-gray-700 text-sm font-bold mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white/80 text-black placeholder-gray-500" placeholder="you@example.com" required /></div>
                    <div><label className="block text-gray-700 text-sm font-bold mb-2">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white/80 text-black placeholder-gray-500" placeholder="••••••••" required /></div>
                    {isRegisterView && (<div><label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white/80 text-black placeholder-gray-500" placeholder="••••••••" required /></div>)}
                    <div className="flex items-center justify-between text-sm"><label className="flex items-center text-gray-700"><input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500" /><span className="ml-2">Remember me</span></label><button type="button" onClick={onForgotPasswordClick} className="font-medium text-blue-600 hover:underline">Forgot Password?</button></div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">{isRegisterView ? 'Create Account' : 'Login'}</button>
                </form>
                <div className="mt-6 text-center text-sm"><button onClick={handleViewSwitch} className="text-gray-700 hover:text-black">{isRegisterView ? 'Already have an account? Login' : "Don't have an account? Register"}</button></div>
            </div>
        </div>
    );
};
const ForgotPasswordModal = ({ isOpen, onClose, onEmailSent }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await fetch(`${backendUrl}/api/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }), });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to send reset link.');
            setMessage(data.message);
            onEmailSent();
        } catch (err) { setError(err.message); }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Reset Password</h2>
                {message ? (<p className="text-green-600 text-center">{message}</p>) : (<form onSubmit={handleSubmit}><p className="text-sm text-gray-600 mb-4">Enter your email address and we will send you a link to reset your password.</p>{error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</p>}<div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div><button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Send Reset Link</button></form>)}
            </div>
        </div>
    );
};
const ProfileDropdown = ({ onLogout }) => {
    return (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 animate-fadeInDown">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
            <Link to="/saved-items" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved Items</Link>
            <button onClick={onLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
        </div>
    );
};
const Header = ({ currentUser, onLoginClick, onLogout }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
        const handler = setTimeout(() => {
            fetch(`${backendUrl}/api/suggestions?query=${searchQuery}`).then(res => res.json()).then(data => { if (Array.isArray(data)) { setSuggestions(data); if (data.length > 0) { setShowSuggestions(true); } } }).catch(err => console.error("Failed to fetch suggestions:", err));
        }, 300);
        return () => { clearTimeout(handler); };
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) { setShowSuggestions(false); } };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            setShowSuggestions(false);
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    };
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        navigate(`/search?query=${encodeURIComponent(suggestion)}`);
    };

    return (
        <header className="bg-gradient-to-r from-blue-50 to-indigo-100 shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 transition-transform duration-300 hover:scale-105">SRSTYLIEDEALS</Link>
                    <div className="hidden md:flex flex-grow max-w-xl mx-4 relative" ref={searchContainerRef}>
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }} placeholder="Search for products, outfits, or celebrities..." className="w-full py-2 pl-5 pr-12 text-gray-800 bg-white/80 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" autoComplete="off" />
                            <div className="absolute inset-y-0 right-0 flex items-center"><button type="submit" className="p-2 mr-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"><SearchIcon /></button></div>
                        </form>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden animate-fadeInDown">
                                <ul>{suggestions.map((item, index) => (<li key={index} onClick={() => handleSuggestionClick(item)} className="px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors text-gray-700">{item}</li>))}</ul>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {currentUser ? (
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 hover:scale-110"><UserIcon /><span className="ml-2 font-medium hidden sm:inline">{currentUser.name || currentUser.email.split('@')[0]}</span></button>
                                {isDropdownOpen && <ProfileDropdown onLogout={onLogout} />}
                            </div>
                        ) : (<button onClick={onLoginClick} className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">Login</button>)}
                        <Link to="/cart" className="flex items-center text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 hover:scale-110"><CartIcon /><span className="ml-1 font-medium hidden sm:inline">Cart</span></Link>
                    </div>
                </div>
            </div>
        </header>
    );
};
const SubNavigation = () => (
    <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-center md:justify-start space-x-4 md:space-x-8 py-2 overflow-x-auto whitespace-nowrap">
                <Link to="/products/men" className="text-gray-600 hover:text-blue-500 font-medium text-sm">Men</Link>
                <Link to="/products/women" className="text-gray-600 hover:text-blue-500 font-medium text-sm">Women</Link>
                <Link to="/products/kids" className="text-gray-600 hover:text-blue-500 font-medium text-sm">Baby & Kids</Link>
                <Link to="/products/accessories" className="text-gray-600 hover:text-blue-500 font-medium text-sm">Accessories</Link>
            </div>
        </div>
    </nav>
);
const Footer = () => (
    <footer className="bg-gray-800 text-gray-400 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-center space-x-5">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white"><InstagramIcon /></a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white"><FacebookIcon /></a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-white"><YouTubeIcon /></a>
            </div>
        </div>
    </footer>
);

// --- Page & Content Components ---
const OutfitPage = () => {
    const [outfitData, setOutfitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { outfitCode } = useParams();

    useEffect(() => {
        if (outfitCode) {
            fetch(`${backendUrl}/api/outfits/${outfitCode}`).then(res => { if (!res.ok) throw new Error('Outfit not found.'); return res.json(); }).then(data => { setOutfitData(data); }).catch(err => { setError(err.message); }).finally(() => { setLoading(false); });
        }
    }, [outfitCode]);

    if (loading) return <div className="text-center p-12">Loading Outfit...</div>;
    if (error) return <div className="text-center p-12 text-red-600 font-bold">{error}</div>;
    if (!outfitData) return null;
    return (<main className="container mx-auto p-4 md:p-8"><div className="mb-8 text-center"><h1 className="text-3xl md:text-4xl font-bold text-gray-800">{outfitData.name}</h1><p className="text-lg text-gray-500 mt-2">Outfit Code: {outfitData.outfitCode}</p></div><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{outfitData.products.map(product => (<ProductCard key={product.id} product={product} />))}</div></main>);
};
const CelebrityAvatar = ({ name, img, slug }) => (<Link to={`/celebrity/${slug}`} className="flex flex-col items-center flex-shrink-0 mx-2 md:mx-4 text-center w-24 group"><div className="transform transition-transform duration-300 ease-in-out group-hover:scale-110"><img src={img} alt={name} className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white shadow-md object-cover" /><p className="mt-2 text-sm font-medium text-gray-700">{name}</p></div></Link>);
const SubCategoryItem = ({ name, img, slug }) => (<Link to={`/category/${slug}`} className="group text-center"><div className="overflow-hidden rounded-lg"><img src={img} alt={name} className="w-full h-full object-cover aspect-square bg-gray-100 transform transition-transform duration-300 ease-in-out group-hover:scale-110" /></div><p className="mt-2 text-sm font-semibold text-gray-800">{name}</p></Link>);
const CategoryCard = ({ title, subcategories }) => (<div className="bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col"><h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3><div className="grid grid-cols-2 gap-4">{subcategories.map((sub) => (<SubCategoryItem key={sub.subcategorySlug} name={sub.subcategoryName} img={sub.heroImageUrl} slug={sub.subcategorySlug} />))}</div></div>);
const Sidebar = ({
    selectedColors, priceRange, selectedDiscount, selectedRating,
    onColorChange, onPriceChange, onDiscountChange, onRatingChange, onClearAll,
}) => {
    const [localPriceRange, setLocalPriceRange] = useState(priceRange);
    useEffect(() => { setLocalPriceRange(priceRange); }, [priceRange]);
    const handleApplyPrice = () => onPriceChange(localPriceRange);
    const handleCheckboxChange = (handler, value, list) => { const newList = list.includes(value) ? list.filter(item => item !== value) : [...list, value]; handler(newList); };
    const handleRadioChange = (handler, value, current) => { const newValue = current === value ? null : value; handler(newValue); };
    const colors = [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF', border: true }, { name: 'Blue', hex: '#3B82F6' }, { name: 'Red', hex: '#EF4444' }, { name: 'Green', hex: '#22C55E' }, { name: 'Gray', hex: '#6B7280' }];
    const discounts = [50, 40, 30, 20, 10];
    const ratings = [4, 3];
    const FilterSection = ({ title, children }) => (<div className="border-b py-4"><h3 className="font-semibold text-gray-800 mb-3">{title}</h3>{children}</div>);
    return (<aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-white shadow-lg rounded-lg h-fit md:sticky md:top-24"><div className="flex justify-between items-center border-b pb-3 mb-2"><h2 className="text-xl font-bold">Filters</h2><button onClick={onClearAll} className="text-sm font-medium text-blue-600 hover:text-blue-800">CLEAR ALL</button></div><FilterSection title="PRICE"><div className="flex justify-between items-center text-sm text-gray-700 space-x-2"><input type="number" placeholder="Min" value={localPriceRange.min} onChange={(e) => setLocalPriceRange({...localPriceRange, min: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded"/><span className="mx-1">-</span><input type="number" placeholder="Max" value={localPriceRange.max} onChange={(e) => setLocalPriceRange({...localPriceRange, max: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded"/><button onClick={handleApplyPrice} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go</button></div></FilterSection><FilterSection title="COLOR"><div className="flex flex-wrap gap-3">{colors.map(color => (<button key={color.name} type="button" onClick={() => handleCheckboxChange(onColorChange, color.name, selectedColors)} className={`w-8 h-8 rounded-full ${color.border ? 'border border-gray-300' : ''} ${selectedColors.includes(color.name) ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`} style={{ backgroundColor: color.hex }} aria-label={`Select color ${color.name}`}/>))}</div></FilterSection><FilterSection title="DISCOUNT"><div className="space-y-2">{discounts.map(d => (<label key={d} className="flex items-center text-sm cursor-pointer"><input type="radio" name="discount" checked={selectedDiscount === d} onChange={() => handleRadioChange(onDiscountChange, d, selectedDiscount)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/><span className="ml-2 text-gray-700">{d}% and above</span></label>))}</div></FilterSection><FilterSection title="RATINGS"><div className="space-y-2">{ratings.map(r => (<label key={r} className="flex items-center text-sm cursor-pointer"><input type="radio" name="rating" checked={selectedRating === r} onChange={() => handleRadioChange(onRatingChange, r, selectedRating)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/><span className="ml-2 text-gray-700 flex items-center">{r}★ & Above</span></label>))}</div></FilterSection></aside>);
};
const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef(null);
    const [isLiked, setIsLiked] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    let images = [];
    if (typeof product.imageUrls === 'string' && product.imageUrls.length > 0) { images = product.imageUrls.split(','); } else { images = ['https://placehold.co/400x500/cccccc/969696?text=No+Image']; }
    useEffect(() => { 
        const savedItems = JSON.parse(localStorage.getItem('savedItems')) || []; 
        if (savedItems.some(item => item.id === product.id)) { setIsLiked(true); } 
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartItems.some(item => item.id === product.id)) { setIsInCart(true); }
    }, [product.id]);
    const handleLikeClick = (e) => {
        e.preventDefault(); 
        const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
        const isAlreadySaved = savedItems.some(item => item.id === product.id);
        let updatedItems;
        if (isAlreadySaved) { updatedItems = savedItems.filter(item => item.id !== product.id); setIsLiked(false); } else { updatedItems = [...savedItems, product]; setIsLiked(true); }
        localStorage.setItem('savedItems', JSON.stringify(updatedItems));
    };
    const handleAddToCartClick = (e) => {
        e.preventDefault();
        if (isInCart) return;
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCart = [...cartItems, product];
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        setIsInCart(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
    };
    const hasMultipleImages = images.length > 1;
    const startCarousel = () => { if (hasMultipleImages) intervalRef.current = setInterval(() => { setCurrentImageIndex(prev => (prev + 1) % images.length); }, 1500); };
    const stopCarousel = () => { clearInterval(intervalRef.current); setCurrentImageIndex(0); };
    useEffect(() => { return () => clearInterval(intervalRef.current); }, []);
    const imageWrapperStyle = { transform: `translateX(-${currentImageIndex * 100}%)` };
    const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group relative h-full flex flex-col" onMouseEnter={startCarousel} onMouseLeave={stopCarousel}>
            <button onClick={handleLikeClick} className={`absolute top-2 right-2 p-1.5 rounded-full z-10 transition-colors duration-200 ${isLiked ? 'text-red-500 bg-red-100/80' : 'text-gray-500 bg-white/80'}`}><HeartIcon isFilled={isLiked} /></button>
            <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col flex-grow">
                <div className="h-64 w-full overflow-hidden relative transform transition-transform duration-500 group-hover:scale-105"><div className="flex h-full w-full transition-transform duration-700 ease-in-out" style={imageWrapperStyle}>{images.map((imgSrc, index) => (<img key={index} src={imgSrc} alt={`${product.name} - view ${index + 1}`} className="h-full w-full flex-shrink-0 object-cover bg-gray-200" />))}</div></div>
                <div className="p-4 flex flex-col flex-grow">
                    <p className="text-sm text-gray-500">{product.brand || 'N/A'}</p>
                    <h4 className="font-semibold text-gray-800 truncate">{product.name || 'No Name'}</h4>
                    <div className="flex items-center mt-2"><p className="text-lg font-bold">₹{product.price || '0'}</p>{product.originalPrice && (<><p className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</p><p className="text-sm text-green-600 font-semibold ml-2">{discount}% off</p></>)}</div>
                    <div className="flex-grow"></div>
                    {(product.rating || product.reviews) && (<div className="flex items-center text-sm text-gray-600 mt-2 border-t pt-2">{product.rating && (<><StarIcon /><span>{product.rating}</span></>)}{product.rating && product.reviews && (<span className="mx-2">|</span>)}{product.reviews && (<span>{product.reviews}</span>)}</div>)}
                    <div className="relative mt-4">
                        <button onClick={handleAddToCartClick} disabled={isInCart} className={`w-full font-semibold py-2 rounded-lg transition-colors ${ isInCart ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{isInCart ? 'Added ✓' : 'Add to Cart'}</button>
                        <ConfettiSpray isActive={showConfetti} />
                    </div>
                </div>
            </a>
        </div>
    );
};
const ProductCarousel = ({ title, products, slug }) => {
    const scrollRef = useRef(null);
    const scroll = (direction) => { const { current } = scrollRef; if (current) { const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth; current.scrollBy({ left: scrollAmount, behavior: 'smooth' }); } };
    if (!products || products.length === 0) return null;
    return (<section className="mb-12"><div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-gray-800">{title}</h2>{slug && (<Link to={`/category/${slug}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">SEE ALL</Link>)}</div><div className="relative group"><div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">{products.map(product => (<div key={product.id} className="flex-shrink-0 w-56 md:w-64"><ProductCard product={product} /></div>))}</div><button onClick={() => scroll('left')} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white disabled:opacity-0 disabled:cursor-not-allowed"><LeftArrowIcon /></button><button onClick={() => scroll('right')} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white disabled:opacity-0 disabled:cursor-not-allowed"><RightArrowIcon /></button></div><style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style></section>);
};
const ProductGrid = ({ products, sortType, setSortType }) => {
    const SortButtons = () => (<div className="flex items-center text-sm flex-wrap"><span className="font-semibold mr-2">Sort By</span><button type="button" onClick={() => setSortType('popularity')} className={`px-2 hover:text-blue-500 ${sortType === 'popularity' ? 'text-blue-600 font-semibold' : ''}`}>Popularity</button><button type="button" onClick={() => setSortType('price-asc')} className={`px-2 hover:text-blue-500 ${sortType === 'price-asc' ? 'text-blue-600 font-semibold' : ''}`}>Price -- Low to High</button><button type="button" onClick={() => setSortType('price-desc')} className={`px-2 hover:text-blue-500 ${sortType === 'price-desc' ? 'text-blue-600 font-semibold' : ''}`}>Price -- High to Low</button><button type="button" onClick={() => setSortType('newest')} className={`px-2 hover:text-blue-500 ${sortType === 'newest' ? 'text-blue-600 font-semibold' : ''}`}>Newest First</button></div>);
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 flex-wrap">
                <div className="text-sm text-gray-600 mb-2 md:mb-0">Showing {products.length} products</div>
                <SortButtons />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </div>
    );
};
const HomePage = () => {
    const [celebrities, setCelebrities] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch(`${backendUrl}/api/celebrities`).then(res => res.json()).then(data => setCelebrities(data)).catch(err => console.error("Failed to fetch celebrities:", err));
        fetch(`${backendUrl}/api/categories`).then(res => res.json()).then(data => {
            const grouped = data.reduce((acc, item) => { let group = acc.find(g => g.title === item.mainCategoryTitle); if (!group) { group = { title: item.mainCategoryTitle, subcategories: [] }; acc.push(group); } group.subcategories.push(item); return acc; }, []);
            setCategories(grouped);
        }).catch(err => console.error("Failed to fetch categories:", err));
    }, []);
    const extendedCelebrities = [...(celebrities || []), ...(celebrities || [])];
    return (<><style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 40s linear infinite; }`}</style><main className="container mx-auto p-4 md:p-8"><section className="mb-12"><h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Top Celebrity Styles</h2><div className="relative w-full overflow-hidden"><div className="flex w-max animate-scroll hover:[animation-play-state:paused]">{extendedCelebrities.map((celeb, index) => (<CelebrityAvatar key={`${celeb.slug}-${index}`} name={celeb.name} img={celeb.imgUrl} slug={celeb.slug} />))}</div></div></section><section><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">{categories.map((cat) => ( <CategoryCard key={cat.title} title={cat.title} subcategories={cat.subcategories} />))}</div></section></main></>);
};
const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); 
    const [pageTitle, setPageTitle] = useState('Products');
    const [sortType, setSortType] = useState('popularity');
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const { slug } = useParams();
    const location = useLocation();
    const pathType = location.pathname.split('/')[1]; 

    useEffect(() => { 
        fetch(`${backendUrl}/api/products`).then(res => res.json()).then(data => { 
            if (Array.isArray(data)) setAllProducts(data); 
            else console.error("API did not return an array of products:", data); 
        }).catch(err => console.error("Failed to fetch products:", err)); 
    }, []);

    useEffect(() => {
        let filtered = [...allProducts];
        if (pathType === 'celebrity') { 
            filtered = allProducts.filter(p => p.celebritySlugs?.split(',').includes(slug)); 
            const celebName = allProducts.find(p => p.celebritySlugs?.split(',').includes(slug))?.celebritySlugs.split(',').find(s => s === slug)?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || slug;
            setPageTitle(`${celebName}'s Style`); 
        } 
        else if (pathType === 'category') { 
            filtered = allProducts.filter(p => p.subcategorySlug === slug); 
            setPageTitle(filtered[0]?.subcategoryName || 'Category'); 
        } 
        else if (pathType === 'products') { 
            filtered = allProducts.filter(p => p.mainCategorySlug === slug); 
            const titleMap = { men: 'Men', women: 'Women', kids: 'Baby & Kids', accessories: 'Accessories' }; 
            setPageTitle(titleMap[slug] || 'Products'); 
        }
        if (selectedColors.length > 0) { filtered = filtered.filter(p => p.color && selectedColors.map(c => c.toLowerCase()).includes(p.color.toLowerCase())); }
        if (selectedRating) { filtered = filtered.filter(p => p.rating && parseFloat(p.rating) >= selectedRating); }
        if (selectedDiscount) { filtered = filtered.filter(p => { if (!p.originalPrice || !p.price) return false; const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100); return discount >= selectedDiscount; }); }
        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
        const sorted = [...filtered].sort((a, b) => {
            switch (sortType) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'newest': return b.id - a.id;
                case 'popularity': default: return (b.reviews || 0) - (a.reviews || 0);
            }
        });
        setProducts(sorted);
    }, [allProducts, pathType, slug, sortType, selectedColors, priceRange, selectedDiscount, selectedRating]);
    
    const clearAllFilters = () => { setSelectedColors([]); setPriceRange({ min: 0, max: 100000 }); setSelectedDiscount(null); setSelectedRating(null); };
    
    return (<div className="bg-gray-100 min-h-screen font-sans"><main className="container mx-auto p-4"><div className="text-sm text-gray-500 mb-2"><Link to="/" className="hover:text-blue-500">Home</Link> &gt; <span>{pageTitle}</span></div><div className="flex flex-col md:flex-row gap-8"><Sidebar selectedColors={selectedColors} priceRange={priceRange} selectedDiscount={selectedDiscount} selectedRating={selectedRating} onColorChange={setSelectedColors} onPriceChange={setPriceRange} onDiscountChange={setSelectedDiscount} onRatingChange={setSelectedRating} onClearAll={clearAllFilters} /><div className="w-full"><ProductGrid products={products} sortType={sortType} setSortType={setSortType} /></div></div></main></div>);
};
const SavedItemsPage = () => {
    const [savedItems, setSavedItems] = useState([]);
    useEffect(() => { const items = JSON.parse(localStorage.getItem('savedItems')) || []; setSavedItems(items); }, []);
    return (<main className="container mx-auto p-4 md:p-8"><div className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Your Saved Items</h1><p className="text-gray-500 mt-2">{savedItems.length} items in your wishlist</p></div>{savedItems.length > 0 ? (<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">{savedItems.map(product => (<ProductCard key={product.id} product={product} />))}</div>) : (<div className="text-center py-16 bg-white rounded-lg shadow-md"><p className="text-gray-500">You haven't saved any items yet.</p></div>)}</main>);
};
const ProfilePage = () => {
    const [userName, setUserName] = useState('');
    const [allowEmails, setAllowEmails] = useState(true);
    return(
        <main className="container mx-auto p-4 md:p-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                <div><label className="block text-sm font-medium text-gray-700">User Name</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Change Password</label><input type="password" placeholder="New Password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div>
                <div className="flex items-start"><div className="flex items-center h-5"><input id="allowEmails" name="allowEmails" type="checkbox" checked={allowEmails} onChange={() => setAllowEmails(!allowEmails)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"/></div><div className="ml-3 text-sm"><label htmlFor="allowEmails" className="font-medium text-gray-700">Email Notifications</label><p className="text-gray-500">Allow us to send emails about new products and offers.</p></div></div>
                <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
        </main>
    );
};
const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
        
        // --- FIX APPLIED HERE ---
        // Convert item.price to a number before adding
        const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
        
        setTotal(totalPrice);
    }, []);

    const handleRemoveItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        
        // --- FIX APPLIED HERE ---
        // Also apply the fix when an item is removed
        const totalPrice = updatedCart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
        
        setTotal(totalPrice);
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Cart</h1>
            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                                <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="flex items-center flex-grow hover:opacity-80 transition-opacity">
                                    <img src={item.imageUrls.split(',')[0]} alt={item.name} className="w-20 h-24 object-cover rounded-md mr-4"/>
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.brand}</p>
                                    </div>
                                </a>
                                <div className="flex items-center">
                                    <p className="font-bold text-lg mr-6">₹{item.price}</p>
                                    <button onClick={() => handleRemoveItem(item.id)} className="text-gray-500 hover:text-red-600 p-2">
                                        {/* Assuming you have a TrashIcon component */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
                        <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
                        <div className="flex justify-between text-gray-600 mb-2">
                            <span>Subtotal</span>
                            {/* This line will now work correctly */}
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-4">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>
                        <div className="flex justify-between text-gray-900 font-bold text-lg border-t pt-4">
                            <span>Total</span>
                             {/* This line will now work correctly */}
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <button className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500 text-lg">Your cart is empty.</p>
                </div>
            )}
        </main>
    );
};
const SearchResultsPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [sortType, setSortType] = useState('popularity');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('query');
        setSearchTerm(query);
        if (query) {
            fetch(`${backendUrl}/api/search?query=${query}`).then(res => { if (!res.ok) throw new Error('Search failed'); return res.json(); }).then(data => { if (Array.isArray(data)) { setResults(data); setFilteredResults(data); } }).catch(() => setError('Failed to fetch search results.')).finally(() => setLoading(false));
        } else { setLoading(false); }
    }, [searchParams]);

    useEffect(() => {
        let filtered = [...results];
        if (selectedColors.length > 0) { filtered = filtered.filter(p => p.color && selectedColors.map(c => c.toLowerCase()).includes(p.color.toLowerCase())); }
        if (selectedRating) { filtered = filtered.filter(p => p.rating && parseFloat(p.rating) >= selectedRating); }
        if (selectedDiscount) { filtered = filtered.filter(p => { if (!p.originalPrice || !p.price) return false; const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100); return discount >= selectedDiscount; }); }
        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
        const sorted = [...filtered].sort((a, b) => {
            switch (sortType) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'newest': return b.id - a.id;
                case 'popularity': default: return (b.reviews || 0) - (a.reviews || 0);
            }
        });
        setFilteredResults(sorted);
    }, [results, sortType, selectedColors, priceRange, selectedDiscount, selectedRating]);
    
    const clearAllFilters = () => {
        setSelectedColors([]);
        setPriceRange({ min: 0, max: 100000 });
        setSelectedDiscount(null);
        setSelectedRating(null);
    };

    if (loading) return <div className="text-center p-12">Searching...</div>;
    if (error) return <div className="text-center p-12 text-red-600 font-bold">{error}</div>;
    
    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Search Results for "{searchTerm}"</h1>
                <p className="text-gray-500 mt-1">{filteredResults.length} products found</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar 
                    selectedColors={selectedColors} priceRange={priceRange} selectedDiscount={selectedDiscount}
                    selectedRating={selectedRating} onColorChange={setSelectedColors} onPriceChange={setPriceRange}
                    onDiscountChange={setSelectedDiscount} onRatingChange={setSelectedRating} onClearAll={clearAllFilters}
                />
                <div className="w-full">
                    {filteredResults.length > 0 ? (
                        <ProductGrid products={filteredResults} sortType={sortType} setSortType={setSortType} />
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md">
                            <p className="text-gray-500 text-lg">No products matched your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

// --- Main App Component ---
function AppContent() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isForgotModalOpen, setForgotModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const user = searchParams.get('user');
        if (token && user) {
            const userData = JSON.parse(decodeURIComponent(user));
            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(userData));
            setCurrentUser(userData);
            navigate('/', { replace: true });
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('authUser');
        if (token && user && !currentUser) {
            setCurrentUser(JSON.parse(user));
        }
    }, [currentUser]);

    const handleLoginSuccess = (data) => {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        setCurrentUser(data.user);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setCurrentUser(null);
    };
    
    const openLoginModal = () => { setForgotModalOpen(false); setLoginModalOpen(true); };
    const openForgotPasswordModal = () => { setLoginModalOpen(false); setForgotModalOpen(true); };
    
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <CustomStyles />
            <Header currentUser={currentUser} onLoginClick={openLoginModal} onLogout={handleLogout} />
            <SubNavigation />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/saved-items" element={<SavedItemsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/outfits/:outfitCode" element={<OutfitPage />} />
                <Route path="/category/:slug" element={<ProductPage />} />
                <Route path="/celebrity/:slug" element={<ProductPage />} />
                <Route path="/products/:slug" element={<ProductPage />} />
            </Routes>
            <Footer />
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setLoginModalOpen(false)} 
                onLoginSuccess={handleLoginSuccess} 
                onForgotPasswordClick={openForgotPasswordModal} 
            />
            <ForgotPasswordModal 
                isOpen={isForgotModalOpen} 
                onClose={() => setForgotModalOpen(false)} 
                onEmailSent={() => setTimeout(() => setForgotModalOpen(false), 3000)} 
            />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
