
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

const internships = [
  {
    id: 'web-development',
    title: 'Web Development Intern',
    company: 'TechNova',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹8,000/month',
    description: 'Build responsive web applications and work with modern frontend and backend technologies.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics Intern',
    company: 'DataSphere',
    location: 'Chennai',
    duration: '2 months',
    stipend: '₹7,000/month',
    description: 'Analyze datasets, prepare reports, and discover useful business insights.',
    skills: ['Python', 'SQL', 'Excel', 'Data Visualization'],
  },
  {
    id: 'backend-development',
    title: 'Backend Development Intern',
    company: 'CodeCraft',
    location: 'Hybrid',
    duration: '3 months',
    stipend: '₹10,000/month',
    description: 'Develop REST APIs and work with databases and server-side applications.',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Intern',
    company: 'PixelWorks',
    location: 'Remote',
    duration: '2 months',
    stipend: '₹6,000/month',
    description: 'Design user-friendly interfaces and improve digital product experiences.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'UI Design'],
  },
];

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Internship Portal API is running' });
});

router.get('/internships', (req, res) => {
  res.json(internships);
});

router.get('/internships/:id', (req, res) => {
  const internship = internships.find(
    (item) => item.id === req.params.id
  );

  if (!internship) {
    return res.status(404).json({ error: 'Internship not found' });
  }

  res.json(internship);
});

router.post('/applications', async (req, res) => {
  try {
    const { studentName, email, rollNumber, internship } = req.body;

    if (!studentName || !email || !rollNumber || !internship) {
      return res.status(400).json({
        error: 'All fields are required.',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        error: 'Please enter a valid email address.',
      });
    }

    const selectedInternship = internships.find(
      (item) => item.id === internship
    );

    if (!selectedInternship) {
      return res.status(400).json({
        error: 'Please select a valid internship.',
      });
    }

    const application = await Application.create({
      studentName,
      email,
      rollNumber,
      internship,
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: {
        ...application.toObject(),
        internshipTitle: selectedInternship.title,
        company: selectedInternship.company,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.error('Application submission failed:', error);
    res.status(500).json({
      error: 'Unable to submit the application. Please try again.',
    });
  }
});

router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();

    const results = applications.map((application) => {
      const internship = internships.find(
        (item) => item.id === application.internship
      );

      return {
        ...application,
        internshipTitle: internship?.title || 'Unknown internship',
        company: internship?.company || 'Unknown company',
      };
    });

    res.json(results);
  } catch (error) {
    console.error('Fetching applications failed:', error);
    res.status(500).json({
      error: 'Unable to fetch applications.',
    });
  }
});

module.exports = router;
