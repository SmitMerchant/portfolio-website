import { PROFILE, EXPERIENCE, EDUCATION, PROJECTS, SKILLS } from './data.js'

// Saved facts keep the guide useful without spending tokens when AI is disabled.
export function portfolioAnswer(question) {
  const text = question.toLowerCase()
  if (/contact|email|hire|hiring|reach|cv|resume/.test(text)) {
    return `You can reach Smit at ${PROFILE.email}. His CV is available from the portfolio's download link.`
  }
  if (/education|degree|university|studied|masters|bachelors/.test(text)) {
    return EDUCATION.map((item) => `${item.degree}, ${item.school} (${item.date}).`).join(' ')
  }
  if (/skill|tech|stack|language|framework/.test(text)) {
    return `Smit works with ${SKILLS.map((group) => group.items.join(', ')).join('; ')}.`
  }
  if (/project|built|build|dissertation/.test(text)) {
    return `His projects include ${PROJECTS.map((project) => project.title).join(', ')}. The Projects section has details of each.`
  }
  if (/working|work|experience|current|now|adtecher|job/.test(text)) {
    const job = EXPERIENCE[0]
    return `${job.role} at ${job.company}, ${job.location} (${job.date}). ${job.points.join(' ')}`
  }
  return `${PROFILE.name} is an ${PROFILE.role} based in ${PROFILE.location}. Ask about his work, skills, education, projects or contact details. For other questions, email ${PROFILE.email}.`
}
