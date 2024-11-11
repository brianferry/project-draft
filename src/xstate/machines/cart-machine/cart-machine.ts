import { Signal, State } from "@heymp/signals";
import { Item, ItemSignal } from "../../../lib/types/item/item.js";
import { assign, setup, fromPromise } from "xstate";
import { itemsService } from "../../services/items-service.js";
import { itemMachine } from "../item-machine/item-machine.js";

const xStateItemsService = fromPromise(async () => await itemsService());


export const cartMachine = setup({
    types: {
        context: {
            items: new Signal.State(Array<ItemSignal>()),
            currentId: ''
        },
    },
    actions: {
        setId: assign({
            currentId: (ctx) => ctx.event.id
        }),
        increment: (ctx) => {
            const items = ctx.context.items.value;
            console.log(items)
            console.log(ctx.context.currentId)
            const item = items.find((item: ItemSignal) => item.value.id === ctx.context.currentId);
            console.log(item);
            if (item) {
                item.value = {
                    ...item.value,
                    quantity: item.value.quantity + 1
                };
            }
        },
        decrement: (ctx) => {
            const items = ctx.context.items.value;
            const item = items.find((item: ItemSignal) => item.value.id === ctx.context.currentId);
            if (item) {
                item.value = {
                    ...item.value,
                    quantity: item.value.quantity - 1
                };
            }
        },
        setItems: ({ context, event }) => {
            context.items.value = event.output.map((item: Item) => new Signal.State(item));
        },
        logCurrentContext: (ctx) => {
            console.log(ctx);
        }
    },
    actors: {
        itemMachine,
        itemsService: xStateItemsService
    },
}).createMachine({
    id: 'cartMachine',
    initial: 'loading',
    context: () => ({
        items: new Signal.State(Array<State<Item>>()),
        currentId: ''
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
                START_ITEM_MACHINE: {
                    actions: ['setId', 'logCurrentContext'],
                    target: 'itemMachine'   
                },
                INCREMENT: {
                    actions: 'increment'
                },
                DECREMENT: {
                    actions: 'decrement'
                },
            },
        },
        itemMachine: {
            on: {
                END_ITEM_MACHINE: {
                    target: 'idle',
                },
                INCREMENT: {
                    actions: 'increment'
                },
                DECREMENT: {
                    actions: 'decrement'
                },
                LOG_CONTEXT: {
                    actions: 'logCurrentContext'
                }
            },
            invoke: {
                id: 'itemMachine',
                src: 'itemMachine',
                input: ({ context }) => ({
                    item: context.items.value.find((item: ItemSignal) => item.value.id === context.currentId) || context.items.value[0]
                })
            }
        }
    }
})