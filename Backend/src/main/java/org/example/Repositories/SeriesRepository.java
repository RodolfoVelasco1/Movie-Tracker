package org.example.Repositories;

import org.example.Entities.Series;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeriesRepository extends JpaRepository<Series, Long> {
    List<Series> findByTitleOrderByTitleAsc(String title);
    List<Series> findByTitleAndGenresNameOrderByTitleAsc(String title, String genreName);

    List<Series> findByGenresNameOrderByTitleAsc(String genreName);

    List<Series> findByGenresName(String name, Sort sort);
}
