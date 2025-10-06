// src/ResponsiveSidebar.tsx
import * as React from 'react';
import {
  Box, Divider, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar,
  useMediaQuery, useTheme, ListSubheader, Avatar, Stack, Typography
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DescriptionIcon from '@mui/icons-material/Description';

const drawerWidth = 280;

type PinnedItem = { id: string; label: string; icon?: React.ReactElement };
type ChatItem = { id: string; title: string };

const pinned: PinnedItem[] = [
  { id: '1', label: 'To use interactive o...', icon: <DescriptionIcon /> },
  { id: '2', label: 'There are several re...', icon: <DescriptionIcon /> },
  { id: '3', label: '1234', icon: <DescriptionIcon /> },
  { id: '4', label: 'Edit', icon: <DescriptionIcon /> },
  { id: '5', label: 'Testing', icon: <DescriptionIcon /> },
  { id: '6', label: 'Test', icon: <DescriptionIcon /> },
  { id: '7', label: '455hehe', icon: <DescriptionIcon /> },
  { id: '8', label: 'For setting up a pay...', icon: <DescriptionIcon /> },
];

const chats: ChatItem[] = [{ id: 'c1', title: 'Rate increase' }];

export default function ResponsiveSidebar() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleDrawer = () => setMobileOpen((v) => !v);

  const SideBarContent = (
    <Box role="presentation" sx={{ width: drawerWidth }}>
      <Toolbar sx={{ px: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>V</Avatar>
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
