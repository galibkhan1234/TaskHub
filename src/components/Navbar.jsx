import { useRef, useState ,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Settings, ChevronDown, LogOut } from "lucide-react"

const Navbar = ({ user={}, onLogout }) => {
  
  const menuref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(()=>{
    const handleClickOutside =(event)=>{
      if(menuref.current && !menuref.current.contains(event.target)){
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown',handleClickOutside)
    return () => document.removeEventListener('mousedown',handleClickOutside)
  },[])

  const handleMenuToggle = () => setMenuOpen(prev => !prev);

  const handleLogout = () =>{
    setMenuOpen(false)
    onLogout()
  }  

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
      <div className='flex items-center justify-between px-4 py-2.5 md:px-6'>
        
        {/* Left Section */}
        <div
          className='flex items-center gap-2 cursor-pointer group'
          onClick={() => navigate('/')}
        >
          {/* Icon */}
          <div className='relative w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover:shadow-purple-300/50 group-hover:scale-105 transition-all duration-300'>
            <Zap className='text-white w-5 h-5' />
            <div className='absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-white shadow-md animate-ping' />
          </div>

          {/* Text */}
          <span className='text-lg font-extrabold bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide'>
            TaskFlow
          </span>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-3'>
          <button
            className='p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full'
            onClick={() => navigate('/profile')}
          >
            <Settings className='w-5 h-5 text-gray-700' />
          </button>

          {/* User Profile Dropdown */}
          <div ref={menuref} className='relative'>
            <button
              onClick={handleMenuToggle}
              className='flex items-center gap-2 px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border border-transparent hover:border-purple-200'
            >
              <div className='relative'>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt='User Avatar'
                    className='w-8 h-8 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center'>
                    <span className='text-white font-medium text-sm'>
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}

                <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse' />
              </div>

              <div className='text-left hidden md:block'>
                <p className='text-sm font-medium text-gray-800'>{user?.name}</p>
                <p className='text-xs font-normal text-gray-500'>{user?.email}</p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <ul className='absolute top-12 right-0 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden animate-fadeIn'>
                <li className='p-2'>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/profile')
                    }}
                    className='w-full px-4 py-3 text-left hover:bg-purple-50 text-sm text-gray-700 transition-colors flex items-center gap-2'
                    role='menuitem'
                  >
                    <Settings className='w-4 h-4 text-gray-700' />
                    Profile Setting
                  </button>
                </li>

                <li className='p-2'>
                  <button
                    onClick={handleLogout}
                    className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-50 text-red-600'
                  >
                    <LogOut className='w-4 h-4' />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar