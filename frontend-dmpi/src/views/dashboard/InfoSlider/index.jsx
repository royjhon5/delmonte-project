import { Box, Paper } from "@mui/material";
import Slider from "react-slick";
import img1 from '../../../assets/images/slider_images/cover_1.jpg'
import img2 from '../../../assets/images/slider_images/cover_2.jpg'
import img3 from '../../../assets/images/slider_images/cover_3.jpg'
const InfoSlider = () => {
  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    speed: 700,
    autoplaySpeed: 2000,
  };
  return (
    <Paper sx={{
        padding: 0, 
        backgroundImage: 'none',
        zIndex: 0,
        position: 'relative',
        overflow: 'hidden',
    }}>
        <Slider {...settings} style={{ position: 'relative', display: 'block', boxSizing: 'border-box'}}>
            <Box sx={{ height:'320px', width: 'auto' }}>
              <img src={img1} />
            </Box>
            <Box sx={{ height:'320px', width: 'auto' }}>
              <img src={img2} />
            </Box>
            <Box sx={{ height:'320px', width: 'auto' }}>
              <img src={img3} />
            </Box>
        </Slider>
    </Paper>
  )
}

export default InfoSlider