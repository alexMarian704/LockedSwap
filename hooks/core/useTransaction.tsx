/* eslint-disable react-hooks/exhaustive-deps */
import {
  Address,
  Transaction,
  ITransactionPayload,
  IGasLimit,
  SmartContract,
  ContractFunction,
  U64Value,
  Interaction,
  TokenPayment,
} from '@elrondnetwork/erdjs';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { useSnapshot } from 'valtio';
import { accountState, loginInfoState } from '../../store/auth';
import { getNetworkState } from '../../store/network';
import { chainType, networkConfig } from '../../config/network';
import { DappProvider } from '../../types/network';
import { useState } from 'react';
import { useWebWalletTxSend } from './common-helpers/useWebWalletTxSend';
import {
  TransactionCb,
  sendTxOperations,
} from './common-helpers/sendTxOperations';
import BigNumber from 'bignumber.js';

interface TransactionParams {
  address: string;
  gasLimit: IGasLimit;
  data?: ITransactionPayload;
  value?: number;
}

interface TransactionArgs {
  webWalletRedirectUrl?: string;
  cb?: (params: TransactionCb) => void;
}

export function useTransaction(
  { webWalletRedirectUrl, cb }: TransactionArgs = {
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
    address,
    data,
    gasLimit,
    value,
  }: TransactionParams) => {
    setTransaction(null);
    setError('');

    if (
      dappProvider &&
      apiNetworkProvider &&
      currentNonce !== undefined &&
      !pending &&
      accountSnap.address
    ) {
      setPending(true);
      cb?.({ pending: true });

      // const tx = new Transaction({
      //   nonce: currentNonce,
      //   receiver: new Address(address),
      //   gasLimit,
      //   chainID: networkConfig[chainType].shortId,
      //   data,
      //   ...(value ? { value: TokenPayment.egldFromAmount(value)} : {}),
      //   sender: new Address(accountSnap.address),
      // });

      //////////////////////////////////////////////////////////////
      const tx = new Transaction({
        nonce: currentNonce,
        receiver: new Address(address),
        gasLimit,
        chainID: networkConfig[chainType].shortId,
        data,
        // ...(value ? { value: TokenPayment.metaEsdtFromAmount("333-123e1b", currentNonce ,value , 18) } : {}),
        sender: new Address(accountSnap.address),
      });

      //////////////////////////////////////////////
      // let ca = new Address("erd1qqqqqqqqqqqqqpgq45uzvl6hscsrn4hjve8dlmq4v0q47h9s0eqqckn8rf")
      // let contract = new SmartContract({address:ca});
      // let contractfunction = new ContractFunction("egld_esdt_swap");
      // let args = [new U64Value(10000)];

      // let interaction = new Interaction(contract , contractfunction , args)
      // let addressOfCarol = new Address(accountSnap.address);
  
      // const tx = contract.call({
      //   func: contractfunction,
      //   gasLimit:gasLimit,
      //   args:args,
      //   chainID:networkConfig[chainType].shortId
      // })
      // tx.setValue(TokenPayment.egldFromAmount(0.2))
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
