package org.example.Config;

import org.example.Entities.Genre;
import org.example.Repositories.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private GenreRepository genreRepository;

    @Override
    public void run(String... args) throws Exception {
        if (genreRepository.count() == 0) {
            System.out.println("Inicializando géneros...");

            genreRepository.save(new Genre("Action", null, null));
            genreRepository.save(new Genre("Adventure", null, null));
            genreRepository.save(new Genre("Animation", null, null));
            genreRepository.save(new Genre("Comedy", null, null));
            genreRepository.save(new Genre("Documentary", null, null));
            genreRepository.save(new Genre("Drama", null, null));
            genreRepository.save(new Genre("Fantasy", null, null));
            genreRepository.save(new Genre("Horror", null, null));
            genreRepository.save(new Genre("Musical", null, null));
            genreRepository.save(new Genre("Mystery", null, null));
            genreRepository.save(new Genre("Sci-Fi", null, null));
            genreRepository.save(new Genre("Suspense", null, null));

            System.out.println("Genres Initialized: " + genreRepository.count());
        } else {
            System.out.println("All genres have been loaded into the database: " + genreRepository.count());
        }
    }
}