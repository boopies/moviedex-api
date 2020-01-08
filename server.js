require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./movies-data')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
       }
  next()
  })
 
  function handleGetMovies(req, res) {
    const {genre='', country='', avg_vote=''} = req.query;
    let resultsFiltered = MOVIEDEX;

    if (genre){
            resultsFiltered = resultsFiltered.filter(movie =>
                                movie.genre
                                    .toLowerCase()
                                    .includes(genre.toLowerCase()));
    }
    
    if (country){
        resultsFiltered = resultsFiltered.filter(movie =>
                            movie.country
                                .toLowerCase()
                                .includes(country.toLowerCase()));
}
    
    if (avg_vote){
        resultsFiltered = resultsFiltered.filter(movie =>
                           Number(movie.avg_vote) >= Number(avg_vote));
    }
    
    res.json(resultsFiltered)
}

  app.get('/movie', handleGetMovies)

  app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

  const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
})