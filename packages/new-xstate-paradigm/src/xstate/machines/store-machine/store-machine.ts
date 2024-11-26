import { fromPromise, setup } from "xstate";
import { itemsService } from "../../services/items-service.js";
import { Item } from "../../../lib/types/item/item.js";


const fromPromiseItemsService = fromPromise(async () => await itemsService());

export const storeMachineSchema = {
    types: {
        context: {
            items: new Array<Item>(),
            loading: false
        },
    },
    actions: {
        setItems: ({ context, event }: any) => {
            context.items = event.output.map((item: Item) => item);
        },
        isLoading: ({ context }: any) => {
            context.loading = !context.loading;
        },
    },
    actors: {
        itemsService: fromPromiseItemsService
    }
};

export const storeMachine = setup(storeMachineSchema).createMachine({
    id: 'storeMachine',
    initial: 'loading',
    context: () => ({
        items: new Array<Item>(),
        cartItems: new Array<Item>(),
        loading: false
    }),
    states: {
        loading: {
            entry: ['isLoading'],
            invoke: {
                id: 'itemsService',
                src: 'itemsService',
                onDone: {
                    target: 'loaded',
                    actions: 'setItems'
                }
            }
        },
        loaded: {
            entry: ['isLoading'],
            on: {
                RELOAD: 'loading',
            }
        },
    }
});