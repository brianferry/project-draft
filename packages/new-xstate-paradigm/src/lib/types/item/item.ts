import { State } from "@heymp/signals";

export type Item = {
    uuid: string;
    id: string;
    name: string;
    price: number;
    size: number;
    unit: 'kg' | 'each';
}

export type ItemSignal = State<Item>;