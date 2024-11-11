import { setup } from "xstate";
import { ItemSignal } from "../../../lib/types/item/item.js";
import { getParentMachineById } from "../../../lib/helpers/grandparent-machine.js";
// import { getParentMachineById } from "../../../lib/helpers/grandparent-machine.js";
export const quantityMachine = setup({
    types: {
        context: {} as {
            item: ItemSignal;
        },
        input: {} as {
            item: ItemSignal;
        },
    },
    actions: {
        // increment: sendParent(({ context }) => ({ type: 'INCREMENT', id: context.item.id })),
        // decrement: sendParent(({ context }) => ({ type: 'DECREMENT', id: context.item.id })),
    increment: (context) => getParentMachineById(context, 'x:0')?.send({ type: 'INCREMENT', id: context.context.item.id }),
    decrement: (context) => getParentMachineById(context, 'x:0')?.send({ type: 'DECREMENT', id: context.context.item.id }),
        logCurrentContext: (_) => {
            console.log('logging context from quantity-machine');
        }
    }
}).createMachine({
    id: 'quantityMachine',
    initial: 'idle',
    context: ({ input }) => ({
        item: input.item
    }),
    states: {
        idle: {
            on: {
                INCREMENT_QUANTITY: {
                    actions: ['increment']
                },
                DECREMENT_QUANTITY: {
                    actions: 'decrement'
                },
                LOG_CURRENT_CONTEXT: {
                    actions: 'logCurrentContext'
                }
            }
        }
    }
});