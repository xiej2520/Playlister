import { Grid } from "@mui/material";
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
			Workspace
			</Grid>
			<Grid item xs={6} sx={{ height: "90%" }}>
				<YouTubeWrapper/>
			</Grid>
			<Grid item xs={12} sx={{ height: "10vh" }}>
			Status Bar
			</Grid>
		</Grid>
	)
}
