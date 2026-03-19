import { BigInt } from "@graphprotocol/graph-ts"
import {
  VotingContract,
  VoteCast,
  VotingRoomFinalized,
  VotingRoomStarted
} from "../generated/VotingContract/VotingContract"
import { VotingRoom, ExampleEntity } from "../generated/schema"

export function handleVoteCast(event: VoteCast): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand

  const entity = new ExampleEntity(event.params.voter.toHex())
    


  // Entity fields can be set based on event parameters
  entity.roomId = event.params.roomId
  entity.voter = event.params.voter
  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.activeVotingRooms(...)
  // - contract.communityVotingId(...)
  // - contract.directory(...)
  // - contract.getActiveVotingRooms(...)
  // - contract.getCommunityVoting(...)
  // - contract.listRoomVoters(...)
  // - contract.owner(...)
  // - contract.votingRoomMap(...)
}

export function handleVotingRoomFinalized(event: VotingRoomFinalized): void {
  const entity = new VotingRoom(event.params.roomId.toHex())
  entity.community = event.params.publicKey
  entity.type = event.params.voteType
  entity.result = event.params.passed
  entity.timestamp = event.block.timestamp
  entity.save()
}

export function handleVotingRoomStarted(event: VotingRoomStarted): void {}
