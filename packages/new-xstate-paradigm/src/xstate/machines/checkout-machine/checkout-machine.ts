import { Item } from "../../../lib/types/item/item.js";
import { assign, createActor, fromPromise, setup } from "xstate";
import { geoLocation } from "../../services/geolocation-service.js";

const geoLocationServiceFromPromise = fromPromise(async ({ input }: { input: { items: Array<Item> } }) => await geoLocation(input.items));

export interface ItemWithValidity extends Item {
    valid?: boolean;
}

export const checkoutMachineSchema = {
    types: {
        context: {} as {
            items: Array<ItemWithValidity>,
        },
        input: {} as {
            items: Array<Item>,
        },
    },
    actions: {
        setItems: ({ context, event }: any) => {
            context.items = event.items;
        },
        updateItems: ({ context, event }: any) => {
            Object.assign(context.items, event.items);
        },
    },
    actors: {
        geoLocationService: geoLocationServiceFromPromise,
    },
    guards: {
        itemsNotEmpty: ({ context }: any) => {
            return context.items.length > 0;
        }
    }
};


export const checkoutMachine = setup(checkoutMachineSchema).createMachine({
    id: 'checkoutMachine',
    initial: 'idle',
    context: ({ input }) => ({
        items: input && input.items || [],
    }),
    on: {
        LOG_CONTEXT: {
            actions: ({ context }) => console.log(context)
        },
        UPDATE_ITEMS: {
            actions: assign({
                items: ({ event }) => event.items
            }),
            target: '.idle',
        }
    },
    states: {
        idle: {
            always: [
                { 
                    target: 'checkItemAvailability', 
                    guard: 'itemsNotEmpty' 
                }
            ],
            on: {
                SET_ITEMS: {
                    actions: 'setItems',
                    target: 'checkItemAvailability',
                    guard: 'itemsNotEmpty'
                },
                ITEMS_UPDATED: {
                    target: 'idle',
                },
            }
        },
        checkItemAvailability: {
            invoke: {
                id: 'geoLocationService',
                src: 'geoLocationService',
                input: ({context} : any) => ({ items: context.items }),
                onDone: {
                    target: 'loaded',
                    actions: assign({
                        items: ({ event }: any) => event.output
                    })
                }
            }
        },

        loaded: {

        }
    },
});

export const createCheckoutMachine = (input: { items: Array<Item> }) => createActor(checkoutMachine, { input });