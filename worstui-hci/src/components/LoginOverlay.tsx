'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from 'lucide-react'

interface LoginOverlayProps {
    onLogin: () => void;
}

export function LoginOverlay({ onLogin }: LoginOverlayProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const passwordRequirements = [
        { regex: /.{8,}/, message: 'at least 8 characters' },
        { regex: /[A-Z]/, message: 'an uppercase letter' },
        { regex: /[a-z]/, message: 'a lowercase letter' },
        { regex: /[0-9]/, message: 'a number' },
        { regex: /[^A-Za-z0-9]/, message: 'a special character' },
    ]

    const usernameRequirements = [
        { regex: /.{5,}/, message: 'at least 5 characters' },
        { regex: /^[a-zA-Z]/, message: 'start with a letter' },
        { regex: /[0-9]/, message: 'include a number' },
    ]

    useEffect(() => {
        if (username && password) {
            const failedPasswordReq = passwordRequirements.find(req => !req.regex.test(password))
            const failedUsernameReq = usernameRequirements.find(req => !req.regex.test(username))

            if (failedPasswordReq) {
                setError(`Password must contain ${failedPasswordReq.message}`)
            } else if (failedUsernameReq) {
                setError('Username is invalid')
            } else {
                setError('')
            }
        }
    }, [username, password])

    const handleLogin = () => {
        if (!error && username && password) {
            onLogin()
        } else {
            setError('Please enter a valid username and password')
        }
    }

    const handleClear = () => {
        setUsername('')
        setPassword('')
        setError('')
    }

    const maskUsername = (value: string) => {
        return value.replace(/./g, '•')
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-md p-8 bg-yellow-300 bg-opacity-90 rounded-lg shadow-lg transform -rotate-3 animate-spin-slow">
                <Button
                    onClick={handleLogin}
                    className="absolute top-2 right-2 rounded-full w-10 h-10 p-0 bg-green-500 hover:bg-green-600 text-white"
                    disabled={!!error || !username || !password}
                >
                    <Check className="w-6 h-6" />
                </Button>
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-800 animate-pulse">!Login?!</h2>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password:
                    </label>
                    <Input
                        type="text"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username:
                    </label>
                    <Input
                        type="text"
                        id="username"
                        value={maskUsername(username)}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <Button
                    type="button"
                    onClick={handleClear}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                >
                    Clear
                </Button>
            </div>
        </div>
    )
}

