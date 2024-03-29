const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    movie_id: {
      type: Number,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    overview: {
      type: String,
    },
    tagline: {
      type: String,
    },
    status: {
      type: String,
    },
    runtime: {
      type: Number,
    },
    release_date: {
      type: String,
    },
    poster_path: {
      type: String,
    },
    backdrop_path: {
      type: String,
    },
    imdb_id: {
      type: String,
    },
    year: {
      type: Number,
    },
    genres: {
      type: Array,
    },
    content_type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const movieModel = mongoose.model('Movie', movieSchema);

module.exports = movieModel;
