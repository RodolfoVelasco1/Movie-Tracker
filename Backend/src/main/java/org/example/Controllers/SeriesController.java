package org.example.Controllers;

import org.example.Entities.Series;
import org.example.Services.SeriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/series")
@CrossOrigin(origins = "http://localhost:3000")
public class SeriesController {
    @Autowired
    private SeriesService seriesService;

    @GetMapping
    public List<Series> getAllSeries(
            Principal principal,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false, defaultValue = "asc") String sort) {

        return seriesService.getAllSeries(principal.getName(), title, genre, sort);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Series> getSeriesById(@PathVariable Long id) {
        return seriesService.getSeriesById(id)
                .map(series -> ResponseEntity.ok().body(series))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Series createSeries(Principal principal, @RequestBody Series series) {
        return seriesService.createSeries(principal.getName(), series);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Series> updateSeries(Principal principal, @PathVariable Long id, @RequestBody Series seriesDetails) {
        try {
            Series updatedSeries = seriesService.updateSeries(principal.getName(), id, seriesDetails);
            return ResponseEntity.ok(updatedSeries);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSeries(Principal principal, @PathVariable Long id) {
        try {
            seriesService.deleteSeries(principal.getName(), id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
