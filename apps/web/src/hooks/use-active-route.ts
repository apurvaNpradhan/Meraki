import { useRouterState } from "@tanstack/react-router";

function normalize(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}

export function useRouteActive() {
	const {
		location: { pathname },
	} = useRouterState();

	return (path: string, exact = false) => {
		const target = normalize(path);
		const current = normalize(pathname);

		if (exact) {
			return current === target;
		}

		return current === target || current.startsWith(`${target}/`);
	};
}
