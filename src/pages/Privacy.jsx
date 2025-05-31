import React, { useContext } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { ThemeContext } from '../context/ThemeContext';


export const Privacy = () => {
    const [isDark] = useContext(ThemeContext);
    return (
       <div className={`${isDark ? 'bg-[#1B1B1B] text-white' : ''} text-gray-800 p-8  w-full min-h-screen`}>
            <header className="text-center mb-2 md:mb-10">
                <FaChevronLeft className="text-gray-400 text-xl  cursor-pointer"
                    onClick={() => history.back()} />
                <h1 className="text-xl md:text-5xl font-extrabold ">Privacy Policy</h1>

            </header>
            <main className="space-y-1 sm:space-y-2 md:space-y-4 max-w-4xl mx-auto">
                <p className="text-lg leading-relaxed">
                    Your privacy is important to us. This privacy policy outlines how we collect, use, and protect your information when you use our task management application.
                </p>
                <p className="text-lg leading-relaxed">
                    We may collect personal information such as your name, email address, and usage data to improve our services. We do not share your information with third parties without your consent.
                </p>
                <p className="text-lg leading-relaxed">
                    We implement security measures to protect your information from unauthorized access. However, no method of transmission over the internet is 100% secure.
                </p>
              
            </main>
            <footer className="mt-4 text-center border-t border-gray-300 pt-6">
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} TodoPro. All rights reserved.
                </p>
            </footer>
        </div>
    )
}



