"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl w-full shadow-lg">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6 flex justify-center"
            >
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-12-03%20at%2011.43.09_66e623ce.jpg-5F9K02oPMzaZDTf8CJHZhlnmmG7YlR.jpeg"
                  alt="EBNY Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You for Your Application!
              </h1>
              
              <p className="text-gray-600 mb-6 text-lg">
                We appreciate your interest in joining the EBNY team. Our HR department will carefully review your application and get back to you soon.
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h2 className="font-semibold text-blue-800 mb-2">What's Next?</h2>
                  <ul className="text-blue-700 text-left space-y-2">
                    <li>• Our team will review your application within 3-5 business days</li>
                    <li>• You'll receive an email confirmation shortly</li>
                    <li>• We'll contact you if your qualifications match our requirements</li>
                  </ul>
                </div>

                <Link href="/" className="block">
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 