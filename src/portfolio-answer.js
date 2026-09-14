import { PROFILE, EXPERIENCE, EDUCATION, PROJECTS, SKILLS } from './data.js'

const CONTACT = `You can reach Smit at ${PROFILE.email}.`

function normaliseConversation(input) {
  if (typeof input === 'string') return [{ role: 'user', content: input }]
  if (!Array.isArray(input)) return []
  return input.filter(
    (message) => message?.role === 'user' && typeof message.content === 'string',
  )
}

function topicFor(text) {
  if (/\b(visa|sponsor(?:ship)?|right[ -]to[ -]work|immigration)\b/.test(text)) return 'visa'
  if (/\b(address|where does he live|home|postcode)\b/.test(text)) return 'address'
  if (/\b(master'?s?|msc|degree|education|university|studied|bachelor'?s?)\b/.test(text)) return 'education'
  if (PROJECTS.some((project) => text.includes(project.title.toLowerCase()))) return 'projects'
  if (/\b(projects?|portfolio|built|build|dissertation)\b/.test(text)) return 'projects'
  if (/\b(skills?|tech|stack|language|framework|tools?)\b/.test(text)) return 'skills'
  if (/\b(work|working|experience|current|now|adtecher|job|role)\b/.test(text)) return 'experience'
  if (/\b(contact|email|hire|hiring|reach|cv|resume|résumé)\b/.test(text)) return 'contact'
  return null
}

function educationAnswer(text) {
  if (/\b(score|scored|grade|mark|percentage|gpa|how much)\b/.test(text)) {
    return "Smit's overall Master's grade is not listed in the portfolio, so I don't want to guess. The 89.4% figure shown on the site is dissertation model accuracy, not his degree grade. You can ask Smit directly for his academic result."
  }
  return EDUCATION.map((item) => `${item.degree}, ${item.school} (${item.date}).`).join(' ')
}

function projectsAnswer(text) {
  const named = PROJECTS.find((project) => text.includes(project.title.toLowerCase()))
  if (named) return `${named.title}: ${named.blurb} Technologies: ${named.tech.join(', ')}.`

  if (/\b(best|top|strongest|featured|highlight)\b/.test(text)) {
    return "Three strong highlights are LeadGen Pro, a full-stack AI sales product; Smart Search for Research Expert Connections, an applied NLP and researcher-matching project; and his surveillance dissertation, which achieved 89.4% model accuracy at 31 FPS. The best one to discuss depends on whether the role focuses on product engineering, NLP or computer vision."
  }

  return `Smit's projects include ${PROJECTS.map((project) => project.title).join(', ')}. Tell me which one interests you and I can give you its purpose and technology stack.`
}

function skillsAnswer() {
  return SKILLS.map((group) => `${group.group}: ${group.items.join(', ')}`).join('. ') + '.'
}

function experienceAnswer(text) {
  const job = EXPERIENCE[0]
  if (/\b(ai|artificial intelligence|machine learning|ml)\b/.test(text)) {
    return `Smit has an MSc in Artificial Intelligence and experience across applied NLP, computer vision and production AI systems. At ${job.company}, he built a five-phase AI sales-intelligence pipeline; his dissertation combined ResNet-34 and a 3D CNN and achieved 89.4% model accuracy at 31 FPS.`
  }
  return `${job.role} at ${job.company}, ${job.location} (${job.date}). ${job.points.join(' ')}`
}

// Saved facts keep the guide useful without spending tokens when AI is disabled.
// Short follow-ups inherit the latest identifiable topic from earlier user turns.
export function portfolioAnswer(input) {
  const conversation = normaliseConversation(input)
  const current = conversation.at(-1)?.content.trim().toLowerCase() || ''

  if (/^(hi|hello|hey|hiya|good (morning|afternoon|evening))[!.?]*$/.test(current)) {
    return `Hi! I can help with Smit's experience, projects, skills, education and public contact details. What would you like to know?`
  }
  if (/^(thanks?|thank you|cheers)[!.?]*$/.test(current)) {
    return "You're welcome. Ask me anything else about Smit's portfolio."
  }

  const currentTopic = topicFor(current)
  const previousWithTopic = [...conversation.slice(0, -1)]
    .reverse()
    .find((message) => topicFor(message.content.toLowerCase()))
  const inheritedTopic = previousWithTopic ? topicFor(previousWithTopic.content.toLowerCase()) : null
  const topic = currentTopic || inheritedTopic
  const contextualText = currentTopic
    ? current
    : `${previousWithTopic?.content.toLowerCase() || ''} ${current}`.trim()

  if (topic === 'visa') {
    return `Smit's visa, right-to-work and sponsorship status is not stated in the portfolio. ${CONTACT} Please confirm it with him directly.`
  }
  if (topic === 'address') {
    return `The portfolio only publishes Smit's location as ${PROFILE.location}; it does not publish a private street address. ${CONTACT}`
  }
  if (topic === 'education') {
    if (!currentTopic && /^[?!.\s]*$/.test(current)) {
      return "If you mean his Master's grade: it isn't published. The 89.4% on the site is model accuracy, not a degree score."
    }
    if (!currentTopic && /\bhow much\b/.test(current)) {
      return "The exact Master's grade isn't published. The only percentage listed is 89.4%, which is dissertation model accuracy rather than his degree result."
    }
    return educationAnswer(contextualText)
  }
  if (topic === 'projects') return projectsAnswer(contextualText)
  if (topic === 'skills') return skillsAnswer()
  if (topic === 'experience') return experienceAnswer(contextualText)
  if (topic === 'contact') {
    return `${CONTACT} His CV is available from the portfolio's résumé download link.`
  }

  if (/^[?!.\s]*$/.test(current) || current.split(/\s+/).length < 3) {
    return "I didn't quite understand that. Try asking about Smit's current role, strongest projects, technical skills, education, location, visa status or contact details."
  }
  return `I don't have that detail in Smit's published portfolio, so I don't want to guess. ${CONTACT}`
}
