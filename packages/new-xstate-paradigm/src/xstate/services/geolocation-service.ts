import { checkoutMachineContextSchema } from "../machines/checkout-machine/checkout-machine";

export const geoLocation = (items: checkoutMachineContextSchema[]): Promise<Array<checkoutMachineContextSchema>> => new Promise(async (resolve) => {
    await Promise.all(items.map(async (item) => {
        const valid = await geoLocationIdCheck(item.id);
        Object.assign(item, { valid });
    }));

    resolve(items);
});

export const geoLocationIdCheck = (id: string): Promise<boolean> => new Promise((resolve) => {
    setTimeout(() => {
        resolve(true);
    }, Math.floor(Math.random() * 2000) + 1000);
})