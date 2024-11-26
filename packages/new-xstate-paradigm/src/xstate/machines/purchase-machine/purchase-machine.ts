import { Item } from "../../../lib/types/item/item.js";
import { setup } from "xstate";

export const purchaseMachineSchema = {
    types: {
        context: {} as {
            items: Array<Item>,
        },
        input: {} as {
            items: Array<Item>,
        },
    },
    actions: {
        purchase: () => {
            console.log('purchase');
        }
    },
};


export const purchaseMachine = setup(purchaseMachineSchema).createMachine({
    id: 'purchaseMachine',
    initial: 'idle',
    context: ({ input }: { input: { items: Array<Item> }}) => ({
        items: input.items,
    }),
    states: {
        idle: {
            on: {
                PURCHASE: {
                    actions: 'purchase'
                },
            }
        },
    }
});