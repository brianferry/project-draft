import { createActor, setup } from "xstate";
import { Item } from "../../../lib/types/item/item.js";

const itemMachineSchema = {
    types: {
        context: {} as {
            item: Item;
        },
        input: {} as {
            item: Item;
        },
    },
    actions: {
        increment: (context) => {
            const item = context.context.item;
            item.value = {
                ...item.value,
                quantity: item.value.quantity + 1
            };
        },
        decrement: (context) => {
            const item = context.context.item;
            item.value = {
                ...item.value,
                quantity: item.value.quantity - 1
            };
        }    
    },
};

export const itemMachine = setup(itemMachineSchema).createMachine({
    id: 'itemMachine',
    initial: 'idle',
    context: ({ input }) => ({
        item: input.item
    }),
    states: {
        idle: {
            on: {
                INCREMENT: {
                    actions: 'increment'
                },
                DECREMENT: {
                    actions: 'decrement'
                }
            },
        }
    }
});

export const setupItemMachine = (input: { item: Item }) => createActor(itemMachine, { input });