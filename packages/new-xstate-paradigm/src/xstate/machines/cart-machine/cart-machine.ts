import { Item } from "../../../lib/types/item/item.js";
import { setup, fromPromise, assign } from "xstate";
import { itemsService } from "../../services/items-service.js";

const xStateItemsService = fromPromise(async () => await itemsService());

export const cartMachineSchema = {
    types: {
        context: {
            items: new Array<Item>()
        },
    },
    actions: {
        setItems: ({ context, event }: any) => {
            context.items = event.output.map((item: Item) => item);
        },
        updateItem: ({ context, event }: any) => {           
            const item = context.items.find((item: Item) => item.id === event.item.id);
            if (item) {
                Object.assign(item, {
                    ...item,
                    ...event.item,
                });
            }
        },
        logCurrentContext: (ctx: any) => {
            console.log(ctx);
        }
    },
    actors: {
        itemsService: xStateItemsService
    }
};


export const cartMachine = setup(cartMachineSchema).createMachine({
    id: 'cartMachine',
    initial: 'loading',
    context: () => ({
        items: new Array<Item>(),
    }),
    states: {
        loading: {
            invoke: {
                id: 'itemsService',
                src: 'itemsService',
                onDone: {
                    target: 'idle',
                    actions: 'setItems'
                }
            }
        },
        idle: {
            on: {
                UPDATE_ITEM: {
                    actions: 'updateItem'
                },
                LOG_CONTEXT: {
                    actions: 'logCurrentContext'
                }
            }
        },
    }
});