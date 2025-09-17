
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, BarChart3Icon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import LogoutButton from "@/components/common/LogoutButton";

export default function Index() {

  const { signOut, isAuthenticated, user, isLoading } = useAuth();
  console.log("is auth, user in homepage : ", isAuthenticated, user)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" to="/">
          <BarChart3Icon className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">Arbitrage Bot</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/dashboard">
            Dashboard
          </Link>
          <span>
            {!user && !isAuthenticated ?
              <Link className="text-sm font-medium hover:underline underline-offset-4" to="/auth">
                Login
              </Link> : <LogoutButton />
            }
          </span>

        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Automated DeFi Arbitrage Bot
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Maximize your profits with our advanced arbitrage bot. Monitor price differences across DEXs and execute trades automatically.
                </p>
              </div>
              <div className="space-x-4 flex">
                <Link to="/dashboard">
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    Go to Dashboard
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <span>
                  {!user && !isAuthenticated ?
                    <Link to="/auth">
                      <Button variant="outline">
                        Login
                      </Button>
                    </Link> : <LogoutButton />
                  }
                </span>

              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <svg
                    className=" h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m10 7 5 3-5 3Z" />
                    <rect height="14" rx="2" width="20" x="2" y="3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Real-time Monitoring</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Monitor price differences across multiple DEXs in real-time to identify profitable arbitrage opportunities.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <svg
                    className=" h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Automated Trading</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Execute arbitrage trades automatically with our secure and efficient smart contract system.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <svg
                    className=" h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Performance Analytics</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Track your trading performance with comprehensive analytics and visualizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 Arbitrage Bot. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
