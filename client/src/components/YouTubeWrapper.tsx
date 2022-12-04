
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import YouTube from 'react-youtube';
import CommentView from './CommentView';

interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
			style={{height: "100%"}}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
}


export default function YouTubeWrapper() {
	const theme = useTheme();
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index: number) => {
		setValue(index);
	};
	
	const opts = {
		height: '400px',
		width: '100%'
	};

	return (
		<Box>
			<AppBar position="static">
				<Tabs
					value={value}
					onChange={handleChange}
					indicatorColor="primary"
					textColor="inherit"
					variant="fullWidth"
					aria-label="youtube player and comments tabs"
				>
					<Tab label="Player" {...a11yProps(0)} />
					<Tab label="Comments" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0} dir={theme.direction}>
				<YouTube videoId="dQw4w9WgXcQ" opts={opts}/>

			</TabPanel>
			<TabPanel value={value} index={1} dir={theme.direction}>
				<CommentView></CommentView>
			</TabPanel>
		</Box>
	);
}
