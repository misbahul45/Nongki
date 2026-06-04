<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { LayoutDashboard, LogOut, Settings, UserCircle } from "@lucide/svelte";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			{@const safeProps = props ?? {}}

			<Button {...safeProps} variant="outline" class="gap-2">
				<UserCircle class="size-4" />
				User
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label>Account</DropdownMenu.Label>

		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<a href="/dashboard" class="flex w-full items-center gap-2">
					<LayoutDashboard class="size-4" />
					Dashboard
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a href="/settings" class="flex w-full items-center gap-2">
					<Settings class="size-4" />
					Settings
				</a>
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Separator />

		<DropdownMenu.Item>
			<a href="/auth/logout" class="flex w-full items-center gap-2 text-destructive">
				<LogOut class="size-4" />
				Logout
			</a>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>