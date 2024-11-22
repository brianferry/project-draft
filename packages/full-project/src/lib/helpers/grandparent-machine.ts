import { ActionArgs, EventObject, MachineContext } from "xstate";

export const getParentMachineById = <T extends MachineContext, L extends EventObject, K extends EventObject>(actor: ActionArgs<T, L, K>, machineId: string) => {
    if (actor) {
        let parent = actor.self._parent;
        while (parent) {
            if (parent.id === machineId) {
                return parent;
            }
            parent = parent._parent;
            if (!parent) {
                return null;
            }
        }
    }
    return null;
};