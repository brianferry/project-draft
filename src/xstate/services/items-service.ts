import { items } from "../../api/mocks/items/items.js";
import { Item } from "../../lib/types/item/item.js";


export const itemsService = (): Promise<Array<Item>> => new Promise((resolve) => {
    console.log('fetching items');
    setTimeout(() => {
    console.log('fetched items');
    console.log(items);
        resolve(items);
    }, 1000);
})