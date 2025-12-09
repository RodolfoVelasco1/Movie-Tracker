package org.example.Services;

import jakarta.transaction.Transactional;
import org.example.Entities.Genre;
import org.example.Entities.Movie;
import org.example.Entities.Series;
import org.example.Entities.User;
import org.example.Repositories.GenreRepository;
import org.example.Repositories.MovieRepository;
import org.example.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Sort;

@Service
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public List<Movie> getAllMovies(String username, String title, String genreName, String sortDirection) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sort sort = Sort.by("title");
        if ("desc".equalsIgnoreCase(sortDirection)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        if (genreName != null && !genreName.isEmpty()) {
            return movieRepository.findByUserAndGenresName(currentUser, genreName, sort);
        }

        return movieRepository.findByUser(currentUser, sort);
    }

    @Transactional
    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }


    @Transactional
    public Movie createMovie(String username, Movie movie) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        movie.setUser(currentUser);

        return movieRepository.save(movie);
    }


    @Transactional
    public Movie updateMovie(String username, Long id, Movie movieDetails) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        if (!movie.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not allowed to edit this movie");
        }

        movie.setTitle(movieDetails.getTitle());
        movie.setSummary(movieDetails.getSummary());
        movie.setDuration(movieDetails.getDuration());
        movie.setImageUrl(movieDetails.getImageUrl());
        movie.setGenres(movieDetails.getGenres());

        Set<Genre> genresFromDb = new HashSet<>();

        for (Genre incompleteGenre : movieDetails.getGenres()) {
            Genre realGenre = genreRepository.findById(incompleteGenre.getId())
                    .orElseThrow(() -> new RuntimeException("Genre not found with id: " + incompleteGenre.getId()));
            genresFromDb.add(realGenre);
        }

        movie.setGenres(genresFromDb);

        if (movieDetails.getStatus() != null) {
            movie.setStatus(movieDetails.getStatus());
        }

        return movieRepository.save(movie);
    }

    @Transactional
    public void deleteMovie(String username, Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
        if (!movie.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not allowed to delete this movie");
        }
        movieRepository.delete(movie);
    }


}
