package org.example.Controllers;

import org.example.Entities.Movie;
import org.example.Services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @GetMapping
    public List<Movie> getAllMovies(
            Principal principal,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false, defaultValue = "asc") String sort) {

        return movieService.getAllMovies(principal.getName(), title, genre, sort);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id)
                .map(movie -> ResponseEntity.ok().body(movie))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Movie createMovie(Principal principal, @RequestBody Movie movie) {
        return movieService.createMovie(principal.getName(), movie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(Principal principal, @PathVariable Long id, @RequestBody Movie movieDetails) {
        try {
            Movie updatedMovie = movieService.updateMovie(principal.getName(), id, movieDetails);
            return ResponseEntity.ok(updatedMovie);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(Principal principal, @PathVariable Long id) {
        try {
            movieService.deleteMovie(principal.getName(), id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
