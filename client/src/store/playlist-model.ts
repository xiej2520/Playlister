export interface ISong {
	title: string;
	artist: string;
	youTubeId: string;
}

export interface IPlaylist {
	name: string;
	ownerEmail: string;
	songs: ISong[]
	_id: any
};

export default IPlaylist;
