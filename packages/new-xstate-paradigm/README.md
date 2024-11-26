# Xstate Paradigm

## Introduction

Here we're going to make a simple example of how to use the Xstate library to create a state machine using best practices.

This app will show a list of grocery items and you can add or remove items from the list.

You can click the cart button to see the items you've added to the list.

You can click the checkout button to see the items you've added to the list and remove them.

You can click the buy button to go to the final screen.

### Components

- App
- Store
- Cart
- Checkout
- Purchase

### States

- App
  - Store
    - Context
      - items 
      - added items
  - Cart
    - Context
      - store added items
    - actions
      - reset items 
      - remove items
  - Checkout
    - Context
      - store added items
    - actions
      - remove items   
  - Purchase
    - Context
      - store added items
    - actions
      - purchase 