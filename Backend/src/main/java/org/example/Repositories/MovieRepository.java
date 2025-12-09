package org.example.Repositories;

import org.example.Entities.Movie;
import org.example.Entities.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByUserAndGenresName(User user, String genreName);

    List<Movie> findByUser(User user, Sort sort);
    List<Movie> findByUserAndGenresName(User user, String genreName, Sort sort);
}
