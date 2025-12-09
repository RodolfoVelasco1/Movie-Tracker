package org.example.Repositories;

import org.example.Entities.Series;
import org.example.Entities.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeriesRepository extends JpaRepository<Series, Long> {
    List<Series> findByUser(User user);

    // 💡 Buscar por Usuario y Filtros (si usas el filtro de género)
    List<Series> findByUserAndGenresName(User user, String genreName);

    // Si usas Sort, Spring Data lo aplica automáticamente al resultado
    List<Series> findByUser(User user, Sort sort);
    List<Series> findByUserAndGenresName(User user, String genreName, Sort sort);
}
