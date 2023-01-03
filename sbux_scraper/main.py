from geojson import Feature, FeatureCollection, Point, dumps
from sbux import Starbucks
from sbux.models import Item, Store


def find_latte(items: list[Item]) -> Item:  # TODO: optimize this.
    for item in items:
        if item.name == "Caffè Latte":
            return item

    raise ValueError("Caffè Latte not found!")


def build_geojson_feature(item: Item, store: Store) -> Feature:
    assert store.longitude and store.latitude, "Invalid coordinates."

    longitude = float(store.longitude)
    latitude = float(store.latitude)

    return Feature(
        geometry=Point((longitude, latitude)),
        properties={
            "Coffee": item.name,
            "Price": item.base_price,
            "Store": store.store_name,
        },
    )


def main():
    starbucks = Starbucks()

    feature_list: list[Feature] = []

    stores = starbucks.get_stores()
    for store in stores[:1]:  # TODO: remove slicing.
        branch_code = store.branch_code
        assert branch_code, "Invalid branch code."

        items = starbucks.get_menu_items(branch_code)

        latte = find_latte(items)
        feature = build_geojson_feature(latte, store)
        feature_list.append(feature)

    feature_collection = FeatureCollection(feature_list)
    with open("data/sbux.json", "w") as f:
        f.write(dumps(feature_collection))


if __name__ == "__main__":
    main()
