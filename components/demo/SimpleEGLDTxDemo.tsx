import { Link, Text } from '@chakra-ui/react';
import { ESDTTransferPayloadBuilder, TokenPayment, TransactionPayload } from '@elrondnetwork/erdjs';
import { useTransaction } from '../../hooks/core/useTransaction';
import { useCallback, useEffect } from 'react';
import { ActionButton } from '../tools/ActionButton';
import { networkConfig, chainType } from '../../config/network';
import { shortenHash } from '../../utils/shortenHash';
import { FlexCardWrapper } from '../ui/CardWrapper';
import { TransactionCb } from '../../hooks/core/common-helpers/sendTxOperations';

const egldTransferAddress = process.env.NEXT_PUBLIC_EGLD_TRANSFER_ADDRESS || '';
const egldTransferAmount = process.env.NEXT_PUBLIC_EGLD_TRANSFER_AMOUNT || '';

export const SimpleEGLDTxDemo = ({ cb, }: { cb: (params: TransactionCb) => void; }) => {
  const { pending, triggerTx, error, transaction } = useTransaction({ cb });

  const handleSendTx = useCallback(() => {

    const demoMessage = 'Transaction demo!';
    let payment = TokenPayment.fungibleFromAmount("333-123e1b" , 100*10**18 , 0)
    let data = new ESDTTransferPayloadBuilder().setPayment(payment).build();

    triggerTx({
      address: "erd1qqqqqqqqqqqqqpgqk5xp67vn7q4ncvckfzq6w30ld6pk4gl2n60qkvdrzz",
      gasLimit: 50000 + 1500 * data.length() + 1000000,
      data: data,
      value: Number(0.5),
    }).catch((err)=>{
      console.log(err)
    })
    // triggerTx({
    //   address: egldTransferAddress,
    //   gasLimit: 60000000,
    //   // data: new TransactionPayload(demoMessage),
    //   value: Number(0.5),
    // })
  }, [triggerTx]);

  useEffect(()=>{
    console.log(transaction?.getHash().hex())
  },[transaction?.getHash().hex()])

  return (
    <FlexCardWrapper>
      <Text mb={4}>
        1. You will be sending 0.001 EGLD to the address: <br />
        <Link
          href={`${networkConfig[chainType].explorerAddress}/accounts/${egldTransferAddress}`}
          fontWeight="bold"
        >
          {shortenHash(egldTransferAddress, 8)}
        </Link>{' '}
        <br />
        (devnet)
      </Text>
      <ActionButton disabled={pending} onClick={handleSendTx}>
        <Text>Send Transaction</Text>
      </ActionButton>
    </FlexCardWrapper>
  );
};
