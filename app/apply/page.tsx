"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ApplyPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    rollNumber: "",
    skills: "",
    githubLink: "",
    reason: "",
    role: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, role: value }))
    // Clear error when user selects
    if (errors.role) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.role
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formState.name.trim()) newErrors.name = "Name is required"
    if (!formState.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "Email is invalid"
    } else if (!formState.email.endsWith("@mpgi.edu.in")) {
      newErrors.email = "Please use your college email (@mpgi.edu.in)"
    }
    if (!formState.rollNumber.trim()) newErrors.rollNumber = "Roll number is required"
    if (!formState.skills.trim()) newErrors.skills = "Skills are required"

    // GitHub/Portfolio link validation - should be a valid URL if provided
    if (formState.githubLink.trim() && !/^https?:\/\/\S+/.test(formState.githubLink)) {
      newErrors.githubLink = "Please enter a valid URL (starting with http:// or https://)"
    }

    if (!formState.reason.trim()) newErrors.reason = "This field is required"
    if (!formState.role) newErrors.role = "Please select a role"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Simulate form submission
      setTimeout(() => {
        setSubmitted(true)
      }, 1000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg p-8 border border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.3)]"
          >
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Application Submitted!
              </h2>
              <p className="text-gray-300 mb-6">
                Thank you for applying to join our core team. We'll review your application and get back to you soon.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-900 rounded-lg p-8 border border-purple-900 shadow-[0_0_20px_rgba(138,43,226,0.3)]"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            >
              Become a Core Member
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-400 mb-8">
              Are you passionate about coding, organizing, or leading? Apply now to join our core team and shape the
              future of the Programming Club at Maharana Pratap Group of Institute, Kanpur.
            </motion.p>

            <form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className={`bg-gray-800 border ${
                      errors.name ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:ring-blue-500 text-white`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    College Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={`bg-gray-800 border ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:ring-blue-500 text-white`}
                    placeholder="your.name@mpgi.edu.in"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="text-gray-300">
                    Roll Number
                  </Label>
                  <Input
                    id="rollNumber"
                    name="rollNumber"
                    value={formState.rollNumber}
                    onChange={handleChange}
                    className={`bg-gray-800 border ${
                      errors.rollNumber ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:ring-blue-500 text-white`}
                    placeholder="Your college roll number"
                  />
                  {errors.rollNumber && <p className="text-red-500 text-sm mt-1">{errors.rollNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-gray-300">
                    Skills/Tech Stack
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formState.skills}
                    onChange={handleChange}
                    className={`bg-gray-800 border ${
                      errors.skills ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:ring-blue-500 text-white`}
                    placeholder="JavaScript, React, Python, etc."
                  />
                  {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubLink" className="text-gray-300">
                    GitHub/Portfolio Link
                  </Label>
                  <Input
                    id="githubLink"
                    name="githubLink"
                    value={formState.githubLink}
                    onChange={handleChange}
                    className={`bg-gray-800 border ${
                      errors.githubLink ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:ring-blue-500 text-white`}
                    placeholder="https://github.com/yourusername"
                  />
                  {errors.githubLink && <p className="text-red-500 text-sm mt-1">{errors.githubLink}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-gray-300">
                    Why do you want to join the core team?
                  </Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    value={formState.reason}
                    onChange={handleChange}
                    className={`bg-gray-800 border ${
                      errors.reason ? "border-red-500" : "border-gray-700"
                    } focus:border-blue-500 focus:ring-blue-500 text-white min-h-[120px]`}
                    placeholder="Tell us why you're interested in joining the core team..."
                  />
                  {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-300">
                    Role Preference
                  </Label>
                  <Select onValueChange={handleSelectChange} value={formState.role}>
                    <SelectTrigger
                      className={`bg-gray-800 border ${
                        errors.role ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:ring-blue-500 text-white`}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                      <SelectItem value="event-head">Event Head</SelectItem>
                      <SelectItem value="tech-lead">Tech Lead</SelectItem>
                      <SelectItem value="pr-design">PR & Design</SelectItem>
                      <SelectItem value="content-creator">Content Creator</SelectItem>
                      <SelectItem value="workshop-coordinator">Workshop Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>

                <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.8)]"
                  >
                    Submit Application
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}
