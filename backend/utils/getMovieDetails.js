const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function getMovieDetails(movie_id) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movie_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${  process.env.TMDB_API_READ_ACCESS_TOKEN}`,
      },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

module.exports = getMovieDetails;
