const qr = {
	default : [
		{
			content_type: "text",
			title:"C'est quoi BBC ?",
			payload:"aboutbbc"
			
		},
		{
			content_type: "text",
			title:"Comment tu vas ?",
			payload:"cava"
			
		},
		{
			content_type: "text",
			title:"Je m'ennuie",
			payload:"bored"
			
		},
		{
			content_type: "text",
			title:"Insulte moi je me sens trop bien",
			payload:"insults"
			
		},
		// {
		// 	content_type: "text",
		// 	title:"C'est quoi votre dernier son ?",
		// 	payload:"aboutbbc"
			
		// },
		// {
		// 	content_type: "text",
		// 	title:"Je veux parler à un humain",
		// 	payload:"human_needed"
			
		// },
	],
	bored : [
		{
			content_type: "text",
			title: "Fais moi encore rire !",
			payload:"bored_again"
		},
		{
			content_type: "text",
			title:"C'est quoi BBC ?",
			payload:"aboutbbc"
			
		}
	],
	aboutbbc : [
		{
			content_type: "text",
			title:"Vous avez un site ?",
			payload:"aboutbbc"
		},
		{
			content_type: "text",
			title:"Niquez vous les boloss",
			payload:"insults"
		},

	]
}

module.exports = { qr }