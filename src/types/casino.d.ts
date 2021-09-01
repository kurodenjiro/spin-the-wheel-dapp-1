/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type WheelSpin = ContractEventLog<{
  player: string;
  prizes: string[];
  wonPrizeIndex: string;
  0: string;
  1: string[];
  2: string;
}>;

export interface Casino extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Casino;
  clone(): Casino;
  methods: {
    getPrizes(): NonPayableTransactionObject<string[]>;

    getProfit(): NonPayableTransactionObject<string>;

    spinWheel(): PayableTransactionObject<void>;
  };
  events: {
    WheelSpin(cb?: Callback<WheelSpin>): EventEmitter;
    WheelSpin(options?: EventOptions, cb?: Callback<WheelSpin>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "WheelSpin", cb: Callback<WheelSpin>): void;
  once(
    event: "WheelSpin",
    options: EventOptions,
    cb: Callback<WheelSpin>
  ): void;
}