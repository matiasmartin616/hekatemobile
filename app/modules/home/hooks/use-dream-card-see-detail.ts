import { useRouter } from "expo-router";

export default function useDreamCardSeeDetail() {
    const router = useRouter();

    const handleSeeDreamDetail = (dreamId: string) => {
        router.push({
            pathname: "/(routes)/(private)/dreams/[id]",
            params: { id: dreamId }
        });
    };

    return { handleSeeDreamDetail };
}
