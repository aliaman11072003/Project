"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { ChevronDown, Code, Github, Instagram, Linkedin, Mail, Users, Zap, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const aboutRef = useRef<HTMLDivElement>(null)

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MatrixRainEffect />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Programming Club
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <p className="text-xl md:text-2xl mb-8 text-purple-300">Where Code Meets Creativity</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/apply">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(138,43,226,0.8)]">
                Join Now
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-900/20 px-8 py-6 text-lg transition-all duration-300 hover:border-purple-400"
              onClick={scrollToAbout}
            >
              Learn More
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToAbout}
        >
          <ChevronDown className="w-10 h-10 text-purple-400 animate-bounce" />
        </motion.div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              About Us
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg max-w-3xl mx-auto text-gray-300 mb-4">
              We are a community of passionate programmers, hackers, and tech enthusiasts dedicated to exploring the
              frontiers of code. Our mission is to foster innovation, collaboration, and technical excellence through
              hands-on learning and real-world projects.
            </p>
            <p className="text-md max-w-3xl mx-auto text-green-400 font-semibold">
              An initiative by the students of Maharana Pratap Group of Institute, Kanpur
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Workshops",
                icon: <Code className="w-10 h-10 text-blue-400" />,
                description: "Hands-on sessions on cutting-edge technologies and programming paradigms.",
              },
              {
                title: "Hackathons",
                icon: <Terminal className="w-10 h-10 text-purple-400" />,
                description: "Coding competitions to solve real-world problems and build innovative solutions.",
              },
              {
                title: "Open Source",
                icon: <Github className="w-10 h-10 text-green-400" />,
                description: "Contribute to projects and build your portfolio while making an impact.",
              },
              {
                title: "Peer Learning",
                icon: <Users className="w-10 h-10 text-blue-400" />,
                description: "Learn from and teach fellow students in a collaborative environment.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.3)]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-blue-300">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Our Activities
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Weekly Coding Challenges",
                description: "Sharpen your skills with our weekly algorithmic challenges and coding competitions.",
                icon: <Code className="w-8 h-8 text-green-400" />,
              },
              {
                title: "Hackathon Participation",
                description: "Join forces with fellow coders to participate in local and international hackathons.",
                icon: <Zap className="w-8 h-8 text-blue-400" />,
              },
              {
                title: "Open Source Projects",
                description: "Contribute to meaningful projects that impact the developer community worldwide.",
                icon: <Github className="w-8 h-8 text-purple-400" />,
              },
              {
                title: "Expert Sessions",
                description: "Learn from industry experts and tech leaders through exclusive workshops and talks.",
                icon: <Users className="w-8 h-8 text-blue-400" />,
              },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300 p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-gray-800 mr-4">{activity.icon}</div>
                  <h3 className="text-xl font-bold text-blue-300">{activity.title}</h3>
                </div>
                <p className="text-gray-400">{activity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Display Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Code With Us
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-gray-900 rounded-lg p-6 border border-purple-900 shadow-[0_0_15px_rgba(138,43,226,0.3)]"
          >
            <div className="flex items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-gray-400 text-sm">terminal</div>
            </div>
            <div className="font-mono text-sm sm:text-base">
              <div className="text-gray-400">$ mpec_programming_club --init</div>
              <div className="text-green-400">Initializing Programming Club environment...</div>
              <div className="pl-4 text-gray-300">
                <TypeAnimation
                  sequence={[
                    `> Loading resources...\n> Connecting to community...\n> Preparing workshops...\n> Setting up hackathon environment...\n\n> Welcome to MPEC Programming Club!\n> Ready to code, learn, and innovate together.`,
                    1000,
                    "",
                  ]}
                  repeat={Number.POSITIVE_INFINITY}
                  cursor={true}
                  speed={80}
                  style={{ display: "block", whiteSpace: "pre-line" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Members Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Our Team
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Rahul Sharma", role: "President", image: "/placeholder.svg?height=400&width=400" },
              { name: "Priya Patel", role: "Vice President", image: "/placeholder.svg?height=400&width=400" },
              { name: "Amit Kumar", role: "Technical Lead", image: "/placeholder.svg?height=400&width=400" },
              { name: "Neha Singh", role: "Event Coordinator", image: "/placeholder.svg?height=400&width=400" },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group relative"
              >
                <div className="relative h-80 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-purple-500 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(138,43,226,0.5)]">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-purple-300">{member.role}</p>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {member.role}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                Programming Club
              </h3>
              <p className="text-gray-400">Maharana Pratap Group of Institute, Kanpur</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-4 mb-4">
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Github className="w-6 h-6" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Linkedin className="w-6 h-6" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Instagram className="w-6 h-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="mailto:programmingclub@mpgi.edu.in"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Mail className="w-6 h-6" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Programming Club, MPGI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Matrix Rain Effect Component
function MatrixRainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height)
    }

    const characters =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"

    let frameId: number

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0F0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length))

        // Add color variation
        const colorValue = Math.floor(Math.random() * 100) + 155
        if (Math.random() > 0.98) {
          ctx.fillStyle = `rgb(130, ${colorValue}, 255)` // Purple-ish
        } else if (Math.random() > 0.95) {
          ctx.fillStyle = `rgb(0, ${colorValue}, 255)` // Blue-ish
        } else if (Math.random() > 0.9) {
          ctx.fillStyle = `rgb(0, 255, ${colorValue})` // Green-ish
        } else {
          ctx.fillStyle = `rgba(0, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      frameId = requestAnimationFrame(draw)
    }

    frameId = requestAnimationFrame(draw)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
