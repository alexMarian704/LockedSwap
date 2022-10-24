import { Box, BoxProps } from '@chakra-ui/react';
import { FC, useCallback, PropsWithChildren } from 'react';

interface ActionButtonProps extends BoxProps {
  onClick: () => void;
  isFullWidth?: boolean;
  disabled?: boolean;
}

export const ActionButton: FC<PropsWithChildren<ActionButtonProps>> = ({
  children,
  onClick,
  isFullWidth = false,
  disabled = false,
  ...props
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick?.();
    }
  }, [disabled, onClick]);

  return (
    <Box
      as="button"
      borderColor="transparent"
      borderWidth={2}
      bgColor="#800040"
      py={1.5}
      px={5}
      rounded="6px"
      fontWeight="normal"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      color="dappTemplate.white"
      userSelect="none"
      _hover={!disabled ? { bg: 'rgba(128, 0, 64,0.5)'} : {}}
      transition="background-color .3s"
      width={isFullWidth ? '100%' : 'auto'}
      onClick={handleClick}
      opacity={!disabled ? 1 : 0.5}
      outline={"none"}
      {...props}
    >
      {children}
    </Box>
  );
};
