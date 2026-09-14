import test from 'node:test'
import assert from 'node:assert/strict'
import { portfolioAnswer } from '../src/portfolio-answer.js'

const conversation = (...content) => content.map((text, index) => ({
  role: index % 2 === 0 ? 'user' : 'assistant',
  content: text,
}))

test('answers greetings naturally', () => {
  assert.match(portfolioAnswer('hi'), /^Hi!/)
})

test('keeps education context for short follow-ups without inventing a grade', () => {
  const messages = conversation(
    'how much did he score in masters',
    'His education is listed.',
    'how much?',
  )
  const answer = portfolioAnswer(messages)
  assert.match(answer, /exact Master's grade isn't published/)
  assert.match(answer, /89\.4%.*model accuracy rather than his degree result/)
})

test('keeps context through a punctuation-only follow-up', () => {
  const messages = conversation(
    'how much did he score in masters',
    'That result is not listed.',
    'how much?',
    'That result is not listed.',
    '?',
  )
  assert.match(portfolioAnswer(messages), /If you mean his Master's grade/)
})

test('protects private address and does not infer visa status', () => {
  assert.match(portfolioAnswer('what is the address'), /only publishes.*Sheffield, UK/i)
  assert.match(portfolioAnswer('visa?'), /not stated/i)
})

test('distinguishes a best-project question from a project list', () => {
  const list = portfolioAnswer('projects?')
  const best = portfolioAnswer('best projects')
  assert.match(list, /projects include/)
  assert.match(best, /Three strong highlights/)
  assert.notEqual(list, best)
})

test('varies repeated education follow-ups while preserving the answer', () => {
  const first = portfolioAnswer('how much did he score in masters')
  const followUp = portfolioAnswer(conversation(
    'how much did he score in masters',
    first,
    'how much?',
  ))
  const punctuation = portfolioAnswer(conversation(
    'how much did he score in masters',
    first,
    'how much?',
    followUp,
    '?',
  ))
  assert.match(followUp, /exact Master's grade isn't published/)
  assert.match(punctuation, /If you mean his Master's grade/)
  assert.notEqual(first, followUp)
  assert.notEqual(followUp, punctuation)
})

test('gives details for a named project', () => {
  const answer = portfolioAnswer('Tell me about LeadGen Pro')
  assert.match(answer, /SaaS lead-generation tool/)
  assert.match(answer, /Next\.js 14/)
})

test('asks for clarification instead of repeating a profile blurb', () => {
  assert.match(portfolioAnswer('?'), /didn't quite understand/)
})
