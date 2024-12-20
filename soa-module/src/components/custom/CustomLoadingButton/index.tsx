import { Button, CircularProgress, ButtonProps } from "@mui/material";

interface CustomLoadingButtonProps {
  isDisabled?: boolean;
  label: React.ReactNode;
  btnSize?: ButtonProps['size'];
  btnVariant?: ButtonProps['variant'];
  btnClick?: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  fullWidth?: boolean;
  color?: ButtonProps['color'];
  startIcon?: React.ReactNode;
}

const CustomLoadingButton: React.FC<CustomLoadingButtonProps> = ({
  isDisabled = false,
  label,
  btnSize,
  btnVariant,
  btnClick,
  type = "button",
  fullWidth = false,
  color,
  startIcon,
}) => {
  return (
    <Button
      type={type}
      onClick={btnClick}
      size={btnSize}
      startIcon={
        isDisabled ? (
          <CircularProgress
            size={13}
            sx={{
              color: "black"
            }}
          />
        ) : (
          startIcon
        )
      }
      variant={btnVariant}
      disabled={isDisabled}
      fullWidth={fullWidth}
      color={color}
    >
      {label}
    </Button>
  );
};

export default CustomLoadingButton;
