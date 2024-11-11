import { setup } from "xstate";
import { quantityMachine } from "../quantity-machine/quantity-machine.js";
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
        logCurrentContext: (context) => {
            console.log('logging context from item-machine');
            console.log(context);
        },
    },
    actors: {
        quantityMachine
    }
}).createMachine({
    id: 'itemMachine',
    initial: 'idle',
    context: ({ input }) => ({
        item: input.item
    }),
    states: {
        idle: {
            entry: ['logCurrentContext'],
            on: {
                LOG_CURRENT_CONTEXT: {
                    actions: 'logCurrentContext'
                },
                // INCREMENT: {
                //     actions: 'increment'
                // },
                // DECREMENT: {
                //     actions: 'decrement'
                // }
            },
            invoke: {
                id: 'quantityMachine',
                src: 'quantityMachine',
                input: ({ context }) => ({ item: context.item }),
            }
        }
    }
})