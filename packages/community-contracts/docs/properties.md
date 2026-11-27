# Protocol properties and invariants

The properties these contracts have to uphold, and the format for recording them. Covers [`contracts/`](../contracts) and the Foundry suite in [`test/`](../test).

`Property` states one thing that must stay true. `Type` is one of Valid State, State Transition, Variable Transition, High-Level Property or Unit Test. `Risk` is High, Medium or Low. `Tested` says whether a (fuzz) test covers the property today.

The suite in [`test/`](../test) pins contract behaviour down. A property earns a row once it is stated as something a test can check, and the row points at that test.

| Property                                                                                                                                                                                | Type        | Risk | Tested                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---- | ----------------------------------------------------------- |
| Every `VotingContract` finalization batch reads balances from the completed block before finalization began, so transfers in the finalization block cannot count the same tokens twice. | Valid State | High | [Split-batch regression test](../test/VotingContract.t.sol) |
