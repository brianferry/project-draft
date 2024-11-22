// import { AnyMachineSnapshot } from "xstate";

// export function getStateTree<T extends AnyMachineSnapshot>(state: T) {
//     const stateTree: Map<AnyMachineSnapshot, string | undefined> = new Map();
  
//     function recursiveMerge(_state: T) {
//       stateTree.set(_state, _state..toStrings().at(-1))
//       if (!_state.children) return;
  
//       for (const child of Object.values(_state.children)) {
//         const snapshot = child.getSnapshot();
//         if (snapshot) recursiveMerge(child.getSnapshot());
  
//       }
//     }
//     recursiveMerge(state);
//     return stateTree;
//   }
  
//   export function getStateTreeToStrings<T extends AnyState>(state: T) {
//     return Array.from(getStateTree(state).values()).join('.');
//   }
  
//   /**
//    * Get merged meta data for current state.
//    * Meta properties closest to the active state wins.
//    */
//   export function getMetaTree<T extends AnyState>(state: T) {
//     let meta: Record<string, unknown> = {};
  
//     function recursiveMerge(_state: T) {
//       for (const [, metaValues] of Object.entries(_state.meta).reverse()) {
//         meta = {
//           ...meta,
//           ...metaValues as Record<string, unknown>
//         }
//       }
//       for (const child of Object.values(_state.children)) {
//         const snapshot = child.getSnapshot();
//         if (snapshot) recursiveMerge(child.getSnapshot());
//       }
//     }
//     recursiveMerge(state);
//     return meta;
//   }