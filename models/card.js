const path = require('path')
const fs = require('fs')
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'card.json'
)

class Card {
  static async add(course) {
    const card = await Card.fetch()

    const idx = card.courses.findIndex(c => c.id === course.id)
    const candidate = card.courses[idx] 
    
    if(candidate) {
      candidate.count++
      card.courses[idx] = candidate

    } else {
      course.count = 1
      card.courses.push(course)
    }

    card.price += +course.price
    return new Promise((resolve, rejects) => {
      fs.writeFile(p, JSON.stringify(card), err => {
        if(err) {
          rejects(err)
        } else {
          resolve()
        }
      })
    })
  }

  static async remove(id) {
    const card = await Card.fetch()
    const idx = card.courses.findIndex(c => c.id === id)
    const course = card.courses[idx]

    if(course.count === 1) {
      card.courses = card.courses.filter(c => c.id !== id)
    } else {
      card.courses[idx].count--
    }
    card.price -= course.price

    return new Promise((resolve, rejects) => {
      fs.writeFile(p, JSON.stringify(card), err => {
        if(err) {
          rejects(err)
        } else {
          resolve(card)
        }
      })
    })
  }

  static async fetch() {
    return new Promise((resolve, rejects) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if(err) {
          rejects(err)
        } else {
          resolve(JSON.parse(content))
        }
      })
    })
  }
}
module.exports = Card