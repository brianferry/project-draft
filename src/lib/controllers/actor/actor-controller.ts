import { ReactiveController, ReactiveControllerHost } from "lit";
import { AnyActorRef, Subscription } from "xstate";
export class ActorController<T extends AnyActorRef> implements ReactiveController {
    host: ReactiveControllerHost;
  
    private sub?: Subscription;
  
    constructor(host: ReactiveControllerHost, public actor: T, public log?: boolean) {
      (this.host = host).addController(this);
    }
  
    hostConnected() {
      this.sub = this.actor.subscribe((state) => {
        if (this.log) {
          console.log(state);
        }
        this.host.requestUpdate();
      });
    }
  
    unsubscribe() {
      this.sub?.unsubscribe();
    }
    hostDisconnected() {
      this.unsubscribe();
    }
  }
  