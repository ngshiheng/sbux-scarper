# sbux-scraper

This project is a Python script that scrapes data from the Starbucks website and generates a GeoJSON file containing the location and pricing information for "Caffè Latte" menu items at each store.

## Dependencies

- [sbux](https://github.com/ngshiheng/sbux)
- [geojson](https://geojson.org/)
- Python 3.7 or higher

## Usage

To set up the project:

```sh
make dev
```

To start scraping for data:

```sh
make scrape
```

The generated GeoJSON file will be saved in the [docs/](docs/) directory as `data.geojson`.

## Customization

The script is set to scrape data for "Caffè Latte" by default, but this can be changed by modifying the find_latte function to search for a different menu item by name.

Additionally, the script includes a random sleep time between 1 and 5 seconds between requests to prevent overloading the website's servers. This can be adjusted or removed as needed.

## Note

The script uses the sbux package, which is a third-party package that is not officially supported by Starbucks. As such, there is no guarantee that the website's structure will remain the same and the script may need to be updated accordingly.
