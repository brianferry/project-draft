import { setup } from "xstate";
import { ItemSignal } from "../../../lib/types/item/item.js";

export const itemMachine = setup({
    types: {
        context: {} as {
            item: ItemSignal;
        },
        input: {} as {
            item: ItemSignal;
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
}).createMachine({
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
})