import { Project, Education } from '../types';

export const projects: Project[] = [
  { id: 'proj-aiml-1', category: 'AIML', title: 'Neural Vision Engine', desc: 'Real-time object detection using TensorFlow.js and custom CNN models.', tags: ['Python', 'TensorFlow', 'React'] },
  { id: 'proj-aiml-2', category: 'AIML', title: 'NLP Sentiment Bot', desc: 'Analyzes massive social media feeds to predict market trends with BERT.', tags: ['BERT', 'FastAPI', 'Node.js'] },
  { id: 'proj-mern-1', category: 'MERN', title: 'Eco-Marketplace', desc: 'Full-stack e-commerce with Stripe integration and redundant DB architecture.', tags: ['MongoDB', 'Express', 'React', 'Node'] },
  { id: 'proj-mern-2', category: 'MERN', title: 'DevFlow Social', desc: 'A social network for developers with real-time code sharing and chat.', tags: ['Socket.io', 'Redux', 'Mongoose'] },
  { id: 'proj-rn-1', category: 'React Native', title: 'FitTrack Pro', desc: 'Cross-platform health tracking app with Apple Health & Google Fit sync.', tags: ['Expo', 'Redux', 'Firebase'] },
  { id: 'proj-rn-2', category: 'React Native', title: 'GeoSafe', desc: 'Family location sharing app with geofencing and emergency alerts.', tags: ['Maps SDK', 'Node.js', 'Native Modules'] },
];

export const educationHistory: Education[] = [
  {
    id: 'edu-be',
    degree: 'BE - Computer Science',
    institution: 'University of Engineering',
    score: 'CGPA: 9.02',
    passout: '2024',
    details: 'Specialized in Artificial Intelligence and Cloud Computing.'
  },
  {
    id: 'edu-12th',
    degree: '12th (Higher Secondary)',
    institution: 'DNC College of Arts, Commerce and Science',
    score: 'Percentage: 75%',
    board: 'Maharashtra State Board',
    passout: '2018',
    details: 'Science stream with focus on Information Technology.'
  },
  {
    id: 'edu-10th',
    degree: '10th (Secondary School)',
    institution: 'Godavari English Medium CBSE School, Jalgaon, Maharashtra',
    score: 'Percentage: 79%',
    board: 'CBSE',
    passout: '2018',
    details: 'All-round performance with distinction in Mathematics.'
  }
];
