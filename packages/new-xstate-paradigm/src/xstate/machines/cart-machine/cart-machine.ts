import { Signal } from "@heymp/signals";
import { Item, ItemSignal } from "../../../lib/types/item/item.js";
import { setup } from "xstate";

export const cartMachineSchema = {
    types: {
        context: {
            items: new Signal.State(Array<ItemSignal>()),
        },
    },
    actions: {
        addItem: ({ context, event }: any) => {
            context.items.value.push({...event.item, uuid: Math.random().toString(36).substring(7)});
        },
        removeItem: ({ context, event }: any) => {
            context.items.value = context.items.value.filter((item: Item) => item.uuid !== event.uuid);
        },
        resetCart: ({ context }: any) => {
            context.items.value = [];
        },
    },
};


export const cartMachine = setup(cartMachineSchema).createMachine({
    id: 'cartMachine',
    initial: 'idle',
    context: () => ({
        items: new Signal.State(Array<ItemSignal>()),
    }),
    states: {
        idle: {
            on: {
                ADD_ITEM: {
                    actions: 'addItem'
                },
                REMOVE_ITEM: {
                    actions: 'removeItem'
                },
                RESET_CART: {
                    actions: 'resetCart'
                }
            }
        },
    }
});