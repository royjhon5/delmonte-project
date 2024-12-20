import { CustomDialog } from "@/components/custom/CustomDialog";
import { AppDispatch, RootState } from "@/store";
import { closeThisDialog } from "@/store/features/openDialog";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

interface ConfirmDialogProps {
    onConfirm: () => void; // Prop for button's onClick handler
}

export default function ConfirmDialog({ onConfirm }: ConfirmDialogProps) {
    const open = useSelector((state: RootState) => state.openDialog.value);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <CustomDialog
            isOpen={open}
            onOpenChange={() => dispatch(closeThisDialog())}
            title="Confirm Changes."
            description="Are you sure you want to update these changes?"
            footerContent={
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={onConfirm}
                >
                    Confirm
                </Button>
            }
        />
    );
}
