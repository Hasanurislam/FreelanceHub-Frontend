import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Component/Navbar'; 

const About = () => {
  const teamMembers = [
    {
      name: 'Hasanur Islam',
      role: 'Founder & CEO',
      imageUrl: '/public/WhatsApp Image 2024-09-19 at 22.31.04_e0d1889a.jpg',
      bio: 'Jane is the visionary behind FreelanceHub, dedicated to creating a fair and efficient marketplace for freelancers and clients.'
    },
    {
      name: 'John Smith',
      role: 'Chief Technology Officer',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=60',
      bio: 'John leads our technology team, ensuring the platform is secure, scalable, and user-friendly.'
    },
    {
      name: 'Emily White',
      role: 'Head of Community',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=60',
      bio: 'Emily is passionate about supporting our users and fostering a vibrant, collaborative community.'
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gray-50 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Our Mission is to Empower <span className="text-purple-700">Freelancers</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              We believe in a world where anyone can build a business from their passion. We're here to connect talented individuals with the opportunities they deserve.
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 text-lg mb-4">
                  Founded in 2024, FreelanceHub was born from a simple idea: to create a more transparent, efficient, and rewarding way for freelancers and clients to connect. We saw the challenges in the traditional freelance market and knew there had to be a better way.
                </p>
                <p className="text-gray-600 text-lg">
                  Today, we are a thriving community of thousands of users from around the globe, all working together to build amazing things.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80" 
                  alt="Our team collaborating" 
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900">Meet Our Team</h2>
              <p className="mt-4 text-lg text-gray-600">The passionate individuals behind our platform.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-white text-center rounded-lg shadow-lg p-8 transform hover:-translate-y-2 transition-transform duration-300">
                  <img 
                    className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-purple-200" 
                    src={member.imageUrl} 
                    alt={member.name}
                  />
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-purple-700 font-semibold">{member.role}</p>
                  <p className="mt-4 text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900">Join Our Growing Community</h2>
            <p className="mt-4 text-lg text-gray-600">
              Whether you're looking to hire top talent or find your next project, FreelanceHub is the place for you.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/gigs" className="bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-purple-800 transition-colors">
                Find Talent
              </Link>
              <Link to="/become-seller" className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-300 transition-colors">
                Become a Seller
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
