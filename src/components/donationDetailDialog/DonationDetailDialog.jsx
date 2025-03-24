import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Box, 
  Divider, 
  Grid,
  Chip,
  Avatar,
  useTheme
} from "@mui/material";
import { 
  Email, 
  Phone, 
  LocationOn, 
  Event, 
  AccessTime, 
  Fastfood, 
  Inventory2, 
  AssignmentTurnedIn, 
  HourglassTop, 
  Person, 
  Chat, 
  Business,
  Restaurant,
  Scale,
  ContactPhone
} from "@mui/icons-material";
import { Button } from "@material-tailwind/react";

const iconStyle = {
  backgroundColor: 'rgba(25, 118, 210, 0.1)',
  padding: '8px',
  borderRadius: '50%',
  color: '#1976d2',
  marginRight: '12px'
};

function DonationDetailDialog({ open, onClose, selectedDonation }) {
  const theme = useTheme();

  const statusColors = {
    'Pending': theme.palette.warning.main,
    'Accepted': theme.palette.success.main,
    'Rejected': theme.palette.error.main,
    'Completed': theme.palette.info.main
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'linear-gradient(to bottom right, #f9f9f9, #ffffff)',
      },
      }}
    >
      <DialogTitle 
        sx={{ 
          fontWeight: 700, 
          textAlign: "center", 
          fontSize: '1.5rem',
          color: theme.palette.primary.main,
          py: 3,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        Donation Details
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        {selectedDonation && (
          <Box>
            {/* Donor Section */}
            <Box sx={{ 
              mb: 3,
              p: 3,
              borderRadius: '12px',
              backgroundColor: 'rgba(25, 118, 210, 0.03)',
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.dark
              }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.main,
                  mr: 2,
                  width: 32,
                  height: 32
                }}>
                  <Person fontSize="small" />
                </Avatar>
                Donor Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Donor Name</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedDonation.donorName}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">City</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedDonation.city}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Event sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Date</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedDonation.date}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Time</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedDonation.time}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Food Details Section */}
            <Box sx={{ 
              mb: 3,
              p: 3,
              borderRadius: '12px',
              backgroundColor: 'rgba(76, 175, 80, 0.03)',
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.success.dark
              }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.success.main,
                  mr: 2,
                  width: 32,
                  height: 32
                }}>
                  <Restaurant fontSize="small" />
                </Avatar>
                Food Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Fastfood sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Food Type</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {selectedDonation.foodType?.join(", ")} ({selectedDonation.vegNonVeg})
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Scale sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Quantity</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedDonation.quantity} kgs</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Contact & Status Section */}
            <Box sx={{ 
              mb: 3,
              p: 3,
              borderRadius: '12px',
              backgroundColor: 'rgba(156, 39, 176, 0.03)',
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.secondary.dark
              }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.secondary.main,
                  mr: 2,
                  width: 32,
                  height: 32
                }}>
                  <ContactPhone fontSize="small" />
                </Avatar>
                Contact & Status
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Email</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedDonation.email}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Phone Number</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {selectedDonation.phoneNumber} 
                        {selectedDonation.alternatePhoneNumber && ` / ${selectedDonation.alternatePhoneNumber}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HourglassTop sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Status</Typography>
                      <Chip 
                        label={selectedDonation.status || "Pending"} 
                        sx={{ 
                          backgroundColor: statusColors[selectedDonation.status] || theme.palette.grey[300],
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Chat sx={iconStyle} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">Message from Donor</Typography>
                      <Typography variant="body1" fontWeight={500} sx={{ fontStyle: selectedDonation.message ? 'normal' : 'italic' }}>
                        {selectedDonation.message || "No message provided"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* NGO Details (Conditional) */}
            {selectedDonation.status === "Accepted" && selectedDonation.ngoDetails && (
              <Box sx={{ 
                p: 3,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 152, 0, 0.03)',
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  color: theme.palette.warning.dark
                }}>
                  <Avatar sx={{ 
                    bgcolor: theme.palette.warning.main,
                    mr: 2,
                    width: 32,
                    height: 32
                  }}>
                    <Business fontSize="small" />
                  </Avatar>
                  NGO Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={iconStyle} />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Organization Name</Typography>
                        <Typography variant="body1" fontWeight={500}>{selectedDonation.ngoDetails.name}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Business sx={iconStyle} />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Organization Type</Typography>
                        <Typography variant="body1" fontWeight={500}>{selectedDonation.ngoDetails.type}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email sx={iconStyle} />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Email</Typography>
                        <Typography variant="body1" fontWeight={500}>{selectedDonation.ngoDetails.email}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={iconStyle} />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Phone</Typography>
                        <Typography variant="body1" fontWeight={500}>{selectedDonation.ngoDetails.phone}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        justifyContent: "center", 
        p: 3,
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DonationDetailDialog;