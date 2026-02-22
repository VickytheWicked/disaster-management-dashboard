import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface TeamData {
  teamName: string;
  leaderName: string;
  members: string[];
}

export function VolunteerTeamView({ userId }: { userId: number }) {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/team/volunteer/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        const data = await response.json();
        setTeamData(data);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl">Loading team information...</div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl">You are not assigned to any team yet.</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-100">Team: {teamData.teamName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Team Leader: {teamData.leaderName}</p>
        </CardContent>
      </Card>
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-100">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {teamData.members.map((member, index) => (
              <li key={index} className="text-gray-300">{member}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
