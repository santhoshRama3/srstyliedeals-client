import React, { useState, useEffect, useRef } from 'react';

// --- Reusable Constant for API URL ---
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
// All your page components like HomePage, ProductPage, etc. go here.
// Make sure to update their fetch calls to use the `backendUrl` variable.
// Example for HomePage:
const HomePage = () => {
    const [celebrities, setCelebrities] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // UPDATED API URL
        fetch(`${backendUrl}/api/celebrities`)
            .then(res => res.json())
            .then(data => setCelebrities(data))
            .catch(err => console.error("Failed to fetch celebrities:", err));
        
        // UPDATED API URL & LOGIC
        fetch(`${backendUrl}/api/categories`)
            .then(res => res.json())
            .then(data => {
                const grouped = data.reduce((acc, item) => {
                    let group = acc.find(g => g.title === item.mainCategoryTitle);
                    if (!group) {
                        group = { title: item.mainCategoryTitle, subcategories: [] };
                        acc.push(group);
                    }
                    group.subcategories.push(item);
                    return acc;
                }, []);
                setCategories(grouped);
            })
            .catch(err => console.error("Failed to fetch categories:", err));
    }, []);

    // ... rest of the HomePage component is the same
};

// ... and so on for all other page components ...

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
