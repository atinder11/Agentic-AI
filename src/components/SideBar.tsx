// src/ResponsiveSidebar.tsx
import * as React from 'react';
import {
  Box, Divider, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar,
  ListSubheader, Avatar, Stack, Typography
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DescriptionIcon from '@mui/icons-material/Description';

const drawerWidth = 280;

type PinnedItem = { id: string; label: string; icon?: React.ReactElement };
type ChatItem = { id: string; title: string };

const pinned: PinnedItem[] = [
  { id: '1', label: 'High Billing...', icon: <DescriptionIcon /> },
  { id: '2', label: 'Create Service Request...', icon: <DescriptionIcon /> },
  { id: '3', label: 'Budget Billing', icon: <DescriptionIcon /> },
  { id: '4', label: 'Payment Arrangement', icon: <DescriptionIcon /> },
  { id: '5', label: 'Meter Re-Read', icon: <DescriptionIcon /> },
  { id: '6', label: 'Courtesy Credit', icon: <DescriptionIcon /> },
  { id: '7', label: 'eBill Enrollment', icon: <DescriptionIcon /> },
  { id: '8', label: 'enroll my account ...', icon: <DescriptionIcon /> },
];

const chats: ChatItem[] = [{ id: 'c1', title: 'Rate increase' }];

export default function ResponsiveSidebar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleDrawer = () => setMobileOpen((v) => !v);

  const SideBarContent = (
    <Box role="presentation" sx={{ width: drawerWidth }}>
      <Toolbar sx={{ px: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
          <Box>
            <Typography variant="subtitle1">Atinder Kumar</Typography>
            <Typography variant="caption" color="text.secondary">
              atinder.kumar@rstartec.com
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
      <Divider />
      <List
        subheader={
          <ListSubheader disableSticky sx={{ bgcolor: 'transparent' }}>
            Pinned Items
          </ListSubheader>
        }
      >
        {pinned.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {item.icon ?? <PushPinIcon />}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <List
        subheader={
          <ListSubheader disableSticky sx={{ bgcolor: 'transparent' }}>
            Chat History
          </ListSubheader>
        }
      >
        {chats.map((c) => (
          <ListItem key={c.id} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ChatBubbleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary={c.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {SideBarContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {SideBarContent}
      </Drawer>
    </Box>
  );
}
