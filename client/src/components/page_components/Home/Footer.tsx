import React from "react";

export default function Footer() {
	return (
		<section className="w-full bg-white py-16 border-t border-gray-200">
			<div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-start md:justify-between gap-12">
				{/* Left: Logo and Newsletter */}
				<div className="flex-1 min-w-[260px] max-w-sm">
					<div className="flex flex-col items-start">
						<span className="font-logo text-3xl text-black mb-4">Logo</span>
						<p className="text-gray-700 mb-6">
							Subscribe to our newsletter for the latest updates on features and releases.
						</p>
						<form className="flex w-full mb-2">
							<input
								type="email"
								placeholder="Your email here"
								className="border border-gray-900 px-4 py-2 flex-1 rounded-none outline-none"
							/>
							<button
								type="submit"
								className="border border-gray-900 px-6 py-2 rounded-none ml-2 bg-white hover:bg-gray-100 transition"
							>
								Join
							</button>
						</form>
						<p className="text-xs text-gray-500">
							By subscribing, you consent to our Privacy Policy and agree to receive updates.
						</p>
					</div>
				</div>
				{/* Center: Quick Links & Resources */}
				<div className="flex-[2] grid grid-cols-2 md:grid-cols-3 gap-8">
					<div>
						<p className="font-semibold text-gray-900 mb-3">Quick Links</p>
						<ul className="space-y-2">
							<li>
								<a href="#" className="hover:underline">
									Home Page
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									About Us
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Services
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Contact Us
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Blog Posts
								</a>
							</li>
						</ul>
					</div>
					<div>
						<p className="font-semibold text-gray-900 mb-3">Resources</p>
						<ul className="space-y-2">
							<li>
								<a href="#" className="hover:underline">
									FAQs
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Support
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Careers
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Testimonials
								</a>
							</li>
							<li>
								<a href="#" className="hover:underline">
									Privacy Policy
								</a>
							</li>
						</ul>
					</div>
					<div>
						<p className="font-semibold text-gray-900 mb-3">Connect With Us</p>
						<ul className="space-y-2">
							<li className="flex items-center space-x-2">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.36 6.64a9 9 0 1 0 0 10.72A9 9 0 0 0 18.36 6.64zm-1.41 9.19a7 7 0 1 1 0-8.66 7 7 0 0 1 0 8.66z" />
									<path d="M15.54 8.46a5 5 0 1 0 0 7.08 5 5 0 0 0 0-7.08z" />
								</svg>
								<a href="#" className="hover:underline">
									Facebook
								</a>
							</li>
							<li className="flex items-center space-x-2">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25A5.25 5.25 0 1 1 6.75 12 5.25 5.25 0 0 1 12 6.75zm0 1.5A3.75 3.75 0 1 0 15.75 12 3.75 3.75 0 0 0 12 8.25zm5.13-.88a1.13 1.13 0 1 1-1.13 1.13 1.13 1.13 0 0 1 1.13-1.13z" />
								</svg>
								<a href="#" className="hover:underline">
									Instagram
								</a>
							</li>
							<li className="flex items-center space-x-2">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03A12.94 12.94 0 0 1 3.1.67a4.48 4.48 0 0 0-.61 2.28c0 1.57.8 2.96 2.02 3.77A4.48 4.48 0 0 1 2 6.13v.06c0 2.2 1.56 4.03 3.64 4.45a4.52 4.52 0 0 1-2.04.08c.57 1.78 2.22 3.08 4.18 3.12A9.05 9.05 0 0 1 2 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 23 3z" />
								</svg>
								<a href="#" className="hover:underline">
									X
								</a>
							</li>
							<li className="flex items-center space-x-2">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47s-1.73 1.18-1.73 2.4v4.57h-3v-9h2.89v1.23h.04c.4-.76 1.37-1.56 2.82-1.56 3.02 0 3.58 1.99 3.58 4.58v4.75z" />
								</svg>
								<a href="#" className="hover:underline">
									LinkedIn
								</a>
							</li>
							<li className="flex items-center space-x-2">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.163 3.5 12 3.5 12 3.5s-7.163 0-9.386.574a2.994 2.994 0 0 0-2.112 2.112C0 8.409 0 12 0 12s0 3.591.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.837 20.5 12 20.5 12 20.5s7.163 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.591 24 12 24 12s0-3.591-.502-5.814zM9.545 15.568V8.432l6.545 3.568-6.545 3.568z" />
								</svg>
								<a href="#" className="hover:underline">
									YouTube
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{/* Bottom: Copyright and Policies */}
			<div className="max-w-7xl mx-auto px-4 mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
				<p className="text-gray-500 text-sm">
					&copy; {new Date().getFullYear()} LAB-Control. All rights reserved.
				</p>
				<div className="flex space-x-6 text-sm">
					<a href="#" className="hover:underline text-gray-700">
						Privacy Policy
					</a>
					<a href="#" className="hover:underline text-gray-700">
						Terms of Service
					</a>
					<a href="#" className="hover:underline text-gray-700">
						Cookies Settings
					</a>
				</div>
			</div>
		</section>
	);
}
