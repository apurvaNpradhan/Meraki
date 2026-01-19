export const DEFAULT_PROJECT_STATUSES = [
	{
		name: "Backlog",
		type: "backlog",
		position: "a",
		colorCode: "#B3B1AD",
		description: null,
	},
	{
		name: "Planned",
		type: "planned",
		position: "b",
		colorCode: "#FFB454",
		description: null,
	},
	{
		name: "In Progress",
		type: "in_progress",
		position: "c",
		colorCode: "#59C2FF",
		description: null,
	},
	{
		name: "Completed",
		type: "completed",
		position: "d",
		colorCode: "#C2D94C",
		description: null,
	},
	{
		name: "Canceled",
		type: "canceled",
		position: "e",
		colorCode: "#F07178",
		description: null,
	},
] as const;
