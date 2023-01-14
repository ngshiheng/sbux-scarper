import random
import time
from typing import List

from geojson import Feature, FeatureCollection, Point, dumps
from sbux import Starbucks
from sbux.models import Item, Store


def find_latte(items: List[Item]) -> Item:
    try:
        return next(item for item in items if item.name == "Caffè Latte")
    except StopIteration:
        raise ValueError("Caffè Latte not found!")


def build_geojson_feature(item: Item, store: Store) -> Feature:
    assert store.longitude and store.latitude, "Invalid coordinates."

    return Feature(
        geometry=Point((float(store.longitude), float(store.latitude))),
        properties={
            "Coffee": item.name,
            "Price": item.base_price,
            "Store": store.store_name,
        },
    )


def main():
    starbucks = Starbucks()

    feature_list = []

    for store in starbucks.get_stores():
        assert store.branch_code, "Invalid branch code."
        print(f"Scraping data from {store.store_name}.")

        try:
            items = starbucks.get_menu_items(store.branch_code)
            feature_list.append(build_geojson_feature(find_latte(items), store))
            time.sleep(random.randint(1, 5))

        except ValueError:
            print(f"Caffè Latte not found for store {store.store_code}")
        except Exception as e:
            print(f"Error occurred for store {store.store_code}: {e}")

    feature_collection = FeatureCollection(feature_list)
    with open("docs/data.geojson", "w") as f:
        f.write(dumps(feature_collection))


if __name__ == "__main__":
    main()
