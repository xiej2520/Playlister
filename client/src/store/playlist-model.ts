export interface ISong {
	title: string;
	artist: string;
	youTubeId: string;
}

export interface IComment {
	text: string;
	ownerUsername: string;
}

export interface IPlaylistExport {
	_id: string;
	name: string;
	ownerUsername: string;
	songs: ISong[];
	publishDate: Date | null;
	listens: number;
	liked: boolean;
	likeCount: number;
	disliked: boolean;
	dislikeCount: number;
	comments: IComment[];
};

export default IPlaylistExport;
