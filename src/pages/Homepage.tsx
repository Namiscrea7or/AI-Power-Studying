import React from "react";
import { FiCheckCircle, FiUsers, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-blue-600">
                  Manage Your Tasks with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-blue-600 md:text-xl">
                  Stay organized, boost productivity, and achieve your goals
                  with our powerful task management platform.
                </p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => navigate("/signin")}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                  Get Started
                </button>
                <button className="px-4 py-2 rounded border text-blue-600 border-blue-600 hover:bg-blue-100">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-blue-600">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <FiCheckCircle className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-600">
                  Task Organization
                </h3>
                <p className="text-sm text-blue-600">
                  Easily create, categorize, and prioritize your tasks
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FiUsers className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-600">
                  Team Collaboration
                </h3>
                <p className="text-sm text-blue-600">
                  Share tasks and projects with your team members
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FiZap className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-600">
                  Productivity Boost
                </h3>
                <p className="text-sm text-blue-600">
                  Track your progress and improve your efficiency
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-600">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[600px] text-blue-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are already managing their tasks
                  more efficiently.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => navigate("/signin")}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 rounded border text-blue-600 border-blue-600 hover:bg-blue-100">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-600">
          © 2024 PowerStudy. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <div className="text-xs hover:underline underline-offset-4 text-blue-600">
            Terms of Service
          </div>
          <div className="text-xs hover:underline underline-offset-4 text-blue-600">
            Privacy
          </div>
        </nav>
      </footer>
    </div>
  );
}
