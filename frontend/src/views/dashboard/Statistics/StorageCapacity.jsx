import { Paper, Slider, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { hookContainer } from "../../../hooks/globalQuery";
import { useQueryClient } from "@tanstack/react-query";

function valueLabelFormat(value) {
  const units = ['KB', 'MB', 'GB', 'TB'];

  let unitIndex = 0;
  let scaledValue = value;

  while (scaledValue >= 1024 && unitIndex < units.length - 1) {
    unitIndex += 1;
    scaledValue /= 1024;
  }

  return `${scaledValue.toFixed(2)} ${units[unitIndex]}`;
}

function calculateValue(value) {
  return 2 ** value;
}


const StorageCapacity = () => {
  const queryClient = useQueryClient();
  const { data: capacityList } = hookContainer('get-dashboard-total-storage');

  const [value, setValue] = useState(10);

  const totalCapacity = Array.isArray(capacityList) && capacityList.length > 0 && capacityList[0]?.total_storage 
  ? capacityList[0].total_storage 
  : 0;
  
  useEffect(() => {
    queryClient.invalidateQueries(['get-dashboard-total-storage']);
  })

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
    }
  };
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography gutterBottom>
        NAS Current Status: Capacity 8TB - USED Storage: {valueLabelFormat(totalCapacity)}
      </Typography>
      <Slider
        value={totalCapacity}
        min={5}
        step={1}
        max={33}
        scale={calculateValue}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay="auto"
        sx={{
          height: 25,
          '& .MuiSlider-track': {
            background: `linear-gradient(90deg, #3f51b5 ${(totalCapacity / 8000000000) * 100}%, #d3d3d3 0%)`,
          },
          '& .MuiSlider-thumb': {
            backgroundColor: 'transparent',
            border: '2px solid transparent',
          },
        }}
      />
      <Typography variant="caption" component="div" align="center">
        {`${((totalCapacity / 8000000000) * 100)}% Storage Used`}
      </Typography>
    </Paper>
  )
}

export default StorageCapacity