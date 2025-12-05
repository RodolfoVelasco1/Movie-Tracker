package org.example.Services;

import jakarta.transaction.Transactional;
import org.example.Entities.Genre;
import org.example.Entities.Movie;
import org.example.Entities.Series;
import org.example.Repositories.GenreRepository;
import org.example.Repositories.SeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class SeriesService {
    @Autowired
    private SeriesRepository seriesRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Transactional
    public List<Series> getAllSeries(String title, String genreName, String sortDirection) {

        Sort sort = Sort.by("title");

        if ("desc".equalsIgnoreCase(sortDirection)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        if (genreName != null && !genreName.isEmpty()) {
            return seriesRepository.findByGenresName(genreName, sort);
        }

        return seriesRepository.findAll(sort);
    }



    @Transactional
    public Optional<Series> getSeriesById(Long id) {
        return seriesRepository.findById(id);
    }

    @Transactional
    public Series createSeries(Series series) {
        return seriesRepository.save(series);
    }

    @Transactional
    public Series updateSeries(Long id, Series seriesDetails) {
        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Series not found with id: " + id));

        series.setTitle(seriesDetails.getTitle());
        series.setSummary(seriesDetails.getSummary());
        series.setDuration(seriesDetails.getDuration());
        series.setEpisodes(seriesDetails.getEpisodes());
        series.setImageUrl(seriesDetails.getImageUrl());

        Set<Genre> genresFromDb = new HashSet<>();
        if (seriesDetails.getGenres() != null) {
            for (Genre genreIncompleto : seriesDetails.getGenres()) {
                Genre genreReal = genreRepository.findById(genreIncompleto.getId())
                        .orElseThrow(() -> new RuntimeException("Genre not found"));
                genresFromDb.add(genreReal);
            }
        }
        series.setGenres(genresFromDb);

        if (seriesDetails.getStatus() != null) {
            series.setStatus(seriesDetails.getStatus());
        }

        return seriesRepository.save(series);
    }

    @Transactional
    public void deleteSeries(Long id) {
        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Series not found with id: " + id));
        seriesRepository.delete(series);
    }


}