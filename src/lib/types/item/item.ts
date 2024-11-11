import { State } from "@heymp/signals";

export type Item = {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export type ItemSignal = State<Item>;