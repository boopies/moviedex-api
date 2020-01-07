require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./movies-data-small')

const app = express()

app.use(morgan('dev'))
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
    const {genre='', country='', votes=''} = req.query;
    let resultsFiltered = MOVIEDEX;

    if (genre){
            resultsFiltered = MOVIEDEX.filter(movie =>
                                movie.genre
                                    .toLowerCase()
                                    .includes(genre.toLowerCase()));
    }
    
    if (country){
        resultsFiltered = MOVIEDEX.filter(movie =>
                            movie.country
                                .toLowerCase()
                                .includes(country.toLowerCase()));
}
    
    if (votes){
        resultsFiltered = MOVIEDEX.filter(movie =>
                           {return movie.avg_vote >= Number(votes)});
    }
    
    res.json(resultsFiltered)
}


  app.get('/movie', handleGetMovies)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})