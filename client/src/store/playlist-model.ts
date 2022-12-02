export interface ISong {
	title: string;
	artist: string;
	youTubeId: string;
}

export interface IPlaylistExport {
	_id: string;
	name: string;
	ownerUsername: string;
	ownerId: string;
	songs: ISong[];
	publishDate: Date | null;
	listens: number;
	liked: boolean;
	likeCount: number;
	disliked: boolean;
	dislikeCount: number;
};

export default IPlaylistExport;
