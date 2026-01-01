
"use client"
import { useEffect, useState } from 'react';

// Simplified types for GitHub API response
interface GitHubEvent {
    type: string;
    payload: {
        commits?: { message: string }[];
    };
    created_at: string;
}

export const useGithubActivity = (username: string) => {
    const [lastCommitMessage, setLastCommitMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!username || typeof window === 'undefined') return;

        const fetchGithubActivity = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${username}/events/public`);
                if (!response.ok) {
                    // Don't throw an error, just log it, so it doesn't break the build
                    console.error('Failed to fetch GitHub activity');
                    return;
                }
                const events: GitHubEvent[] = await response.json();

                // Find the latest push event with commits
                const pushEvent = events.find(
                    (event) => event.type === 'PushEvent' && event.payload.commits && event.payload.commits.length > 0
                );

                if (pushEvent && pushEvent.payload.commits) {
                    const lastCommit = pushEvent.payload.commits[0];
                    setLastCommitMessage(lastCommit.message);
                } else {
                    setLastCommitMessage(null);
                }
            } catch (error) {
                console.error(error);
                setLastCommitMessage(null);
            }
        };

        fetchGithubActivity();

        // Optional: refetch every few minutes
        const intervalId = setInterval(fetchGithubActivity, 5 * 60 * 1000); 

        return () => clearInterval(intervalId);

    }, [username]);

    return { lastCommitMessage };
};
