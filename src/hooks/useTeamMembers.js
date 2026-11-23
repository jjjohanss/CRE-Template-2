import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { teamMembers as bundledTeam } from "@/components/team/teamData";

// Team members are managed in Dashboard → Team (table: team_members).
// If the table isn't set up yet, fall back to the list bundled with the site
// so the Team page never goes blank during setup.
export function useTeamMembers() {
  const q = useQuery({
    queryKey: ["team-members"],
    queryFn: () => api.entities.TeamMember.list("sort_order", 500),
    staleTime: 60_000,
  });
  return {
    members: q.isError ? bundledTeam : q.data ?? [],
    isLoading: q.isLoading,
  };
}
