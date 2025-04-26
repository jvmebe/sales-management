<script lang="ts" module>
	import AudioWaveform from "@lucide/svelte/icons/audio-waveform";
	import BookOpen from "@lucide/svelte/icons/book-open";
	import Bot from "@lucide/svelte/icons/bot";
	import ChartPie from "@lucide/svelte/icons/chart-pie";
	import Command from "@lucide/svelte/icons/command";
	import Frame from "@lucide/svelte/icons/frame";
	import GalleryVerticalEnd from "@lucide/svelte/icons/gallery-vertical-end";
	import ClipboardPen from "@lucide/svelte/icons/clipboard-pen"
	import Map from "@lucide/svelte/icons/map";
	import Settings2 from "@lucide/svelte/icons/settings-2";
	import SquareTerminal from "@lucide/svelte/icons/square-terminal";

	// This is sample data.
	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
		teams: [
			{
				name: "Empresa",
				logo: GalleryVerticalEnd,
			},
		],
		navMain: [
			{
				title: "Cadastros",
				url: "#",
				icon: ClipboardPen,
				isActive: true,
				items: [
					{   id: 'sub1',
						title: "Cidade",
						url: "/cidade",
					},
					{
					    id: 'sub2',
						title: "Estado",
						url: "/estado",
					},
					{
					    id: 'sub3',
						title: "País",
						url: "/pais",
					},
					{
					    id: 'sub4',
						title: "Cliente",
						url: "/cliente",
					},
					{
					    id: 'sub5',
						title: "Fornecedor",
						url: "/fornecedor",
					},
					{
					    id: 'sub6',
						title: "Funcionário",
						url: "/funcionario",
					},
					{
					    id: 'sub7',
						title: "Forma de Pagamento",
						url: "/forma-pagamento",
					},
					{
					    id: 'sub8',
						title: "Condição de Pagamento",
						url: "/condicao-pagamento",
					},
				],
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from "$lib/components/nav-main.svelte";
	import NavProjects from "$lib/components/nav-projects.svelte";
	import NavUser from "$lib/components/nav-user.svelte";
	import TeamSwitcher from "$lib/components/team-switcher.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
    import { Title } from "./ui/sheet";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
