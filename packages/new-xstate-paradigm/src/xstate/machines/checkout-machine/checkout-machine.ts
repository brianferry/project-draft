import { assign, createActor, fromPromise, setup } from "xstate";
import { geoLocation } from "../../services/geolocation-service.js";

const geoLocationServiceFromPromise = fromPromise(async ({ input }: { input: { items: Array<checkoutMachineItemSchema> } }) => await geoLocation(input.items));

export class checkoutMachineItemSchema {
    public uuid: string;
    public valid?: boolean;

    constructor(uuid: string) {
        this.uuid = uuid;
        this.valid = false;
    }
}

export const checkoutMachineSchema = {
    types: {
        context: {} as {
            items: Array<checkoutMachineItemSchema>,
        },
        input: {} as {
            items: Array<string>,
        },
    },
    actions: {
        setItems: ({ context, event }: any) => {
            context.items = event.items;
        },
        updateItems: ({ context, event }: any) => {
            Object.assign(context.items, event.items.map((item: string) => new checkoutMachineItemSchema(item)));
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
        items: input && input.items.map(item => new checkoutMachineItemSchema(item)) || [],
    }),
    on: {
        UPDATE_ITEMS: {
            actions: 'updateItems',
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

export const createCheckoutMachine = (input: { items: Array<string> }) => createActor(checkoutMachine, { input });