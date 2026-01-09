import Movie from '../models/movie.model.js';
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: movies.length,
      data: { movies }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const movieDetails = async (req, res) => {
  try {
    const{search,genres,releaseDate,title,duration,rating,sort="latest"}=req.query;
    const query={};
    if(search || title){
      query.title={$regex:search,$options:"i"};
    }if(genres){
      query.genres={$in:genres.split(",")};
    }
    if(releaseDate){
      query.releaseDate=new Date(releaseDate);
    }
    if(rating){
      query.rating={$gte:rating};
    }
    if(duration){
      query.duration={$lte:duration};
    }
    let sortOption={};
    if(sort==="latest"){
      sortOption={createdAt:-1};
    }else{
      sortOption={createdAt:1};
    }
    const movie = await Movie.findOne(query).sort(sortOption);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    res.status(200).json({
      success: true,
      data: { movie }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      data: { movie }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    res.status(200).json({
      success: true,
      data: { movie }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    res.status(200).json({
      success: true,
      data: { movie }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};
