/* eslint-disable max-classes-per-file */
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { Actor, AnyStateMachine, createActor } from "xstate";
// import { getStateTree, getStateTreeToStrings } from "../../helpers/state-tree.js";

export class InterpretController<T extends AnyStateMachine> implements ReactiveController {
  host: ReactiveControllerHost;

  value: Actor<T>;

  constructor(host: ReactiveControllerHost, machine: T, options?: any) {
    (this.host = host).addController(this);
    this.value = createActor(machine, options ?? {}) as Actor<T>;
    this.value?.subscribe(() => {
      this.host.requestUpdate();
    });
    this.value?.start();
  }

  hostDisconnected() {
    this.value.stop();
  }
}
