import http from "@/api/http";
import { CustomDialog } from "@/components/custom/CustomDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/store";
import { closeThisDialog } from "@/store/features/openDialog";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type AddLocationProps = {
    RefreshData: () => void;
  };
  
type LocationData = {
    id: number;
    location_name: string;
};

const AddLocation: React.FC<AddLocationProps> = ({ RefreshData }) => {
    const [locationName, setLocationName] = useState<string>("");
    const open = useSelector((state: RootState) => state.openDialog.value);   
    const dispatch = useDispatch<AppDispatch>();

    const SaveAndUpdateData = async () => {
        const locationData: LocationData = {
            id: 0,
            location_name: locationName
        }
        try {
            await saveLocationData.mutateAsync(locationData)
        } catch (error) {
            console.error("Error saving department data:", error);
            toast.error("Failed to save department.");
        }
    }
    const saveLocationData = useMutation({
        mutationFn: (locationData: LocationData) => http.post("/post-location", locationData),
        onSuccess: () => {
          dispatch(closeThisDialog());
          toast.success("New data has been saved.");
          RefreshData();
          setLocationName('');
        },
        onError: (error: unknown) => {
          console.error("Error saving department data:", error);
          toast.error("Failed to save department.");
        },
    });

    const closeDialog = () => {
        setLocationName('');
        dispatch(closeThisDialog());
    }

    return (
        <>
        <CustomDialog 
        isOpen={open} 
        onOpenChange={closeDialog} 
        title="Add Location" 
        footerContent={<Button onClick={SaveAndUpdateData}>Save data</Button>}>
            <Input placeholder="Location Name" value={locationName} onChange={(e) => {setLocationName(e.target.value)}} />
        </CustomDialog>
        </>
    )
}

export default AddLocation