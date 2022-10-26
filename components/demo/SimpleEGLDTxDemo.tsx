import { Link, Text } from '@chakra-ui/react';
import { ESDTTransferPayloadBuilder, TokenPayment, TransactionPayload } from '@elrondnetwork/erdjs';
import { useTransaction } from '../../hooks/core/useTransaction';
import { useCallback } from 'react';
import { ActionButton } from '../tools/ActionButton';
import { networkConfig, chainType } from '../../config/network';
import { shortenHash } from '../../utils/shortenHash';
import { FlexCardWrapper } from '../ui/CardWrapper';
import { TransactionCb } from '../../hooks/core/common-helpers/sendTxOperations';

const egldTransferAddress = process.env.NEXT_PUBLIC_EGLD_TRANSFER_ADDRESS || '';
const egldTransferAmount = process.env.NEXT_PUBLIC_EGLD_TRANSFER_AMOUNT || '';

export const SimpleEGLDTxDemo = ({
  cb,
}: {
  cb: (params: TransactionCb) => void;
}) => {
  const { pending, triggerTx, error } = useTransaction({ cb });

  const handleSendTx = useCallback(() => {
    const demoMessage = 'Transaction demo!';
    let payment = TokenPayment.fungibleFromAmount("333-123e1b" , 1*10**18 , 0)
    let data = new ESDTTransferPayloadBuilder().setPayment(payment).build();

    triggerTx({
      address: egldTransferAddress,
      gasLimit: 50000 + 1500 * data.length() + 1000000,
      data: data,
      // value: Number(0.5),
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
