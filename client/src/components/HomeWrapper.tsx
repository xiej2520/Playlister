import { Grid } from "@mui/material";
import HomeScreen from "./HomeScreen";
import StatusBar from "./StatusBar";
import YouTubeWrapper from "./YouTubeWrapper";

export default function HomeWrapper() {
	return (
		<Grid container
			sx={{
				width: "100vw",
				height: "100%"
			}}
		>
			<Grid item xs={6} sx={{ height: "90%" }}>
				<HomeScreen/>
			</Grid>
			<Grid item xs={6} sx={{ height: "90%" }}>
				<YouTubeWrapper/>
			</Grid>
			<Grid item xs={12}
				container
				alignItems='center'
				justifyContent='center'
				sx={{ height: '8vh', align: 'center'}}
			>
				<StatusBar/>
			</Grid>
		</Grid>
	)
}
