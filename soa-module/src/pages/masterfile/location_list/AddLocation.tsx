import { CustomDialog } from "@/components/custom/CustomDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/store";
import { closeThisDialog } from "@/store/features/openDialog";
import { useDispatch, useSelector } from "react-redux";

export default function AddLocation() {
    const open = useSelector((state: RootState) => state.openDialog.value);
    const dispatch = useDispatch<AppDispatch>();
    return (
        <>
        <CustomDialog 
        isOpen={open} 
        onOpenChange={() => dispatch(closeThisDialog())} 
        title="Add Location" 
        footerContent={<Button>Save data</Button>}>
            <Input placeholder="Location Name" />
        </CustomDialog>
        </>
    )
}