'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoginOverlay } from '@/components/LoginOverlay'

interface Address {
  display_name: string;
  place_id: number;
}

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const fetchAddresses = async () => {
      if (address.length > 3) {
        setIsLoading(true)
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
          const data = await response.json()
          setAddressSuggestions(data.slice(0, 5))
        } catch (error) {
          console.error('Error fetching addresses:', error)
        }
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchAddresses, 1000)
    return () => clearTimeout(debounceTimer)
  }, [address])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Phone: ${phoneNumber}\nAddress: ${address}`)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY })
  }

  return (
      <main
          className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center"
          onMouseMove={handleMouseMove}
          style={{ cursor: 'none' }}
      >
        {!isLoggedIn && <LoginOverlay onLogin={() => setIsLoggedIn(true)} />}
        <div
            className="fixed w-8 h-8 rounded-full bg-yellow-300 pointer-events-none z-50 transition-all duration-100 ease-out"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transform: 'translate(-50%, -50%) rotate(45deg)'
            }}
        ></div>
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-yellow-300 rounded-lg shadow-lg transform rotate-3 animate-pulse">
          <h1 className="text-4xl font-bold mb-6 text-center text-purple-800 animate-bounce">Welcome to the WORST UI</h1>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your phone number:
            </label>
            <Input
                type="text"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ transform: 'skew(-5deg)' }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your address:
            </label>
            <Input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ letterSpacing: '0.5em', writingMode: 'vertical-rl' }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address-select" className="block text-sm font-medium text-gray-700 mb-1">
              Or select an address:
            </label>
            <Select onValueChange={(value) => setAddress(value)}>
              <SelectTrigger id="address-select" className="w-full">
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                ) : (
                    addressSuggestions.map((addr) => (
                        <SelectItem key={addr.place_id} value={addr.display_name}>
                          {addr.display_name.split('').reverse().join('')}
                        </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform hover:scale-110 transition duration-300 animate-spin"
          >
            SUBMIT (if you dare)
          </Button>
        </form>
      </main>
  )
}

