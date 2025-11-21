import { useEffect, useState } from 'react';

// --- MOCKED API IMPLEMENTATION ---
// Since we are generating a single, self-contained file, we define a mock API 
// here to allow the ContactForm to be functional without an external file.
const contactApi = {
  submit: async (data) => {
    console.log("Submitting form data:", data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful response (90% success rate)
    if (Math.random() > 0.1) {
      return { success: true };
    } else {
      // Simulate an error
      throw new Error("Simulated network failure. Could not reach server.");
    }
  }
};
// ----------------------------------

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState(''); // 'sending', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear status/errors on change
    if (errorMessage) {
      setErrorMessage('');
      setFormStatus('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setErrorMessage('');

    try {
      const result = await contactApi.submit(formData);
      // Check for success property in result, defaulting to true if response is minimal
      if (result?.success ?? true) {
        setFormStatus('success');
        // Reset form data after successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus('error');
        setErrorMessage('Failed to submit contact form. Please try again.');
      }
    } catch (err) {
      setFormStatus('error');
      setErrorMessage(
        err?.message ||
          'Sorry, there was an error sending your message. Please try again.',
      );
      console.error('Contact form error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition duration-150"
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition duration-150"
        />
      </div>

      <div>
        <input
          type="text"
          name="subject"
          placeholder="Subject (Optional)"
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition duration-150"
        />
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          value={formData.message}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition duration-150"
        />
      </div>

      <button
        type="submit"
        disabled={formStatus === 'sending'}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
      >
        {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      {/* Status Messages */}
      {formStatus === 'success' && (
        <div className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
          Thank you! Your message has been sent successfully.
        </div>
      )}

      {formStatus === 'error' && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {errorMessage ||
            'Sorry, there was an error sending your message. Please try again.'}
        </div>
      )}
    </form>
  );
};

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    description: '',
    technologies: '',
  });

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Portfolio Website',
      description:
        'Personal portfolio to showcase projects, technical skills, and achievements. Built for high performance and SEO.',
      technologies: ['Next.js', 'React', 'Node.js', 'CSS', 'Vercel'],
    },
    {
      id: 2,
      title: 'Hospital Management System',
      description:
        'Simple system for managing patient records with file-based storage and retrieval, implemented in a low-level language.',
      technologies: ['C', 'File Handling', 'CLI'],
    },
  ]);

  const skills = [
    { name: 'C', level: 70 },
    { name: 'C++', level: 65 },
    { name: 'HTML', level: 80 },
    { name: 'CSS', level: 75 },
    { name: 'JavaScript (learning)', level: 55 },
    { name: 'Next.js (learning)', level: 50 },
  ];

  // Effect for handling header scroll state
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Function for smooth scrolling to sections
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset by the fixed header height (approx 80px)
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking a link
  };

  // Logic to add a new project from the modal
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectData.title || !newProjectData.description) return;

    const newProject = {
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1, // Ensure unique ID
      title: newProjectData.title,
      description: newProjectData.description,
      // Split comma-separated string into array
      technologies: newProjectData.technologies.split(',').map(t => t.trim()).filter(t => t),
    };

    setProjects([...projects, newProject]);
    setNewProjectData({ title: '', description: '', technologies: '' });
    setIsModalOpen(false);
  };

  // Define a custom Tailwind gradient class for the Hero section
  const heroGradientStyle = {
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)' // blue-50 to indigo-100 equivalent
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
        }`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-extrabold text-blue-600 tracking-wider">
              Sumit Pathak
            </div>

            {/* Desktop Menu (Visible on md and up) */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'projects', 'skills', 'contact'].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors capitalize"
                >
                  {id}
                </button>
              ))}
              <a
                href="https://www.linkedin.com/in/sumit-pathak-444441354"
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold shadow-md"
              >
                LinkedIn
              </a>
            </div>

            {/* Mobile Menu Button (Visible only below md) */}
            <button
              className="md:hidden text-gray-700 text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </nav>

          {/* Mobile Menu Dropdown (Responsive) */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 transition-all duration-300 transform origin-top animate-fade-in-down">
              <div className="flex flex-col space-y-4 px-4">
                {['home', 'about', 'projects', 'skills', 'contact'].map((id) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="text-gray-700 hover:text-blue-600 transition-colors text-left py-2 border-b border-gray-100 capitalize"
                  >
                    {id}
                  </button>
                ))}
                <a
                  href="https://www.linkedin.com/in/sumit-pathak"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors w-full text-center font-semibold"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center pt-20"
        style={heroGradientStyle}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                Hi, I&apos;m <span className="text-blue-600">Sumit Pathak</span>
              </h1>
              <h2 className="text-xl sm:text-2xl text-gray-600 mb-6 font-light">
                BCA Student · Aspiring Web Developer
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0">
                Motivated and self-driven, passionate about programming and
                technology. I focus on creating clean, effective digital experiences
                and I'm currently strengthening my skills in JavaScript and Next.js.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105 font-semibold"
                >
                  See Projects
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors transform hover:scale-105 font-semibold"
                >
                  Contact Me
                </button>
              </div>
            </div>

            {/* Graphic (Minor responsiveness adjustment applied here) */}
            <div className="lg:w-1/2 relative flex justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl transform rotate-3 transition duration-500">
                <div className="text-white text-6xl">
                  {/* Icon or Avatar */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code-xml"><path d="M16 18l4-4-4-4"/><path d="M8 6l-4 4 4 4"/></svg>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 sm:top-4 sm:-left-8 bg-white px-4 py-2 rounded-full shadow-lg animate-float-slow text-sm sm:text-base font-medium text-gray-700">
                Next.js
              </div>
              <div
                className="absolute top-1/2 -right-4 sm:right-0 bg-white px-4 py-2 rounded-full shadow-lg animate-float-slow text-sm sm:text-base font-medium text-gray-700"
                style={{ animationDelay: '0.5s' }}
              >
                C / C++
              </div>
              <div
                className="absolute -bottom-4 left-1/4 bg-white px-4 py-2 rounded-full shadow-lg animate-float-slow text-sm sm:text-base font-medium text-gray-700"
                style={{ animationDelay: '1s' }}
              >
                HTML/CSS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              About Me
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              BCA at Anugrah Memorial College, Gaya. Strong problem-solving,
              quick to learn new tech, and a solid team player.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
              Creating digital experiences that matter
            </h3>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                I focus on clean, maintainable code and simple, effective UI.
                Currently strengthening my foundation in web development, 
                particularly with JavaScript and modern frameworks like Next.js, 
                while also having a strong background in C and C++ for logic and problem-solving.
              </p>
            </div>

            {/* Responsive Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-blue-50 rounded-xl shadow-md border-t-4 border-blue-400">
                <div className="text-3xl font-bold text-blue-600 mb-2">2+</div>
                <div className="text-gray-700 font-medium">Projects Completed</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl shadow-md border-t-4 border-blue-400">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  2021–Now
                </div>
                <div className="text-gray-700 font-medium">BCA, AMC Gaya</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl shadow-md border-t-4 border-blue-400">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  Gaya
                </div>
                <div className="text-gray-700 font-medium">Bihar, India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              My Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              A few things I’ve built recently. Click below to add your own ideas!
            </p>

            {/* Add Project Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg transform hover:scale-105 font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Project
            </button>
          </div>

          {/* Responsive Project Grid: 1 col on mobile, 2 on md, 3 on lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 transform hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="h-48 bg-linear-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                  <div className="text-white text-4xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2Z"/><path d="M2 10h20"/></svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-base">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              My Skills
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Focusing on fundamentals while rapidly acquiring modern web technologies.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 text-lg">
                    {skill.name}
                  </span>
                  <span className="text-blue-600 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-linear-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let&apos;s talk!
            </p>
          </div>

          {/* Responsive Contact Layout: 1 col on mobile, 2 on lg */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-blue-400">Contact Information</h3>
              <div className="space-y-6">
                
                <div className="flex items-start space-x-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl shadow-md">
                    📧
                  </div>
                  <div>
                    <p className="font-medium text-lg">Email</p>
                    <p className="text-gray-300">
                      <a
                        href="mailto:sumitpathak219@gmail.com"
                        className="hover:text-blue-400 transition-colors wrap-break-word"
                      >
                        sumitpathak219@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl shadow-md">
                    📱
                  </div>
                  <div>
                    <p className="font-medium text-lg">Phone</p>
                    <p className="text-gray-300">
                      <a href="tel:+916287041170" className="hover:text-blue-400 transition-colors">
                        +91 62870 41170
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl shadow-md">
                    🔗
                  </div>
                  <div>
                    <p className="font-medium text-lg">LinkedIn</p>
                    <p className="text-gray-300">
                      <a
                        href="https://www.linkedin.com/in/sumit-pathak"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-400 transition-colors wrap-break-word"
                      >
                        linkedin.com/in/sumit-pathak
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl shadow-md">
                    📍
                  </div>
                  <div>
                    <p className="font-medium text-lg">Location</p>
                    <p className="text-gray-300">Gaya, Bihar, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-blue-400">Send a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Sumit Pathak. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://www.linkedin.com/in/sumit-pathak"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:sumitpathak219@gmail.com"
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              Email
            </a>
            <a
              href="tel:+916287041170"
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              Call
            </a>
          </div>
        </div>
      </footer>

      {/* Add Project Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full transform scale-100 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Add New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition duration-150"
                  placeholder="e.g. E-commerce Site"
                  value={newProjectData.title}
                  onChange={(e) => setNewProjectData({...newProjectData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition duration-150"
                  placeholder="Brief description of the project..."
                  value={newProjectData.description}
                  onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Technologies (Comma Separated)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition duration-150"
                  placeholder="React, Node.js, CSS"
                  value={newProjectData.technologies}
                  onChange={(e) => setNewProjectData({...newProjectData, technologies: e.target.value})}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Save Project
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom CSS for Animations */}
      {/* Removed "jsx global" to fix the non-boolean attribute warning */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;