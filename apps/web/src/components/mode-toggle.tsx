import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	function toggleTheme() {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
	}

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={toggleTheme}
			className="relative overflow-hidden rounded-full"
		>
			<IconSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<IconMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
