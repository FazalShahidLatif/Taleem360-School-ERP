/**
 * Taleem360 AI Learning - Course Catalog
 * 
 * This data is extracted from the legacy WordPress ecosystem.
 * Includes Core ERP modules and AI-driven curriculum.
 */

const courses = [
  {
    id: 'c1',
    slug: 'intro-to-ai',
    title: 'Introduction to Artificial Intelligence',
    description: 'A comprehensive guide to foundational AI concepts, designed to align with Pakistan\'s new 10th-grade curriculum. Learn about machine learning, neural networks, and the future of technology.',
    icon: '🤖',
    level: 'Beginner',
    lessons: 12,
    duration: '6 Hours',
    isFree: true,
    category: 'AI Learning',
    content: `
      <h3>Module Overview</h3>
      <p>This module introduces students to the world of Artificial Intelligence. We cover the history, types of AI, and how it is reshaping the world around us.</p>
      <h3>What you will learn</h3>
      <ul>
        <li>Defining AI, ML, and Deep Learning</li>
        <li>Understanding how AI "thinks"</li>
        <li>Real-world applications of AI in Pakistan</li>
        <li>Ethical considerations in AI development</li>
      </ul>
    `
  },
  {
    id: 'c2',
    slug: 'notebooklm-mastery',
    title: 'Mastering NotebookLM',
    description: 'Learn how to use Google\'s NotebookLM for research, study, and project management. Perfect for students and researchers looking to supercharge their productivity with AI.',
    icon: '📓',
    level: 'Intermediate',
    lessons: 8,
    duration: '4 Hours',
    isFree: true,
    category: 'AI Learning',
    content: `
      <h3>Module Overview</h3>
      <p>NotebookLM is a game-changer for information management. This course shows you how to turn your notes and documents into interactive AI-powered knowledge bases.</p>
      <h3>What you will learn</h3>
      <ul>
        <li>Setting up your first notebook</li>
        <li>Feeding the AI: Sources and citations</li>
        <li>Using AI to summarize and cross-reference</li>
        <li>Generating project ideas and outlines</li>
      </ul>
    `
  },
  {
    id: 'c3',
    slug: 'ai-powered-freelancing',
    title: 'AI-Powered Freelancing',
    description: 'Transform your AI skills into a sustainable income. Learn how to use Generative AI tools to deliver premium services on Fiverr and Upwork.',
    icon: '💰',
    level: 'Advanced',
    lessons: 15,
    duration: '10 Hours',
    isFree: false,
    category: 'Economic Empowerment',
    content: `
      <h3>Module Overview</h3>
      <p>Stop working harder, start working smarter. This course bridges the gap between knowing AI and earning with AI in the global freelancing market.</p>
      <h3>What you will learn</h3>
      <ul>
        <li>High-demand AI services on Fiverr/Upwork</li>
        <li>Creating AI-enhanced content, images, and code</li>
        <li>Optimizing your workflow for maximum output</li>
        <li>Pricing your services and managing clients</li>
      </ul>
    `
  },
  {
    id: 'c4',
    slug: 'prompt-engineering',
    title: 'Prompt Engineering Fundamentals',
    description: 'Master the art of communicating with Large Language Models. Learn the techniques used by pros to get precise, high-quality results from ChatGPT and Claude.',
    icon: '⌨️',
    level: 'Beginner',
    lessons: 10,
    duration: '5 Hours',
    isFree: false,
    category: 'AI Learning',
    content: `
      <h3>Module Overview</h3>
      <p>The quality of your AI output depends on the quality of your prompt. This course teaches you the "language" of LLMs.</p>
      <h3>What you will learn</h3>
      <ul>
        <li>The Zero-Shot, One-Shot, and Few-Shot techniques</li>
        <li>Chain-of-Thought prompting for complex tasks</li>
        <li>Creating persona-driven prompts</li>
        <li>Debugging and refining AI outputs</li>
      </ul>
    `
  },
  {
    id: 'c5',
    slug: 'visual-ai-graphic-novels',
    title: 'Visual AI & Graphic Novels',
    description: 'Harness Midjourney and DALL-E to create stunning visuals and even your own graphic novels. A creative path to AI mastery and digital storytelling.',
    icon: '🎨',
    level: 'Intermediate',
    lessons: 14,
    duration: '8 Hours',
    isFree: false,
    category: 'Creative AI',
    content: `
      <h3>Module Overview</h3>
      <p>Unleash your creativity with Visual AI. We move beyond simple "cat photos" into complex storytelling and professional asset generation.</p>
      <h3>What you will learn</h3>
      <ul>
        <li>Advanced Midjourney parameters</li>
        <li>Character consistency across frames</li>
        <li>Layout and lettering for graphic novels</li>
        <li>Publishing your digital artwork</li>
      </ul>
    `
  },
  {
    id: 'c6',
    slug: 'ai-community-impact',
    title: 'AI for Community Impact',
    description: 'Learn how to identify local challenges in Pakistan and solve them using simple AI applications. Designed for community leaders and social entrepreneurs.',
    icon: '🌍',
    level: 'Advanced',
    lessons: 9,
    duration: '6 Hours',
    isFree: true,
    category: 'Community Uplift',
    content: `
      <h3>Module Overview</h3>
      <p>AI isn't just for Silicon Valley; it's for your neighborhood. This course focuses on practical, local problem-solving.</p>
      <h3>What you will learn</h3>
      <ul>
        <li>Identifying local data sources</li>
        <li>Building simple predictive models for agriculture/education</li>
        <li>Using AI for local language translation and accessibility</li>
        <li>Developing a community AI roadmap</li>
      </ul>
    `
  },
  {
    id: 'c7',
    slug: 'erp-student-mgmt',
    title: 'ERP: Student Management Core',
    description: 'Master the core of the Taleem360 ERP. Learn how to manage student lifecycles, attendance, and parent communication effectively.',
    icon: '🏫',
    level: 'Intermediate',
    lessons: 10,
    duration: '5 Hours',
    isFree: false,
    category: 'ERP Training',
    content: `
      <h3>Module Overview</h3>
      <p>This module trains school administrators on the fundamental student management features of the Taleem360 ERP.</p>
      <h3>What you will learn</h3>
      <ul>
        <li>Dynamic student registration and profiling</li>
        <li>Biometric and manual attendance workflows</li>
        <li>Parent portal management</li>
        <li>SMS/WhatsApp alert integration</li>
      </ul>
    `
  }
];

module.exports = courses;
