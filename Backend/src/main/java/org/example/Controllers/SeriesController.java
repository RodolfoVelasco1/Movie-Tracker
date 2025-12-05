package org.example.Controllers;

import org.example.Entities.Series;
import org.example.Services.SeriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
@CrossOrigin(origins = "http://localhost:3000")
public class SeriesController {
    @Autowired
    private SeriesService seriesService;

    @GetMapping
    public List<Series> getAllSeries(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false, defaultValue = "asc") String sort) {

        return seriesService.getAllSeries(title, genre, sort);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Series> getSeriesById(@PathVariable Long id) {
        return seriesService.getSeriesById(id)
                .map(series -> ResponseEntity.ok().body(series))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Series createSeries(@RequestBody Series series) {
        return seriesService.createSeries(series);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Series> updateSeries(@PathVariable Long id, @RequestBody Series seriesDetails) {
        try {
            Series updatedSeries = seriesService.updateSeries(id, seriesDetails);
            return ResponseEntity.ok(updatedSeries);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSeries(@PathVariable Long id) {
        try {
            seriesService.deleteSeries(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
