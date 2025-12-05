package org.example.Repositories;

import org.example.Entities.Movie;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByTitleOrderByTitleAsc(String title);
    List<Movie> findByTitleAndGenresNameOrderByTitleAsc(String title, String genreName);

    List<Movie> findByGenresName(String name, Sort sort);

    List<Movie> findByGenresNameOrderByTitleAsc(String genreName);
}
