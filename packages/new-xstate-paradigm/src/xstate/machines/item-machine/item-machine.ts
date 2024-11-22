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
};

export const itemMachine = setup(itemMachineSchema).createMachine({
    id: 'itemMachine',
    initial: 'idle',
    context: ({ input }) => ({
        item: input.item
    }),
    states: {
        idle: {}
    }
});

export const setupItemMachine = (input: { item: Item }) => createActor(itemMachine, { input });