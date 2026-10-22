# Protocol properties and invariants

The properties these contracts have to uphold, and the format for recording them. Covers [`contracts/`](../contracts) and the Foundry suite in [`test/`](../test).

`Property` states one thing that must stay true. `Type` is one of Valid State, State Transition, Variable Transition, High-Level Property or Unit Test. `Risk` is High, Medium or Low. `Tested` says whether a (fuzz) test covers the property today.

The table is empty: no property has been written down here yet. The suite in [`test/`](../test), 59 tests over the three contracts, is what pins the behaviour down for now. A property earns a row once it is stated as something a test can check, and the row should point at that test once one exists.

| Property | Type | Risk | Tested |
| -------- | ---- | ---- | ------ |
|          |      |      |        |
