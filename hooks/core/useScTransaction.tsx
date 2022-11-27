/* eslint-disable react-hooks/exhaustive-deps */
import {
  ContractFunction,
  Address,
  Transaction,
  TypedValue,
  TokenPayment,
  ContractCallPayloadBuilder,
  ESDTTransferPayloadBuilder,
  SmartContract,
  Interaction,
  SmartContractAbi,
  TransactionPayload,
  BytesValue,
  BigUIntValue,
} from '@elrondnetwork/erdjs';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { useSnapshot } from 'valtio';
import { accountState, loginInfoState } from '../../store/auth';
import { getNetworkState } from '../../store/network';
import { chainType, networkConfig } from '../../config/network';
import { DappProvider } from '../../types/network';
import { useState } from 'react';
import {
  TransactionCb,
  sendTxOperations,
} from './common-helpers/sendTxOperations';
import { useWebWalletTxSend } from './common-helpers/useWebWalletTxSend';
import BigNumber from 'bignumber.js';

interface ScTransactionParams {
  smartContractAddress: string;
  func: ContractFunction;
  gasLimit: number;
  args: TypedValue[] | undefined;
  value: number | undefined;
}

interface SCTransactionArgs {
  cb?: (params: TransactionCb) => void;
  webWalletRedirectUrl?: string;
}

export function useScTransaction(
  { webWalletRedirectUrl, cb }: SCTransactionArgs = {
    webWalletRedirectUrl: undefined,
    cb: undefined,
  }
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const accountSnap = useSnapshot(accountState);
  const loginInfoSnap = useSnapshot(loginInfoState);

  const dappProvider = getNetworkState<DappProvider>('dappProvider');
  const apiNetworkProvider =
    getNetworkState<ApiNetworkProvider>('apiNetworkProvider');
  const currentNonce = accountSnap.nonce;

  useWebWalletTxSend({ setPending, setTransaction, setError, cb });

  const triggerTx = async ({
    smartContractAddress,
    func,
    gasLimit,
    args,
    value,
  }: ScTransactionParams) => {
    setTransaction(null);
    setError('');
    if (
      dappProvider &&
      apiNetworkProvider &&
      currentNonce !== undefined &&
      !pending &&
      accountSnap.address &&
      func
    ) {
      setPending(true);
      cb?.({ pending: true });

      ///////////////////LKASH SWAP////////////////
      const payload = TransactionPayload.contractCall()
      .setFunction(new ContractFunction("ESDTTransfer"))
      .setArgs([
        BytesValue.fromUTF8("333-123e1b"),
        new BigUIntValue(100 * 10 **18),
        BytesValue.fromUTF8("lkash_egld_swap")
      ]).build();

      const tx = new Transaction({
        data:payload,
        gasLimit,
        ...(value ? { value: 0 } : {}),
        chainID: networkConfig[chainType].shortId,
        receiver: new Address(smartContractAddress),
        sender: new Address(accountSnap.address),
        nonce: currentNonce,
      });


      ////////////EGDL SWAP////////////////////////
      // const data = new ContractCallPayloadBuilder()
      // .setFunction(func)
      // .setArgs(args || [])
      // .build();
      // const tx = new Transaction({
      //   data,
      //   gasLimit,
      //   ...(value ? { value: TokenPayment.egldFromAmount(value) } : {}),
      //   chainID: networkConfig[chainType].shortId,
      //   receiver: new Address(smartContractAddress),
      //   sender: new Address(accountSnap.address),
      // });

      // tx.setNonce(currentNonce);

      sendTxOperations(
        dappProvider,
        tx,
        loginInfoSnap,
        apiNetworkProvider,
        setTransaction,
        setError,
        setPending,
        webWalletRedirectUrl,
        cb
      );
    } else {
      setError(
        'There is something wrong with the network synchronization. Check if you are logged in.'
      );
    }
  };

  return {
    pending,
    triggerTx,
    transaction,
    error,
  };
}
