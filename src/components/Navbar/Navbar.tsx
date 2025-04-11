import { AppBar, Tabs, Tab, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const value = location.pathname === '/' ? 0 
              : location.pathname === '/sobre' ? 1 
              : 0;

  return (
    <Box sx={{ width: '100%' }} className="navbar-container">
      <AppBar position="static" sx={{ backgroundColor: '#242424' }}>
        <Tabs 
          value={value} 
          centered
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              '&.Mui-selected': {
                color: 'rgba(255, 255, 255, 0.87)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'rgba(255, 255, 255, 0.87)',
            },
          }}
        >
          <Tab label="Home" component={Link} to="/" />
          <Tab label="Sobre Mim" component={Link} to="/sobre" />
        </Tabs>
      </AppBar>
    </Box>
  );
};

export default Navbar;